import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  updateAdvisorProfile,
  getAdvisors,
  bookMeeting,
  getMeetings,
  updateMeeting,
  assignTask,
  getTasks,
  updateTaskStatus,
  createReport,
  getReports,
  getTimelineView,
} from '../controllers/advisory';

const router = Router();

const updateAdvisorProfileSchema = z.object({
  body: z.object({
    expertise: z.array(z.string()).min(1, 'At least one expertise area is required'),
    availabilitySlots: z.any().refine((val) => typeof val === 'object', 'Availability slots must be an object'),
    bio: z.string().optional(),
    rate: z.number().nonnegative().optional(),
  }),
});

const bookMeetingSchema = z.object({
  body: z.object({
    advisorId: z.string().uuid('Invalid Advisor ID'),
    scheduledAt: z.string().datetime('Scheduled date must be a valid datetime'),
    durationMinutes: z.number().int().positive().optional(),
    meetingLink: z.string().url('Invalid meeting link URL').optional().or(z.literal('')),
  }),
});

const updateMeetingSchema = z.object({
  body: z.object({
    status: z.enum(['booked', 'completed', 'cancelled']).optional(),
    notes: z.string().optional(),
    meetingLink: z.string().url('Invalid meeting link').optional(),
  }),
});

const assignTaskSchema = z.object({
  body: z.object({
    meetingId: z.string().uuid('Invalid Meeting ID'),
    assignedToId: z.string().uuid('Invalid User ID to assign task to'),
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    dueDate: z.string().datetime().or(z.string().date()),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'in_progress', 'completed']),
  }),
});

const createReportSchema = z.object({
  body: z.object({
    clientId: z.string().uuid('Invalid client user ID'),
    assessmentId: z.string().uuid('Invalid assessment ID').optional(),
    content: z.string().min(10, 'Report contents must be descriptive'),
    recommendations: z.array(
      z.object({
        title: z.string().min(1, 'Recommendation title is required'),
        description: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']),
      })
    ).optional(),
  }),
});

// All routes require authentication
router.use(authenticate);

router.get('/advisors', getAdvisors);
router.put('/profile', validateRequest(updateAdvisorProfileSchema), updateAdvisorProfile);
router.post('/book', validateRequest(bookMeetingSchema), bookMeeting);
router.get('/meetings', getMeetings);
router.put('/meetings/:id', validateRequest(updateMeetingSchema), updateMeeting);

router.post('/tasks', validateRequest(assignTaskSchema), assignTask);
router.get('/tasks', getTasks);
router.put('/tasks/:id', validateRequest(updateTaskSchema), updateTaskStatus);

router.post('/reports', validateRequest(createReportSchema), createReport);
router.get('/reports', getReports);
router.get('/timeline', getTimelineView);

export default router;
