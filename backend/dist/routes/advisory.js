"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const advisory_1 = require("../controllers/advisory");
const router = (0, express_1.Router)();
const updateAdvisorProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        expertise: zod_1.z.array(zod_1.z.string()).min(1, 'At least one expertise area is required'),
        availabilitySlots: zod_1.z.any().refine((val) => typeof val === 'object', 'Availability slots must be an object'),
        bio: zod_1.z.string().optional(),
        rate: zod_1.z.number().nonnegative().optional(),
    }),
});
const bookMeetingSchema = zod_1.z.object({
    body: zod_1.z.object({
        advisorId: zod_1.z.string().uuid('Invalid Advisor ID'),
        scheduledAt: zod_1.z.string().datetime('Scheduled date must be a valid datetime'),
        durationMinutes: zod_1.z.number().int().positive().optional(),
        meetingLink: zod_1.z.string().url('Invalid meeting link URL').optional().or(zod_1.z.literal('')),
    }),
});
const updateMeetingSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['booked', 'completed', 'cancelled']).optional(),
        notes: zod_1.z.string().optional(),
        meetingLink: zod_1.z.string().url('Invalid meeting link').optional(),
    }),
});
const assignTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        meetingId: zod_1.z.string().uuid('Invalid Meeting ID'),
        assignedToId: zod_1.z.string().uuid('Invalid User ID to assign task to'),
        title: zod_1.z.string().min(1, 'Task title is required'),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().datetime().or(zod_1.z.string().date()),
    }),
});
const updateTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'in_progress', 'completed']),
    }),
});
const createReportSchema = zod_1.z.object({
    body: zod_1.z.object({
        clientId: zod_1.z.string().uuid('Invalid client user ID'),
        assessmentId: zod_1.z.string().uuid('Invalid assessment ID').optional(),
        content: zod_1.z.string().min(10, 'Report contents must be descriptive'),
        recommendations: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string().min(1, 'Recommendation title is required'),
            description: zod_1.z.string().optional(),
            priority: zod_1.z.enum(['low', 'medium', 'high']),
        })).optional(),
    }),
});
// All routes require authentication
router.use(auth_1.authenticate);
router.get('/advisors', advisory_1.getAdvisors);
router.put('/profile', (0, validation_1.validateRequest)(updateAdvisorProfileSchema), advisory_1.updateAdvisorProfile);
router.post('/book', (0, validation_1.validateRequest)(bookMeetingSchema), advisory_1.bookMeeting);
router.get('/meetings', advisory_1.getMeetings);
router.put('/meetings/:id', (0, validation_1.validateRequest)(updateMeetingSchema), advisory_1.updateMeeting);
router.post('/tasks', (0, validation_1.validateRequest)(assignTaskSchema), advisory_1.assignTask);
router.get('/tasks', advisory_1.getTasks);
router.put('/tasks/:id', (0, validation_1.validateRequest)(updateTaskSchema), advisory_1.updateTaskStatus);
router.post('/reports', (0, validation_1.validateRequest)(createReportSchema), advisory_1.createReport);
router.get('/reports', advisory_1.getReports);
router.get('/timeline', advisory_1.getTimelineView);
exports.default = router;
