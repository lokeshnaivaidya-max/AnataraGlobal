import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import {
  getEvents,
  getEvent,
  getUpcomingEvents,
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  submitFeedback,
  createEvent,
  deleteEvent,
  getEventRegistrations,
  getEventFeedback,
} from '../controllers/events';

const router = Router();

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Event title is required'),
    description: z.string().optional(),
    eventDate: z.string().datetime('Event date must be a valid datetime'),
    location: z.string().optional(),
  }),
});

const feedbackSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

// Public / semi-public routes
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/my-registrations', authenticate, getMyRegistrations);
router.get('/:id', getEvent);

// Authenticated routes
router.post('/register/:id', authenticate, registerForEvent);
router.delete('/register/:id', authenticate, cancelRegistration);
router.post('/feedback/:id', authenticate, validateRequest(feedbackSchema), submitFeedback);

// Admin routes
router.post('/admin/events', authenticate, restrictTo('Admin', 'Super Admin'), validateRequest(createEventSchema), createEvent);
router.delete('/admin/events/:id', authenticate, restrictTo('Admin', 'Super Admin'), deleteEvent);
router.get('/admin/events/:id/registrations', authenticate, restrictTo('Admin', 'Super Admin'), getEventRegistrations);
router.get('/admin/events/:id/feedback', authenticate, restrictTo('Admin', 'Super Admin'), getEventFeedback);

export default router;
