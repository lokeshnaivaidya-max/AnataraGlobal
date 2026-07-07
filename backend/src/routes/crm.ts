import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  createLeadActivity,
  getLeadActivities,
  getSources,
  createSource,
  deleteSource,
  getPipeline,
  getCrmStats,
} from '../controllers/crm';

const router = Router();

const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    company: z.string().optional(),
    sourceId: z.string().optional(),
    notes: z.string().optional(),
  }),
});

const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    sourceId: z.string().optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost']).optional(),
    value: z.number().nonnegative().optional(),
    notes: z.string().optional(),
    assignedTo: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const createActivitySchema = z.object({
  body: z.object({
    type: z.enum(['call', 'email', 'meeting', 'note', 'task'], { message: 'Invalid activity type' }),
    description: z.string().optional(),
  }),
});

const createSourceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Source name is required'),
    description: z.string().optional(),
  }),
});

// Public routes (no auth required)
router.post('/leads', validateRequest(createLeadSchema), createLead);

// Protected routes
router.use('/sources', authenticate);
router.use('/leads/:id', authenticate);
router.use('/pipeline', authenticate);
router.use('/stats', authenticate);

router.get('/sources', getSources);
router.post('/sources', restrictTo('Admin', 'Super Admin'), validateRequest(createSourceSchema), createSource);
router.delete('/sources/:id', restrictTo('Admin', 'Super Admin'), deleteSource);

router.get('/leads', authenticate, getLeads);
router.get('/leads/:id', getLead);
router.put('/leads/:id', validateRequest(updateLeadSchema), updateLead);
router.delete('/leads/:id', restrictTo('Admin', 'Super Admin'), deleteLead);

router.get('/leads/:id/activities', getLeadActivities);
router.post('/leads/:id/activities', validateRequest(createActivitySchema), createLeadActivity);

router.get('/pipeline', getPipeline);
router.get('/stats', getCrmStats);

export default router;
