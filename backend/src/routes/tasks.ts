import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getMilestoneTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getTaskOverview,
} from '../controllers/tasks';

const router = Router();

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.string().optional(),
  }),
});

const createMilestoneSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Milestone name is required'),
    description: z.string().optional(),
    targetDate: z.string().datetime().optional(),
  }),
});

const updateMilestoneSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    targetDate: z.string().datetime().optional(),
    status: z.string().optional(),
  }),
});

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

router.use(authenticate);

// Projects
router.get('/projects', getProjects);
router.post('/projects', validateRequest(createProjectSchema), createProject);
router.get('/projects/:id', getProject);
router.put('/projects/:id', validateRequest(updateProjectSchema), updateProject);
router.delete('/projects/:id', deleteProject);

// Milestones
router.get('/projects/:id/milestones', getMilestones);
router.post('/projects/:id/milestones', validateRequest(createMilestoneSchema), createMilestone);
router.put('/milestones/:id', validateRequest(updateMilestoneSchema), updateMilestone);
router.delete('/milestones/:id', deleteMilestone);

// Tasks
router.get('/milestones/:id/tasks', getMilestoneTasks);
router.post('/milestones/:id/tasks', validateRequest(createTaskSchema), createTask);
router.put('/tasks/:id', validateRequest(updateTaskSchema), updateTask);
router.delete('/tasks/:id', deleteTask);

// Utility
router.get('/my-tasks', getMyTasks);
router.get('/overview', getTaskOverview);

export default router;
