import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';

// --- User Management Endpoints ---

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (search) {
      query.OR = [
        { email: { contains: String(search), mode: 'insensitive' } },
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where: query,
        include: { role: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where: query }),
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
  } catch (error) {
    console.error('Admin getUsers error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateUserRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { roleId, isEmailVerified } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        roleId: roleId ?? user.roleId,
        isEmailVerified: isEmailVerified !== undefined ? Boolean(isEmailVerified) : user.isEmailVerified,
      },
      include: { role: true },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Admin updateUserRole error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    // Do not delete super admin
    const superAdminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
    if (user.roleId === superAdminRole?.id) {
      res.status(400).json({ status: 'fail', message: 'Cannot delete Super Admin account' });
      return;
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Aggregate Metrics & Dashboard Stats ---

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const founderRole = await prisma.role.findUnique({ where: { name: 'Founder' } });
    const msmeRole = await prisma.role.findUnique({ where: { name: 'MSME' } });
    const advisorRole = await prisma.role.findUnique({ where: { name: 'Advisor' } });

    // Aggregate counts
    const totalFounders = founderRole ? await prisma.user.count({ where: { roleId: founderRole.id } }) : 0;
    const totalMsmes = msmeRole ? await prisma.user.count({ where: { roleId: msmeRole.id } }) : 0;
    const totalAdvisors = advisorRole ? await prisma.user.count({ where: { roleId: advisorRole.id } }) : 0;
    const totalStartups = await prisma.startup.count();
    const activeMeetings = await prisma.meeting.count({ where: { status: 'booked' } });

    // Assessment scores analytics
    const completedAssessments = await prisma.businessAssessment.findMany({
      where: { status: 'completed' },
      select: { overallScore: true },
    });

    const averageReadinessScore =
      completedAssessments.length > 0
        ? completedAssessments.reduce((sum, item) => sum + item.overallScore, 0) / completedAssessments.length
        : 0;

    // Financial revenue metrics
    const totalStartupValuations = await prisma.startup.aggregate({
      _sum: { currentValuation: true },
    });

    // Real platform revenue (Sum of paid invoices in the ledger)
    const platformRevenueResult = await prisma.billingLedger.aggregate({
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
  } catch (error) {
    console.error('Admin getDashboardStats error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Assessment Tracker ---

export const getAssessmentsTracker = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const list = await prisma.businessAssessment.findMany({
      include: {
        answers: true,
        readinessScores: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: list });
  } catch (error) {
    console.error('Admin getAssessmentsTracker error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
