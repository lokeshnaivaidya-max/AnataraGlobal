"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
const createInvoiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid('Invalid User ID'),
        amount: zod_1.z.number().positive('Invoice amount must be positive'),
        description: zod_1.z.string().min(1, 'Invoice description is required'),
        dueDate: zod_1.z.string().datetime('Due date must be a valid datetime'),
    }),
});
const updateInvoiceStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'paid', 'failed']),
    }),
});
router.use(auth_1.authenticate);
// --- User Endpoints ---
// Get active user's invoices
router.get('/my-invoices', async (req, res) => {
    try {
        const userId = req.user.id;
        const list = await db_1.prisma.billingLedger.findMany({
            where: { userId },
            orderBy: { invoiceDate: 'desc' },
        });
        res.status(200).json({ status: 'success', data: list });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// --- Admin Endpoints ---
// Get all invoices (Admin only)
router.get('/admin/billing', (0, auth_1.restrictTo)('Admin', 'Super Admin'), async (req, res) => {
    try {
        const list = await db_1.prisma.billingLedger.findMany({
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Create billing invoice (Admin only)
router.post('/admin/billing', (0, auth_1.restrictTo)('Admin', 'Super Admin'), (0, validation_1.validateRequest)(createInvoiceSchema), async (req, res) => {
    try {
        const { userId, amount, description, dueDate } = req.body;
        const userExists = await db_1.prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            res.status(404).json({ status: 'fail', message: 'User not found' });
            return;
        }
        const invoice = await db_1.prisma.billingLedger.create({
            data: {
                userId,
                amount,
                description,
                dueDate: new Date(dueDate),
                status: 'pending',
            },
        });
        res.status(201).json({ status: 'success', data: invoice });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Update billing invoice status (Admin only)
router.put('/admin/billing/:id', (0, auth_1.restrictTo)('Admin', 'Super Admin'), (0, validation_1.validateRequest)(updateInvoiceStatusSchema), async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const invoice = await db_1.prisma.billingLedger.findUnique({ where: { id } });
        if (!invoice) {
            res.status(404).json({ status: 'fail', message: 'Invoice not found' });
            return;
        }
        const updated = await db_1.prisma.billingLedger.update({
            where: { id },
            data: { status },
        });
        res.status(200).json({ status: 'success', data: updated });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
