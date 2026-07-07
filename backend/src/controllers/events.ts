import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';
import { sendEventRegistrationEmail } from '../services/email';

export const getEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const events = await prisma.platformEvent.findMany({
      orderBy: { eventDate: 'asc' },
      include: {
        _count: { select: { registrations: true } },
      },
    });
    res.status(200).json({ status: 'success', data: events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const event = await prisma.platformEvent.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true, feedback: true } },
      },
    });

    if (!event) {
      res.status(404).json({ status: 'fail', message: 'Event not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getUpcomingEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const events = await prisma.platformEvent.findMany({
      where: { eventDate: { gte: new Date() } },
      orderBy: { eventDate: 'asc' },
      include: {
        _count: { select: { registrations: true } },
      },
    });
    res.status(200).json({ status: 'success', data: events });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const registerForEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const email = req.user!.email;

    const event = await prisma.platformEvent.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ status: 'fail', message: 'Event not found' });
      return;
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: id, userId } },
    });

    if (existing) {
      res.status(400).json({ status: 'fail', message: 'Already registered for this event' });
      return;
    }

    const registration = await prisma.eventRegistration.create({
      data: { eventId: id, userId },
    });

    // Send confirmation email
    const eventDetails = `Title: ${event.title}\nDate: ${new Date(event.eventDate).toLocaleString()}\nLocation: ${event.location || 'Online / Remote'}`;
    await sendEventRegistrationEmail(email, eventDetails);

    res.status(201).json({
      status: 'success',
      message: `Registration confirmed. Confirmation email sent to ${email}`,
      data: registration,
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const cancelRegistration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const registration = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: id, userId } },
    });

    if (!registration) {
      res.status(404).json({ status: 'fail', message: 'Registration not found' });
      return;
    }

    await prisma.eventRegistration.delete({
      where: { id: registration.id },
    });

    res.status(200).json({ status: 'success', message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getMyRegistrations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: registrations });
  } catch (error) {
    console.error('Get my registrations error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const submitFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const { rating, comment } = req.body;

    const event = await prisma.platformEvent.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ status: 'fail', message: 'Event not found' });
      return;
    }

    const existingFeedback = await prisma.eventFeedback.findFirst({
      where: { eventId: id, userId },
    });

    if (existingFeedback) {
      res.status(400).json({ status: 'fail', message: 'You have already submitted feedback for this event' });
      return;
    }

    const feedback = await prisma.eventFeedback.create({
      data: { eventId: id, userId, rating, comment },
    });

    res.status(201).json({ status: 'success', data: feedback });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Admin ---

export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, eventDate, location } = req.body;

    const event = await prisma.platformEvent.create({
      data: {
        title,
        description: description || null,
        eventDate: new Date(eventDate),
        location: location || null,
      },
    });

    res.status(201).json({ status: 'success', data: event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const event = await prisma.platformEvent.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ status: 'fail', message: 'Event not found' });
      return;
    }

    await prisma.platformEvent.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getEventRegistrations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: registrations });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getEventFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const feedback = await prisma.eventFeedback.findMany({
      where: { eventId: id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: feedback });
  } catch (error) {
    console.error('Get event feedback error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
