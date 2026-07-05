"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimelineView = exports.getReports = exports.createReport = exports.updateTaskStatus = exports.getTasks = exports.assignTask = exports.updateMeeting = exports.getMeetings = exports.bookMeeting = exports.getAdvisors = exports.updateAdvisorProfile = void 0;
const db_1 = require("../config/db");
const email_1 = require("../services/email");
// --- Advisor Profile management (For Advisor role users) ---
const updateAdvisorProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { expertise, availabilitySlots, bio, rate } = req.body;
        if (req.user.roleName !== 'Advisor' && req.user.roleName !== 'Super Admin') {
            res.status(403).json({ status: 'fail', message: 'Only Advisor role users can create profiles.' });
            return;
        }
        const advisor = await db_1.prisma.advisor.upsert({
            where: { userId },
            update: {
                expertise: expertise || [],
                availabilitySlots: availabilitySlots || {},
                bio: bio || null,
                rate: rate !== undefined ? Number(rate) : 0,
            },
            create: {
                userId,
                expertise: expertise || [],
                availabilitySlots: availabilitySlots || {},
                bio: bio || null,
                rate: rate !== undefined ? Number(rate) : 0,
            },
        });
        res.status(200).json({ status: 'success', data: advisor });
    }
    catch (error) {
        console.error('Update advisor profile error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.updateAdvisorProfile = updateAdvisorProfile;
// --- Booking & Scheduling Endpoints ---
const getAdvisors = async (req, res) => {
    try {
        const { expertise } = req.query;
        const query = {};
        if (expertise) {
            query.expertise = { has: String(expertise) };
        }
        const advisors = await db_1.prisma.advisor.findMany({
            where: query,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        res.status(200).json({ status: 'success', data: advisors });
    }
    catch (error) {
        console.error('Get advisors error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getAdvisors = getAdvisors;
const bookMeeting = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { advisorId, scheduledAt, durationMinutes, meetingLink } = req.body;
        const advisor = await db_1.prisma.advisor.findUnique({
            where: { id: advisorId },
            include: { user: true },
        });
        if (!advisor) {
            res.status(404).json({ status: 'fail', message: 'Advisor not found' });
            return;
        }
        const meeting = await db_1.prisma.meeting.create({
            data: {
                clientId,
                advisorId,
                scheduledAt: new Date(scheduledAt),
                durationMinutes: Number(durationMinutes || 60),
                meetingLink: meetingLink || null,
                status: 'booked',
            },
            include: {
                advisor: {
                    include: { user: true },
                },
            },
        });
        // Generate notification triggers
        const dateStr = new Date(scheduledAt).toLocaleString();
        const meetingDetails = `Advisor: ${advisor.user.firstName} ${advisor.user.lastName}\nTime: ${dateStr}\nDuration: ${durationMinutes} minutes\nLink: ${meetingLink || 'To be shared'}`;
        await (0, email_1.sendConsultationBookedEmail)(req.user.email, meetingDetails);
        res.status(201).json({ status: 'success', data: meeting });
    }
    catch (error) {
        console.error('Book meeting error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.bookMeeting = bookMeeting;
const getMeetings = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.roleName;
        let query = {};
        if (role === 'Advisor') {
            const advisor = await db_1.prisma.advisor.findUnique({ where: { userId } });
            if (!advisor) {
                res.status(200).json({ status: 'success', data: [] });
                return;
            }
            query.advisorId = advisor.id;
        }
        else if (role !== 'Admin' && role !== 'Super Admin') {
            // Normal founder / MSME
            query.clientId = userId;
        }
        const meetings = await db_1.prisma.meeting.findMany({
            where: query,
            include: {
                advisor: {
                    include: { user: { select: { firstName: true, lastName: true, email: true } } },
                },
                client: {
                    select: { firstName: true, lastName: true, email: true },
                },
            },
            orderBy: { scheduledAt: 'desc' },
        });
        res.status(200).json({ status: 'success', data: meetings });
    }
    catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getMeetings = getMeetings;
const updateMeeting = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, notes, meetingLink } = req.body;
        const userId = req.user.id;
        const role = req.user.roleName;
        const meeting = await db_1.prisma.meeting.findUnique({
            where: { id },
            include: { advisor: true },
        });
        if (!meeting) {
            res.status(404).json({ status: 'fail', message: 'Meeting not found' });
            return;
        }
        // Auth check: Admin, client, or the booked advisor can update
        const isClient = meeting.clientId === userId;
        const isAdvisor = meeting.advisor.userId === userId;
        const isAdmin = role === 'Admin' || role === 'Super Admin';
        if (!isClient && !isAdvisor && !isAdmin) {
            res.status(403).json({ status: 'fail', message: 'Unauthorized to update this meeting.' });
            return;
        }
        const updated = await db_1.prisma.meeting.update({
            where: { id },
            data: {
                status: status ?? meeting.status,
                notes: notes ?? meeting.notes,
                meetingLink: meetingLink ?? meeting.meetingLink,
            },
        });
        res.status(200).json({ status: 'success', data: updated });
    }
    catch (error) {
        console.error('Update meeting error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.updateMeeting = updateMeeting;
// --- Task & Progress Tracking ---
const assignTask = async (req, res) => {
    try {
        const { meetingId, assignedToId, title, description, dueDate } = req.body;
        const userId = req.user.id;
        // Check if the assigner is the advisor in that meeting
        const meeting = await db_1.prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { advisor: true },
        });
        if (!meeting || (meeting.advisor.userId !== userId && req.user.roleName !== 'Super Admin')) {
            res.status(403).json({ status: 'fail', message: 'Only the assigned advisor can allocate tasks.' });
            return;
        }
        const task = await db_1.prisma.task.create({
            data: {
                meetingId,
                assignedToId,
                title,
                description,
                dueDate: new Date(dueDate),
                status: 'pending',
            },
        });
        res.status(201).json({ status: 'success', data: task });
    }
    catch (error) {
        console.error('Assign task error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.assignTask = assignTask;
const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.roleName;
        let query = {};
        if (role !== 'Admin' && role !== 'Super Admin') {
            // Direct tasks assigned to the client or meetings of the advisor
            if (role === 'Advisor') {
                const advisor = await db_1.prisma.advisor.findUnique({ where: { userId } });
                if (!advisor) {
                    res.status(200).json({ status: 'success', data: [] });
                    return;
                }
                query.meeting = { advisorId: advisor.id };
            }
            else {
                query.assignedToId = userId;
            }
        }
        const tasks = await db_1.prisma.task.findMany({
            where: query,
            include: {
                meeting: {
                    select: {
                        scheduledAt: true,
                        advisor: { include: { user: { select: { firstName: true, lastName: true } } } },
                    },
                },
                assignedTo: { select: { firstName: true, lastName: true, email: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
        res.status(200).json({ status: 'success', data: tasks });
    }
    catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getTasks = getTasks;
const updateTaskStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body; // 'pending', 'in_progress', 'completed'
        const userId = req.user.id;
        const task = await db_1.prisma.task.findUnique({
            where: { id },
            include: { meeting: { include: { advisor: true } } },
        });
        if (!task) {
            res.status(404).json({ status: 'fail', message: 'Task not found' });
            return;
        }
        // Only assigned user or the advisor can update status
        if (task.assignedToId !== userId && task.meeting.advisor.userId !== userId && req.user.roleName !== 'Super Admin') {
            res.status(403).json({ status: 'fail', message: 'Unauthorized to update task' });
            return;
        }
        const updated = await db_1.prisma.task.update({
            where: { id },
            data: { status },
        });
        res.status(200).json({ status: 'success', data: updated });
    }
    catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.updateTaskStatus = updateTaskStatus;
// --- Reports & Recommendations ---
const createReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { clientId, assessmentId, content, recommendations } = req.body;
        // recommendations is array of: { title, description, priority }
        const advisor = await db_1.prisma.advisor.findUnique({ where: { userId } });
        if (!advisor) {
            res.status(403).json({ status: 'fail', message: 'Only registered advisors can submit reports.' });
            return;
        }
        const report = await db_1.prisma.report.create({
            data: {
                advisorId: advisor.id,
                clientId,
                assessmentId: assessmentId || null,
                content,
            },
        });
        if (recommendations && recommendations.length > 0) {
            const recData = recommendations.map((rec) => ({
                reportId: report.id,
                advisorId: advisor.id,
                title: rec.title,
                description: rec.description || null,
                priority: rec.priority || 'medium',
            }));
            await db_1.prisma.recommendation.createMany({ data: recData });
        }
        const finalReport = await db_1.prisma.report.findUnique({
            where: { id: report.id },
            include: { recommendations: true },
        });
        res.status(201).json({ status: 'success', data: finalReport });
    }
    catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.createReport = createReport;
const getReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.roleName;
        let query = {};
        if (role === 'Advisor') {
            const advisor = await db_1.prisma.advisor.findUnique({ where: { userId } });
            if (!advisor)
                return void res.status(200).json({ status: 'success', data: [] });
            query.advisorId = advisor.id;
        }
        else if (role !== 'Admin' && role !== 'Super Admin') {
            query.clientId = userId;
        }
        const reports = await db_1.prisma.report.findMany({
            where: query,
            include: {
                advisor: { include: { user: { select: { firstName: true, lastName: true } } } },
                client: { select: { firstName: true, lastName: true } },
                recommendations: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ status: 'success', data: reports });
    }
    catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getReports = getReports;
// --- Timeline View ---
const getTimelineView = async (req, res) => {
    try {
        const clientId = req.user.id;
        // Timeline consists of all meetings and milestones (progress tracking)
        const meetings = await db_1.prisma.meeting.findMany({
            where: { clientId },
            select: {
                id: true,
                scheduledAt: true,
                status: true,
                meetingLink: true,
                advisor: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
        const milestones = await db_1.prisma.progressTracking.findMany({
            where: { clientId },
            select: {
                id: true,
                milestoneName: true,
                description: true,
                targetDate: true,
                status: true,
            },
        });
        // Map into timeline format
        const timeline = [
            ...meetings.map((m) => ({
                id: m.id,
                type: 'meeting',
                title: `Advisory Session with ${m.advisor.user.firstName} ${m.advisor.user.lastName}`,
                date: m.scheduledAt,
                status: m.status,
                details: m.meetingLink,
            })),
            ...milestones.map((m) => ({
                id: m.id,
                type: 'milestone',
                title: m.milestoneName,
                date: m.targetDate,
                status: m.status,
                details: m.description,
            })),
        ];
        timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        res.status(200).json({ status: 'success', data: timeline });
    }
    catch (error) {
        console.error('Get timeline view error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getTimelineView = getTimelineView;
