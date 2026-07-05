"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
const addTeamMemberSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        role: zod_1.z.string().min(1, 'Role title is required'),
        email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
    }),
});
router.use(auth_1.authenticate);
// Add team member to startup
router.post('/startup/:startupId', (0, validation_1.validateRequest)(addTeamMemberSchema), async (req, res) => {
    try {
        const startupId = req.params.startupId;
        const { name, role, email } = req.body;
        const startup = await db_1.prisma.startup.findUnique({
            where: { id: startupId },
        });
        if (!startup) {
            res.status(404).json({ status: 'fail', message: 'Startup not found' });
            return;
        }
        const member = await db_1.prisma.teamMember.create({
            data: {
                startupId,
                name,
                role,
                email: email || null,
            },
        });
        res.status(201).json({ status: 'success', data: member });
    }
    catch (error) {
        console.error('Add team member error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// List team members for startup
router.get('/startup/:startupId', async (req, res) => {
    try {
        const startupId = req.params.startupId;
        const members = await db_1.prisma.teamMember.findMany({
            where: { startupId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ status: 'success', data: members });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Remove team member
router.delete('/:memberId', async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const member = await db_1.prisma.teamMember.findUnique({
            where: { id: memberId },
        });
        if (!member) {
            res.status(404).json({ status: 'fail', message: 'Team member not found' });
            return;
        }
        await db_1.prisma.teamMember.delete({
            where: { id: memberId },
        });
        res.status(200).json({ status: 'success', message: 'Team member removed successfully' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
