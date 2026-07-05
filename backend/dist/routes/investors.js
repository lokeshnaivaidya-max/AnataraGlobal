"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
const createInvestorSchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1, 'Company name is required'),
        contactName: zod_1.z.string().min(1, 'Contact name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        investmentStage: zod_1.z.array(zod_1.z.string()).min(1, 'At least one investment stage is required'),
        minTicket: zod_1.z.number().nonnegative(),
        maxTicket: zod_1.z.number().nonnegative(),
    }),
});
router.use(auth_1.authenticate);
// Get list of investors (All authenticated users can browse)
router.get('/', async (req, res) => {
    try {
        const list = await db_1.prisma.investorProfile.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ status: 'success', data: list });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Create investor profile (Admin only)
router.post('/', (0, auth_1.restrictTo)('Admin', 'Super Admin'), (0, validation_1.validateRequest)(createInvestorSchema), async (req, res) => {
    try {
        const { companyName, contactName, email, investmentStage, minTicket, maxTicket } = req.body;
        const existing = await db_1.prisma.investorProfile.findUnique({ where: { email } });
        if (existing) {
            res.status(400).json({ status: 'fail', message: 'Investor email already exists' });
            return;
        }
        const investor = await db_1.prisma.investorProfile.create({
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Update investor profile (Admin only)
router.put('/:id', (0, auth_1.restrictTo)('Admin', 'Super Admin'), async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        const investor = await db_1.prisma.investorProfile.findUnique({ where: { id } });
        if (!investor) {
            res.status(404).json({ status: 'fail', message: 'Investor profile not found' });
            return;
        }
        const updated = await db_1.prisma.investorProfile.update({
            where: { id },
            data: updateData,
        });
        res.status(200).json({ status: 'success', data: updated });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Delete investor profile (Admin only)
router.delete('/:id', (0, auth_1.restrictTo)('Admin', 'Super Admin'), async (req, res) => {
    try {
        const id = req.params.id;
        const investor = await db_1.prisma.investorProfile.findUnique({ where: { id } });
        if (!investor) {
            res.status(404).json({ status: 'fail', message: 'Investor profile not found' });
            return;
        }
        await db_1.prisma.investorProfile.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'Investor profile deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
