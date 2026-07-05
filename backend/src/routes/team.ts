import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { prisma } from '../config/db';

const router = Router();

const addTeamMemberSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role title is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
  }),
});

router.use(authenticate);

// Add team member to startup
router.post('/startup/:startupId', validateRequest(addTeamMemberSchema), async (req, res) => {
  try {
    const startupId = req.params.startupId as string;
    const { name, role, email } = req.body;

    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      res.status(404).json({ status: 'fail', message: 'Startup not found' });
      return;
    }

    const member = await prisma.teamMember.create({
      data: {
        startupId,
        name,
        role,
        email: email || null,
      },
    });

    res.status(201).json({ status: 'success', data: member });
  } catch (error: any) {
    console.error('Add team member error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// List team members for startup
router.get('/startup/:startupId', async (req, res) => {
  try {
    const startupId = req.params.startupId as string;

    const members = await prisma.teamMember.findMany({
      where: { startupId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: members });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Remove team member
router.delete('/:memberId', async (req, res) => {
  try {
    const memberId = req.params.memberId as string;

    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      res.status(404).json({ status: 'fail', message: 'Team member not found' });
      return;
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    res.status(200).json({ status: 'success', message: 'Team member removed successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
