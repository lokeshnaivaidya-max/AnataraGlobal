import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';

// --- Projects ---

export const getProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        _count: { select: { milestones: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, description } = req.body;

    const project = await prisma.project.create({
      data: { ownerId: userId, name, description },
    });

    res.status(201).json({ status: 'success', data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        milestones: {
          include: {
            tasks: {
              include: { assignee: { select: { id: true, firstName: true, lastName: true, email: true } } },
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    if (project.ownerId !== userId) {
      res.status(403).json({ status: 'fail', message: 'Not authorized to view this project' });
      return;
    }

    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const { name, description, status } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    if (project.ownerId !== userId) {
      res.status(403).json({ status: 'fail', message: 'Not authorized to update this project' });
      return;
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    if (project.ownerId !== userId) {
      res.status(403).json({ status: 'fail', message: 'Not authorized to delete this project' });
      return;
    }

    await prisma.project.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Milestones ---

export const getMilestones = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const milestones = await prisma.projectMilestone.findMany({
      where: { projectId: id },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({ status: 'success', data: milestones });
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createMilestone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, targetDate } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    const milestone = await prisma.projectMilestone.create({
      data: {
        projectId: id,
        name,
        description,
        targetDate: targetDate ? new Date(targetDate) : undefined,
      },
    });

    res.status(201).json({ status: 'success', data: milestone });
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateMilestone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, targetDate, status } = req.body;

    const existing = await prisma.projectMilestone.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Milestone not found' });
      return;
    }

    const milestone = await prisma.projectMilestone.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(targetDate !== undefined && { targetDate: new Date(targetDate) }),
        ...(status !== undefined && { status }),
      },
    });

    res.status(200).json({ status: 'success', data: milestone });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteMilestone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.projectMilestone.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Milestone not found' });
      return;
    }

    await prisma.projectMilestone.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Delete milestone error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Tasks ---

export const getMilestoneTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const tasks = await prisma.projectTask.findMany({
      where: { milestoneId: id },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    console.error('Get milestone tasks error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, assigneeId, dueDate, priority } = req.body;

    const milestone = await prisma.projectMilestone.findUnique({ where: { id } });
    if (!milestone) {
      res.status(404).json({ status: 'fail', message: 'Milestone not found' });
      return;
    }

    const task = await prisma.projectTask.create({
      data: {
        milestoneId: id,
        title,
        description,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || 'medium',
      },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, assigneeId, dueDate, status, priority } = req.body;

    const existing = await prisma.projectTask.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Task not found' });
      return;
    }

    const task = await prisma.projectTask.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
      },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.projectTask.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Task not found' });
      return;
    }

    await prisma.projectTask.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- My Tasks ---

export const getMyTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const tasks = await prisma.projectTask.findMany({
      where: { assigneeId: userId },
      include: {
        milestone: {
          include: { project: { select: { id: true, name: true } } },
        },
      },
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
    });

    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Overview ---

export const getTaskOverview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const projectIds = projects.map((p) => p.id);

    const milestones = await prisma.projectMilestone.findMany({
      where: { projectId: { in: projectIds } },
      select: { id: true },
    });

    const milestoneIds = milestones.map((m) => m.id);

    const tasks = await prisma.projectTask.groupBy({
      by: ['status'],
      where: { milestoneId: { in: milestoneIds } },
      _count: { id: true },
    });

    const tasksByPriority = await prisma.projectTask.groupBy({
      by: ['priority'],
      where: { milestoneId: { in: milestoneIds } },
      _count: { id: true },
    });

    const totalTasks = tasks.reduce((sum, t) => sum + t._count.id, 0);
    const completedTasks = tasks.find((t) => t.status === 'completed')?._count.id || 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalProjects: projects.length,
        totalMilestones: milestones.length,
        totalTasks,
        completedTasks,
        progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        byStatus: tasks.reduce((acc, curr) => {
          acc[curr.status] = curr._count.id;
          return acc;
        }, {} as Record<string, number>),
        byPriority: tasksByPriority.reduce((acc, curr) => {
          acc[curr.priority] = curr._count.id;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error('Get task overview error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
