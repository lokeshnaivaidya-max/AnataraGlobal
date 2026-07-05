"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const db_1 = require("../config/db");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
const createEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Event title is required'),
        description: zod_1.z.string().optional(),
        eventDate: zod_1.z.string().datetime('Event date must be a valid datetime'),
        location: zod_1.z.string().optional(),
    }),
});
router.use(auth_1.authenticate);
// Get list of events (All authenticated users can see)
router.get('/', async (req, res) => {
    try {
        const list = await db_1.prisma.platformEvent.findMany({
            orderBy: { eventDate: 'asc' },
        });
        res.status(200).json({ status: 'success', data: list });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Register to an event (triggers email confirmation)
router.post('/register/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const email = req.user.email;
        const event = await db_1.prisma.platformEvent.findUnique({
            where: { id },
        });
        if (!event) {
            res.status(404).json({ status: 'fail', message: 'Event not found' });
            return;
        }
        const eventDetails = `Title: ${event.title}\nDate: ${new Date(event.eventDate).toLocaleString()}\nLocation: ${event.location || 'Online / Remote'}`;
        await (0, email_1.sendEventRegistrationEmail)(email, eventDetails);
        res.status(200).json({
            status: 'success',
            message: `Registration confirmed. Confirmation email sent to ${email}`,
        });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Create new platform event (Admin only)
router.post('/admin/events', (0, auth_1.restrictTo)('Admin', 'Super Admin'), (0, validation_1.validateRequest)(createEventSchema), async (req, res) => {
    try {
        const { title, description, eventDate, location } = req.body;
        const event = await db_1.prisma.platformEvent.create({
            data: {
                title,
                description: description || null,
                eventDate: new Date(eventDate),
                location: location || null,
            },
        });
        res.status(201).json({ status: 'success', data: event });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// Remove platform event (Admin only)
router.delete('/admin/events/:id', (0, auth_1.restrictTo)('Admin', 'Super Admin'), async (req, res) => {
    try {
        const id = req.params.id;
        const event = await db_1.prisma.platformEvent.findUnique({ where: { id } });
        if (!event) {
            res.status(404).json({ status: 'fail', message: 'Event not found' });
            return;
        }
        await db_1.prisma.platformEvent.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'Event deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
