"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const db_1 = require("../config/db");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
const updateStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'approved', 'rejected']),
    }),
});
router.use(auth_1.authenticate);
router.use((0, auth_1.restrictTo)('Admin', 'Super Admin'));
// List all partners/advisors (Admin only)
router.get('/', async (req, res) => {
    try {
        const list = await db_1.prisma.advisor.findMany({
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Update partner/advisor status (Admin only)
router.put('/:id/status', (0, validation_1.validateRequest)(updateStatusSchema), async (req, res) => {
    try {
        const id = req.params.id; // Advisor profile ID
        const { status } = req.body;
        const advisor = await db_1.prisma.advisor.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!advisor) {
            res.status(404).json({ status: 'fail', message: 'Advisor profile not found' });
            return;
        }
        const updated = await db_1.prisma.advisor.update({
            where: { id },
            data: { status },
            include: { user: true },
        });
        // If status is changed to approved, trigger welcome email
        if (status === 'approved') {
            const email = updated.user.email;
            const name = `${updated.user.firstName} ${updated.user.lastName}`;
            await (0, email_1.sendPartnerApprovedEmail)(email, name);
            console.log(`[Partner Oversight] Sent approval email to partner: ${email}`);
        }
        res.status(200).json({ status: 'success', data: updated });
    }
    catch (error) {
        console.error('Update partner status error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
