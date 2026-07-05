import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAssessmentsTracker,
} from '../controllers/admin';

const router = Router();

const updateUserRoleSchema = z.object({
  body: z.object({
    roleId: z.string().uuid('Invalid role ID').optional(),
    isEmailVerified: z.boolean().optional(),
  }),
});

// Protect all routes to Admin/Super Admin role users only
router.use(authenticate);
router.use(restrictTo('Admin', 'Super Admin'));

router.get('/users', getUsers);
router.put('/users/:id', validateRequest(updateUserRoleSchema), updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/stats', getDashboardStats);
router.get('/assessments', getAssessmentsTracker);

export default router;
