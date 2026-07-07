import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';
import { MulterRequest } from '../middlewares/upload';

export const getProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const projects = await prisma.fundraisingProject.findMany({
      where: { founder: { userId } },
      include: {
        _count: { select: { investors: true, documents: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: projects });
  } catch (error) {
    console.error('Get fundraising projects error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, description, targetAmount, stage } = req.body;

    const founder = await prisma.founder.findUnique({ where: { userId } });
    if (!founder) {
      res.status(400).json({ status: 'fail', message: 'Founder profile not found. Complete your founder profile first.' });
      return;
    }

    const project = await prisma.fundraisingProject.create({
      data: {
        founderId: founder.id,
        name,
        description,
        targetAmount,
        stage,
      },
    });

    res.status(201).json({ status: 'success', data: project });
  } catch (error) {
    console.error('Create fundraising project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const project = await prisma.fundraisingProject.findUnique({
      where: { id },
      include: {
        investors: { orderBy: { createdAt: 'desc' } },
        documents: { orderBy: { uploadedAt: 'desc' } },
        founder: { select: { userId: true } },
      },
    });

    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    if (project.founder.userId !== userId) {
      res.status(403).json({ status: 'fail', message: 'Not authorized to view this project' });
      return;
    }

    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    console.error('Get fundraising project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const { name, description, targetAmount, stage, status } = req.body;

    const project = await prisma.fundraisingProject.findUnique({
      where: { id },
      include: { founder: { select: { userId: true } } },
    });

    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    if (project.founder?.userId !== userId) {
      res.status(403).json({ status: 'fail', message: 'Not authorized to update this project' });
      return;
    }

    const updated = await prisma.fundraisingProject.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(targetAmount !== undefined && { targetAmount }),
        ...(stage !== undefined && { stage }),
        ...(status !== undefined && { status }),
      },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update fundraising project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const project = await prisma.fundraisingProject.findUnique({
      where: { id },
      include: { founder: { select: { userId: true } } },
    });

    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    if (project.founder?.userId !== userId) {
      res.status(403).json({ status: 'fail', message: 'Not authorized to delete this project' });
      return;
    }

    await prisma.fundraisingProject.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete fundraising project error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Investors ---

export const getProjectInvestors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const investors = await prisma.fundraisingInvestor.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: investors });
  } catch (error) {
    console.error('Get investors error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const addProjectInvestor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, email, commitment, shares, notes } = req.body;

    const project = await prisma.fundraisingProject.findUnique({ where: { id } });
    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    const investor = await prisma.fundraisingInvestor.create({
      data: {
        projectId: id,
        name,
        email,
        commitment,
        shares,
        notes,
      },
    });

    // Update raised amount
    await prisma.fundraisingProject.update({
      where: { id },
      data: { raisedAmount: { increment: commitment } },
    });

    res.status(201).json({ status: 'success', data: investor });
  } catch (error) {
    console.error('Add investor error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateInvestor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, commitment, shares, notes } = req.body;

    const investor = await prisma.fundraisingInvestor.findUnique({ where: { id } });
    if (!investor) {
      res.status(404).json({ status: 'fail', message: 'Investor not found' });
      return;
    }

    const updated = await prisma.fundraisingInvestor.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(commitment !== undefined && { commitment }),
        ...(shares !== undefined && { shares }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update investor error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const removeInvestor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const investor = await prisma.fundraisingInvestor.findUnique({ where: { id } });
    if (!investor) {
      res.status(404).json({ status: 'fail', message: 'Investor not found' });
      return;
    }

    await prisma.fundraisingInvestor.delete({ where: { id } });

    // Decrease raised amount
    await prisma.fundraisingProject.update({
      where: { id: investor.projectId },
      data: { raisedAmount: { decrement: investor.commitment } },
    });

    res.status(200).json({ status: 'success', message: 'Investor removed successfully' });
  } catch (error) {
    console.error('Remove investor error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Documents ---

export const getProjectDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const documents = await prisma.fundraisingDocument.findMany({
      where: { projectId: id },
      orderBy: { uploadedAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const addProjectDocument = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { category, description } = req.body;

    const project = await prisma.fundraisingProject.findUnique({ where: { id } });
    if (!project) {
      res.status(404).json({ status: 'fail', message: 'Project not found' });
      return;
    }

    // Uploaded file from multer (handled by uploadSingle middleware)
    const fileName = req.file ? req.file.originalname : req.body.fileName;
    const filePath = req.file ? req.file.path : req.body.filePath;

    if (!fileName || !filePath) {
      res.status(400).json({ status: 'fail', message: 'fileName and filePath (or file upload) are required' });
      return;
    }

    const document = await prisma.fundraisingDocument.create({
      data: {
        projectId: id,
        category: category || 'other',
        fileName,
        filePath,
        description,
      },
    });

    res.status(201).json({ status: 'success', data: document });
  } catch (error) {
    console.error('Add document error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const removeDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const document = await prisma.fundraisingDocument.findUnique({ where: { id } });
    if (!document) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }

    await prisma.fundraisingDocument.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Document removed successfully' });
  } catch (error) {
    console.error('Remove document error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Metrics ---

export const getFundraisingMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const founder = await prisma.founder.findUnique({ where: { userId } });
    if (!founder) {
      res.status(400).json({ status: 'fail', message: 'Founder profile not found' });
      return;
    }

    const projects = await prisma.fundraisingProject.findMany({
      where: { founderId: founder.id },
      include: {
        _count: { select: { investors: true } },
      },
    });

    const totalTarget = projects.reduce((sum, p) => sum + (p.targetAmount || 0), 0);
    const totalRaised = projects.reduce((sum, p) => sum + (p.raisedAmount || 0), 0);
    const totalClosed = projects.reduce((sum, p) => sum + (p.closedAmount || 0), 0);
    const activeProjects = projects.filter((p) => p.status === 'active').length;
    const totalInvestors = projects.reduce((sum, p) => sum + p._count.investors, 0);

    res.status(200).json({
      status: 'success',
      data: {
        totalProjects: projects.length,
        activeProjects,
        totalTargetAmount: totalTarget,
        totalRaisedAmount: totalRaised,
        totalClosedAmount: totalClosed,
        totalInvestors,
        progressPercentage: totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Get fundraising metrics error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
