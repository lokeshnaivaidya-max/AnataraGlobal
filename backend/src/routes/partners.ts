import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import { prisma } from '../config/db';
import { sendPartnerApprovedEmail } from '../services/email';

const router = Router();

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected']),
  }),
});

router.use(authenticate);
router.use(restrictTo('Admin', 'Super Admin'));

// List all partners/advisors (Admin only)
router.get('/', async (req, res) => {
  try {
    const list = await prisma.advisor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: list });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update partner/advisor status (Admin only)
router.put('/:id/status', validateRequest(updateStatusSchema), async (req, res) => {
  try {
    const id = req.params.id as string; // Advisor profile ID
    const { status } = req.body;

    const advisor = await prisma.advisor.findUnique({
      where: { id },
      include: { user: true },
    }) as any;

    if (!advisor) {
      res.status(404).json({ status: 'fail', message: 'Advisor profile not found' });
      return;
    }

    const updated = await prisma.advisor.update({
      where: { id },
      data: { status },
      include: { user: true },
    }) as any;

    // If status is changed to approved, trigger welcome email
    if (status === 'approved') {
      const email = updated.user.email;
      const name = `${updated.user.firstName} ${updated.user.lastName}`;
      await sendPartnerApprovedEmail(email, name);
      console.log(`[Partner Oversight] Sent approval email to partner: ${email}`);
    }

    res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    console.error('Update partner status error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
