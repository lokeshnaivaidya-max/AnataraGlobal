import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import { prisma } from '../config/db';

const router = Router();

const createInvestorSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    contactName: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email address'),
    investmentStage: z.array(z.string()).min(1, 'At least one investment stage is required'),
    minTicket: z.number().nonnegative(),
    maxTicket: z.number().nonnegative(),
  }),
});

router.use(authenticate);

// Get list of investors (All authenticated users can browse)
router.get('/', async (req, res) => {
  try {
    const list = await prisma.investorProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: list });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Create investor profile (Admin only)
router.post('/', restrictTo('Admin', 'Super Admin'), validateRequest(createInvestorSchema), async (req, res) => {
  try {
    const { companyName, contactName, email, investmentStage, minTicket, maxTicket } = req.body;

    const existing = await prisma.investorProfile.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ status: 'fail', message: 'Investor email already exists' });
      return;
    }

    const investor = await prisma.investorProfile.create({
      data: {
        companyName,
        contactName,
        email,
        investmentStage,
        minTicket,
        maxTicket,
      },
    });

    res.status(201).json({ status: 'success', data: investor });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update investor profile (Admin only)
router.put('/:id', restrictTo('Admin', 'Super Admin'), async (req, res) => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    const investor = await prisma.investorProfile.findUnique({ where: { id } });
    if (!investor) {
      res.status(404).json({ status: 'fail', message: 'Investor profile not found' });
      return;
    }

    const updated = await prisma.investorProfile.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Delete investor profile (Admin only)
router.delete('/:id', restrictTo('Admin', 'Super Admin'), async (req, res) => {
  try {
    const id = req.params.id as string;

    const investor = await prisma.investorProfile.findUnique({ where: { id } });
    if (!investor) {
      res.status(404).json({ status: 'fail', message: 'Investor profile not found' });
      return;
    }

    await prisma.investorProfile.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Investor profile deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
