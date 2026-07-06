import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';

export const createLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, sourceId, notes } = req.body;

    const lead = await prisma.crmLead.create({
      data: {
        name,
        email,
        phone,
        company,
        sourceId: sourceId || undefined,
        notes,
      },
      include: {
        source: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: lead,
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getLeads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, sourceId, search, assignedTo, page: pageStr, limit: limitStr } = req.query;

    const page = Math.max(1, parseInt(pageStr as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr as string, 10) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (sourceId) where.sourceId = sourceId;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.crmLead.findMany({
        where,
        include: {
          source: true,
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.crmLead.count({ where }),
    ]);

    res.status(200).json({
      status: 'success',
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const lead = await prisma.crmLead.findUnique({
      where: { id },
      include: {
        source: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      res.status(404).json({ status: 'fail', message: 'Lead not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, email, phone, company, sourceId, status, value, notes, assignedTo, tags } = req.body;

    const existing = await prisma.crmLead.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Lead not found' });
      return;
    }

    const lead = await prisma.crmLead.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(sourceId !== undefined && { sourceId }),
        ...(status !== undefined && { status }),
        ...(value !== undefined && { value }),
        ...(notes !== undefined && { notes }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(tags !== undefined && { tags }),
      },
      include: { source: true },
    });

    res.status(200).json({ status: 'success', data: lead });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.crmLead.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Lead not found' });
      return;
    }

    await prisma.crmLead.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getLeadActivities = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const lead = await prisma.crmLead.findUnique({ where: { id } });
    if (!lead) {
      res.status(404).json({ status: 'fail', message: 'Lead not found' });
      return;
    }

    const activities = await prisma.crmActivity.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createLeadActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { type, description } = req.body;

    const lead = await prisma.crmLead.findUnique({ where: { id } });
    if (!lead) {
      res.status(404).json({ status: 'fail', message: 'Lead not found' });
      return;
    }

    const activity = await prisma.crmActivity.create({
      data: {
        leadId: id,
        type,
        description,
      },
    });

    res.status(201).json({ status: 'success', data: activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getSources = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const sources = await prisma.leadSource.findMany({
      include: {
        _count: { select: { leads: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ status: 'success', data: sources });
  } catch (error) {
    console.error('Get sources error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createSource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    const existing = await prisma.leadSource.findUnique({ where: { name } });
    if (existing) {
      res.status(400).json({ status: 'fail', message: 'Source with this name already exists' });
      return;
    }

    const source = await prisma.leadSource.create({
      data: { name, description },
    });

    res.status(201).json({ status: 'success', data: source });
  } catch (error) {
    console.error('Create source error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteSource = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.leadSource.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Source not found' });
      return;
    }

    await prisma.leadSource.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Source deleted successfully' });
  } catch (error) {
    console.error('Delete source error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getPipeline = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const leads = await prisma.crmLead.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { value: true },
    });

    const pipeline = leads.reduce(
      (acc, curr) => {
        acc[curr.status] = {
          count: curr._count.id,
          value: curr._sum.value || 0,
        };
        return acc;
      },
      {} as Record<string, { count: number; value: number }>
    );

    // Ensure all statuses are represented
    const allStatuses = ['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost'];
    for (const status of allStatuses) {
      if (!pipeline[status]) {
        pipeline[status] = { count: 0, value: 0 };
      }
    }

    res.status(200).json({ status: 'success', data: pipeline });
  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getCrmStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [totalLeads, leadsByStatus, leadsBySource] = await Promise.all([
      prisma.crmLead.count(),
      prisma.crmLead.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.crmLead.groupBy({
        by: ['sourceId'],
        _count: { id: true },
      }),
    ]);

    const totalValue = await prisma.crmLead.aggregate({
      _sum: { value: true },
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalLeads,
        totalValue: totalValue._sum.value || 0,
        byStatus: leadsByStatus.reduce(
          (acc, curr) => {
            acc[curr.status] = curr._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
        bySource: leadsBySource,
      },
    });
  } catch (error) {
    console.error('Get CRM stats error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
