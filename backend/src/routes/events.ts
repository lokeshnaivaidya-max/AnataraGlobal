import { Router, Response } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo, AuthenticatedRequest } from '../middlewares/auth';
import { prisma } from '../config/db';
import { sendEventRegistrationEmail } from '../services/email';

const router = Router();

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Event title is required'),
    description: z.string().optional(),
    eventDate: z.string().datetime('Event date must be a valid datetime'),
    location: z.string().optional(),
  }),
});

router.use(authenticate);

// Get list of events (All authenticated users can see)
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.platformEvent.findMany({
      orderBy: { eventDate: 'asc' },
    });
    res.status(200).json({ status: 'success', data: list });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Register to an event (triggers email confirmation)
router.post('/register/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const email = req.user!.email;

    const event = await prisma.platformEvent.findUnique({
      where: { id },
    });

    if (!event) {
      res.status(404).json({ status: 'fail', message: 'Event not found' });
      return;
    }

    const eventDetails = `Title: ${event.title}\nDate: ${new Date(event.eventDate).toLocaleString()}\nLocation: ${event.location || 'Online / Remote'}`;
    await sendEventRegistrationEmail(email, eventDetails);

    res.status(200).json({
      status: 'success',
      message: `Registration confirmed. Confirmation email sent to ${email}`,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Create new platform event (Admin only)
router.post('/admin/events', restrictTo('Admin', 'Super Admin'), validateRequest(createEventSchema), async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Remove platform event (Admin only)
router.delete('/admin/events/:id', restrictTo('Admin', 'Super Admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const event = await prisma.platformEvent.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ status: 'fail', message: 'Event not found' });
      return;
    }

    await prisma.platformEvent.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

