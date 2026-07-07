import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import { prisma } from '../config/db';

const router = Router();

const createInvoiceSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid User ID'),
    amount: z.number().positive('Invoice amount must be positive'),
    description: z.string().min(1, 'Invoice description is required'),
    dueDate: z.string().datetime('Due date must be a valid datetime'),
  }),
});

const updateInvoiceStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'paid', 'failed']),
  }),
});

router.use(authenticate);

// --- User Endpoints ---

// Get active user's invoices
router.get('/my-invoices', async (req: any, res) => {
  try {
    const userId = req.user!.id;
    const list = await prisma.billingLedger.findMany({
      where: { userId },
      orderBy: { invoiceDate: 'desc' },
    });
    res.status(200).json({ status: 'success', data: list });
  } catch (error) {
    console.error('Get my invoices error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// --- Admin Endpoints ---

// Get all invoices (Admin only)
router.get('/admin/billing', restrictTo('Admin', 'Super Admin'), async (req, res) => {
  try {
    const list = await prisma.billingLedger.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { invoiceDate: 'desc' },
    });
    res.status(200).json({ status: 'success', data: list });
  } catch (error) {
    console.error('Get all invoices error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Create billing invoice (Admin only)
router.post('/admin/billing', restrictTo('Admin', 'Super Admin'), validateRequest(createInvoiceSchema), async (req, res) => {
  try {
    const { userId, amount, description, dueDate } = req.body;

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    const invoice = await prisma.billingLedger.create({
      data: {
        userId,
        amount,
        description,
        dueDate: new Date(dueDate),
        status: 'pending',
      },
    });

    res.status(201).json({ status: 'success', data: invoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Update billing invoice status (Admin only)
router.put('/admin/billing/:id', restrictTo('Admin', 'Super Admin'), validateRequest(updateInvoiceStatusSchema), async (req, res) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const invoice = await prisma.billingLedger.findUnique({ where: { id } });
    if (!invoice) {
      res.status(404).json({ status: 'fail', message: 'Invoice not found' });
      return;
    }

    const updated = await prisma.billingLedger.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
