"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentsTracker = exports.getDashboardStats = exports.deleteUser = exports.updateUserRole = exports.getUsers = void 0;
const db_1 = require("../config/db");
// --- User Management Endpoints ---
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = {};
        if (search) {
            query.OR = [
                { email: { contains: String(search), mode: 'insensitive' } },
                { firstName: { contains: String(search), mode: 'insensitive' } },
                { lastName: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        const [users, total] = await db_1.prisma.$transaction([
            db_1.prisma.user.findMany({
                where: query,
                include: { role: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            db_1.prisma.user.count({ where: query }),
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                users,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error('Admin getUsers error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getUsers = getUsers;
const updateUserRole = async (req, res) => {
    try {
        const id = req.params.id;
        const { roleId, isEmailVerified } = req.body;
        const user = await db_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ status: 'fail', message: 'User not found' });
            return;
        }
        const updated = await db_1.prisma.user.update({
            where: { id },
            data: {
                roleId: roleId ?? user.roleId,
                isEmailVerified: isEmailVerified !== undefined ? Boolean(isEmailVerified) : user.isEmailVerified,
            },
            include: { role: true },
        });
        res.status(200).json({ status: 'success', data: updated });
    }
    catch (error) {
        console.error('Admin updateUserRole error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await db_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ status: 'fail', message: 'User not found' });
            return;
        }
        // Do not delete super admin
        const superAdminRole = await db_1.prisma.role.findUnique({ where: { name: 'Super Admin' } });
        if (user.roleId === superAdminRole?.id) {
            res.status(400).json({ status: 'fail', message: 'Cannot delete Super Admin account' });
            return;
        }
        await db_1.prisma.user.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Admin deleteUser error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.deleteUser = deleteUser;
// --- Aggregate Metrics & Dashboard Stats ---
const getDashboardStats = async (req, res) => {
    try {
        const founderRole = await db_1.prisma.role.findUnique({ where: { name: 'Founder' } });
        const msmeRole = await db_1.prisma.role.findUnique({ where: { name: 'MSME' } });
        const advisorRole = await db_1.prisma.role.findUnique({ where: { name: 'Advisor' } });
        // Aggregate counts
        const totalFounders = founderRole ? await db_1.prisma.user.count({ where: { roleId: founderRole.id } }) : 0;
        const totalMsmes = msmeRole ? await db_1.prisma.user.count({ where: { roleId: msmeRole.id } }) : 0;
        const totalAdvisors = advisorRole ? await db_1.prisma.user.count({ where: { roleId: advisorRole.id } }) : 0;
        const totalStartups = await db_1.prisma.startup.count();
        const activeMeetings = await db_1.prisma.meeting.count({ where: { status: 'booked' } });
        // Assessment scores analytics
        const completedAssessments = await db_1.prisma.businessAssessment.findMany({
            where: { status: 'completed' },
            select: { overallScore: true },
        });
        const averageReadinessScore = completedAssessments.length > 0
            ? completedAssessments.reduce((sum, item) => sum + item.overallScore, 0) / completedAssessments.length
            : 0;
        // Financial revenue metrics
        const totalStartupValuations = await db_1.prisma.startup.aggregate({
            _sum: { currentValuation: true },
        });
        // Real platform revenue (Sum of paid invoices in the ledger)
        const platformRevenueResult = await db_1.prisma.billingLedger.aggregate({
            _sum: { amount: true },
            where: { status: 'paid' },
        });
        res.status(200).json({
            status: 'success',
            data: {
                counts: {
                    founders: totalFounders,
                    msmes: totalMsmes,
                    advisors: totalAdvisors,
                    startups: totalStartups,
                    meetings: activeMeetings,
                },
                assessments: {
                    totalCompleted: completedAssessments.length,
                    averageScore: Math.round(averageReadinessScore * 100) / 100,
                },
                financials: {
                    totalStartupValuations: totalStartupValuations._sum.currentValuation || 0,
                    platformRevenue: platformRevenueResult._sum.amount || 0,
                },
            },
        });
    }
    catch (error) {
        console.error('Admin getDashboardStats error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
// --- Assessment Tracker ---
const getAssessmentsTracker = async (req, res) => {
    try {
        const list = await db_1.prisma.businessAssessment.findMany({
            include: {
                answers: true,
                readinessScores: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ status: 'success', data: list });
    }
    catch (error) {
        console.error('Admin getAssessmentsTracker error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getAssessmentsTracker = getAssessmentsTracker;
