import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';
import { sendConsultationBookedEmail } from '../services/email';

// --- Advisor Profile management (For Advisor role users) ---
export const updateAdvisorProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { expertise, availabilitySlots, bio, rate } = req.body;

    if (req.user!.roleName !== 'Advisor' && req.user!.roleName !== 'Super Admin') {
      res.status(403).json({ status: 'fail', message: 'Only Advisor role users can create profiles.' });
      return;
    }

    const advisor = await prisma.advisor.upsert({
      where: { userId },
      update: {
        expertise: expertise || [],
        availabilitySlots: availabilitySlots || {},
        bio: bio || null,
        rate: rate !== undefined ? Number(rate) : 0,
      },
      create: {
        userId,
        expertise: expertise || [],
        availabilitySlots: availabilitySlots || {},
        bio: bio || null,
        rate: rate !== undefined ? Number(rate) : 0,
      },
    });

    res.status(200).json({ status: 'success', data: advisor });
  } catch (error) {
    console.error('Update advisor profile error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Booking & Scheduling Endpoints ---

export const getAdvisors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { expertise } = req.query;

    const query: any = {};
    if (expertise) {
      query.expertise = { has: String(expertise) };
    }

    const advisors = await prisma.advisor.findMany({
      where: query,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ status: 'success', data: advisors });
  } catch (error) {
    console.error('Get advisors error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const bookMeeting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const clientId = req.user!.id;
    const { advisorId, scheduledAt, durationMinutes, meetingLink } = req.body;

    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId },
      include: { user: true },
    });

    if (!advisor) {
      res.status(404).json({ status: 'fail', message: 'Advisor not found' });
      return;
    }

    const meeting = await prisma.meeting.create({
      data: {
        clientId,
        advisorId,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: Number(durationMinutes || 60),
        meetingLink: meetingLink || null,
        status: 'booked',
      },
      include: {
        advisor: {
          include: { user: true },
        },
      },
    });

    // Generate notification triggers
    const dateStr = new Date(scheduledAt).toLocaleString();
    const meetingDetails = `Advisor: ${advisor.user.firstName} ${advisor.user.lastName}\nTime: ${dateStr}\nDuration: ${durationMinutes} minutes\nLink: ${meetingLink || 'To be shared'}`;
    const advisorName = `${advisor.user.firstName} ${advisor.user.lastName}`;
    await sendConsultationBookedEmail(req.user!.email, meetingDetails, advisorName, advisor.user.email);

    res.status(201).json({ status: 'success', data: meeting });
  } catch (error) {
    console.error('Book meeting error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getMeetings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const role = req.user!.roleName;

    let query: any = {};
    if (role === 'Advisor') {
      const advisor = await prisma.advisor.findUnique({ where: { userId } });
      if (!advisor) {
        res.status(200).json({ status: 'success', data: [] });
        return;
      }
      query.advisorId = advisor.id;
    } else if (role !== 'Admin' && role !== 'Super Admin') {
      // Normal founder / MSME
      query.clientId = userId;
    }

    const meetings = await prisma.meeting.findMany({
      where: query,
      include: {
        advisor: {
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
        },
        client: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateMeeting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, notes, meetingLink } = req.body;
    const userId = req.user!.id;
    const role = req.user!.roleName;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: { advisor: true },
    });

    if (!meeting) {
      res.status(404).json({ status: 'fail', message: 'Meeting not found' });
      return;
    }

    // Auth check: Admin, client, or the booked advisor can update
    const isClient = meeting.clientId === userId;
    const isAdvisor = meeting.advisor?.userId === userId;
    const isAdmin = role === 'Admin' || role === 'Super Admin';

    if (!isClient && !isAdvisor && !isAdmin) {
      res.status(403).json({ status: 'fail', message: 'Unauthorized to update this meeting.' });
      return;
    }

    const updated = await prisma.meeting.update({
      where: { id },
      data: {
        status: status ?? meeting.status,
        notes: notes ?? meeting.notes,
        meetingLink: meetingLink ?? meeting.meetingLink,
      },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Task & Progress Tracking ---

export const assignTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { meetingId, assignedToId, title, description, dueDate } = req.body;
    const userId = req.user!.id;

    // Check if the assigner is the advisor in that meeting
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { advisor: true },
    });

    if (!meeting || (meeting.advisor.userId !== userId && req.user!.roleName !== 'Super Admin')) {
      res.status(403).json({ status: 'fail', message: 'Only the assigned advisor can allocate tasks.' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        meetingId,
        assignedToId,
        title,
        description,
        dueDate: new Date(dueDate),
        status: 'pending',
      },
    });

    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const role = req.user!.roleName;

    let query: any = {};
    if (role !== 'Admin' && role !== 'Super Admin') {
      // Direct tasks assigned to the client or meetings of the advisor
      if (role === 'Advisor') {
        const advisor = await prisma.advisor.findUnique({ where: { userId } });
        if (!advisor) {
          res.status(200).json({ status: 'success', data: [] });
          return;
        }
        query.meeting = { advisorId: advisor.id };
      } else {
        query.assignedToId = userId;
      }
    }

    const tasks = await prisma.task.findMany({
      where: query,
      include: {
        meeting: {
          select: {
            scheduledAt: true,
            advisor: { include: { user: { select: { firstName: true, lastName: true } } } },
          },
        },
        assignedTo: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateTaskStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; // 'pending', 'in_progress', 'completed'
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { meeting: { include: { advisor: true } } },
    });

    if (!task) {
      res.status(404).json({ status: 'fail', message: 'Task not found' });
      return;
    }

    // Only assigned user or the advisor can update status
    if (task.assignedToId !== userId && task.meeting?.advisor?.userId !== userId && req.user!.roleName !== 'Super Admin') {
      res.status(403).json({ status: 'fail', message: 'Unauthorized to update task' });
      return;
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Reports & Recommendations ---

export const createReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { clientId, assessmentId, content, recommendations } = req.body; 
    // recommendations is array of: { title, description, priority }

    const advisor = await prisma.advisor.findUnique({ where: { userId } });
    if (!advisor) {
      res.status(403).json({ status: 'fail', message: 'Only registered advisors can submit reports.' });
      return;
    }

    const report = await prisma.report.create({
      data: {
        advisorId: advisor.id,
        clientId,
        assessmentId: assessmentId || null,
        content,
      },
    });

    if (recommendations && recommendations.length > 0) {
      const recData = recommendations.map((rec: any) => ({
        reportId: report.id,
        advisorId: advisor.id,
        title: rec.title,
        description: rec.description || null,
        priority: rec.priority || 'medium',
      }));

      await prisma.recommendation.createMany({ data: recData });
    }

    const finalReport = await prisma.report.findUnique({
      where: { id: report.id },
      include: { recommendations: true },
    });

    res.status(201).json({ status: 'success', data: finalReport });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getReports = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const role = req.user!.roleName;

    let query: any = {};
    if (role === 'Advisor') {
      const advisor = await prisma.advisor.findUnique({ where: { userId } });
      if (!advisor) return void res.status(200).json({ status: 'success', data: [] });
      query.advisorId = advisor.id;
    } else if (role !== 'Admin' && role !== 'Super Admin') {
      query.clientId = userId;
    }

    const reports = await prisma.report.findMany({
      where: query,
      include: {
        advisor: { include: { user: { select: { firstName: true, lastName: true } } } },
        client: { select: { firstName: true, lastName: true } },
        recommendations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Timeline View ---

export const getTimelineView = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const clientId = req.user!.id;

    // Timeline consists of all meetings and milestones (progress tracking)
    const meetings = await prisma.meeting.findMany({
      where: { clientId },
      select: {
        id: true,
        scheduledAt: true,
        status: true,
        meetingLink: true,
        advisor: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    const milestones = await prisma.progressTracking.findMany({
      where: { clientId },
      select: {
        id: true,
        milestoneName: true,
        description: true,
        targetDate: true,
        status: true,
      },
    });

    // Map into timeline format
    const timeline = [
      ...meetings.map((m) => ({
        id: m.id,
        type: 'meeting',
        title: `Advisory Session with ${m.advisor.user.firstName} ${m.advisor.user.lastName}`,
        date: m.scheduledAt,
        status: m.status,
        details: m.meetingLink,
      })),
      ...milestones.map((m) => ({
        id: m.id,
        type: 'milestone',
        title: m.milestoneName,
        date: m.targetDate,
        status: m.status,
        details: m.description,
      })),
    ];

    timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json({ status: 'success', data: timeline });
  } catch (error) {
    console.error('Get timeline view error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
