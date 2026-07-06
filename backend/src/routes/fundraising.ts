import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { uploadSingle } from '../middlewares/upload';
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getProjectInvestors,
  addProjectInvestor,
  updateInvestor,
  removeInvestor,
  getProjectDocuments,
  addProjectDocument,
  removeDocument,
  getFundraisingMetrics,
} from '../controllers/fundraising';

const router = Router();

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    targetAmount: z.number().nonnegative().optional(),
    stage: z.string().optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    targetAmount: z.number().nonnegative().optional(),
    stage: z.string().optional(),
    status: z.string().optional(),
  }),
});

const addInvestorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Investor name is required'),
    email: z.string().email().optional().or(z.literal('')),
    commitment: z.number().nonnegative('Commitment amount must be non-negative'),
    shares: z.number().nonnegative().optional(),
    notes: z.string().optional(),
  }),
});

const updateInvestorSchema = z.object({
  body: z.object({
    status: z.string().optional(),
    commitment: z.number().nonnegative().optional(),
    shares: z.number().nonnegative().optional(),
    notes: z.string().optional(),
  }),
});

const addDocumentSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Category is required'),
    fileName: z.string().optional(),
    filePath: z.string().optional(),
    description: z.string().optional(),
  }),
});

router.use(authenticate);

// Projects
router.get('/projects', getProjects);
router.post('/projects', validateRequest(createProjectSchema), createProject);
router.get('/projects/:id', getProject);
router.put('/projects/:id', validateRequest(updateProjectSchema), updateProject);
router.delete('/projects/:id', deleteProject);

// Investors
router.get('/projects/:id/investors', getProjectInvestors);
router.post('/projects/:id/investors', validateRequest(addInvestorSchema), addProjectInvestor);
router.put('/investors/:id', validateRequest(updateInvestorSchema), updateInvestor);
router.delete('/investors/:id', removeInvestor);

// Documents
router.get('/projects/:id/documents', getProjectDocuments);
router.post('/projects/:id/documents', uploadSingle, validateRequest(addDocumentSchema), addProjectDocument);
router.delete('/documents/:id', removeDocument);

// Metrics
router.get('/metrics', getFundraisingMetrics);

export default router;
