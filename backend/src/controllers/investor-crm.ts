import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';

// --- Investor Contacts ---

export const getContacts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const contacts = await prisma.investorProfileContact.findMany({
      include: {
        _count: { select: { communications: true, meetings: true, tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, company, firm, role, title, phone, linkedinUrl, status, type, tags, notes } = req.body;

    const contact = await prisma.investorProfileContact.create({
      data: {
        name,
        email,
        company,
        firm,
        role,
        title,
        phone,
        linkedinUrl,
        status,
        type,
        tags,
        notes,
      },
    });

    res.status(201).json({ status: 'success', data: contact });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const contact = await prisma.investorProfileContact.findUnique({
      where: { id },
      include: {
        communications: { orderBy: { date: 'desc' } },
        meetings: { orderBy: { date: 'desc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!contact) {
      res.status(404).json({ status: 'fail', message: 'Contact not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: contact });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, email, company, firm, role, title, phone, linkedinUrl, status, type, tags, notes } = req.body;

    const existing = await prisma.investorProfileContact.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Contact not found' });
      return;
    }

    const contact = await prisma.investorProfileContact.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(company !== undefined && { company }),
        ...(firm !== undefined && { firm }),
        ...(role !== undefined && { role }),
        ...(title !== undefined && { title }),
        ...(phone !== undefined && { phone }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(status !== undefined && { status }),
        ...(type !== undefined && { type }),
        ...(tags !== undefined && { tags }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.status(200).json({ status: 'success', data: contact });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.investorProfileContact.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Contact not found' });
      return;
    }

    await prisma.investorProfileContact.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Portfolio Companies ---

export const getPortfolioCompanies = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const investorId = req.params.investorId as string;

    const companies = await prisma.portfolioCompany.findMany({
      where: { investorId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: companies });
  } catch (error) {
    console.error('Get portfolio companies error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const addPortfolioCompany = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const investorId = req.params.investorId as string;
    const { companyName, investmentRound, investmentAmount, description } = req.body;

    const investor = await prisma.investorProfile.findUnique({ where: { id: investorId } });
    if (!investor) {
      res.status(404).json({ status: 'fail', message: 'Investor profile not found' });
      return;
    }

    const company = await prisma.portfolioCompany.create({
      data: {
        investorId,
        companyName,
        investmentRound,
        investmentAmount,
        description,
      },
    });

    res.status(201).json({ status: 'success', data: company });
  } catch (error) {
    console.error('Add portfolio company error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const removePortfolioCompany = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.portfolioCompany.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Portfolio company not found' });
      return;
    }

    await prisma.portfolioCompany.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Portfolio company removed successfully' });
  } catch (error) {
    console.error('Remove portfolio company error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Communications ---

export const getCommunications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const comms = await prisma.communicationLog.findMany({
      where: { contactId: id },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({ status: 'success', data: comms });
  } catch (error) {
    console.error('Get communications error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const logCommunication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { type, direction, subject, summary, content } = req.body;

    const contact = await prisma.investorProfileContact.findUnique({ where: { id } });
    if (!contact) {
      res.status(404).json({ status: 'fail', message: 'Contact not found' });
      return;
    }

    const comm = await prisma.communicationLog.create({
      data: {
        contactId: id,
        type,
        direction: direction || 'outbound',
        subject,
        summary,
        content,
      },
    });

    res.status(201).json({ status: 'success', data: comm });
  } catch (error) {
    console.error('Log communication error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Meetings ---

export const getMeetings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const meetings = await prisma.investorMeeting.findMany({
      where: { contactId: id },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({ status: 'success', data: meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const scheduleMeeting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, date, meetingLink, notes } = req.body;

    const contact = await prisma.investorProfileContact.findUnique({ where: { id } });
    if (!contact) {
      res.status(404).json({ status: 'fail', message: 'Contact not found' });
      return;
    }

    const meeting = await prisma.investorMeeting.create({
      data: {
        contactId: id,
        title,
        date: new Date(date),
        meetingLink,
        notes,
      },
    });

    res.status(201).json({ status: 'success', data: meeting });
  } catch (error) {
    console.error('Schedule meeting error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// --- Investor Tasks ---

export const getInvestorTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const tasks = await prisma.investorTask.findMany({
      where: { contactId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    console.error('Get investor tasks error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const createInvestorTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, dueDate, priority } = req.body;

    const contact = await prisma.investorProfileContact.findUnique({ where: { id } });
    if (!contact) {
      res.status(404).json({ status: 'fail', message: 'Contact not found' });
      return;
    }

    const task = await prisma.investorTask.create({
      data: {
        contactId: id,
        title,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || 'medium',
      },
    });

    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    console.error('Create investor task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateInvestorTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, priority, title } = req.body;

    const existing = await prisma.investorTask.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Task not found' });
      return;
    }

    const task = await prisma.investorTask.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(title !== undefined && { title }),
      },
    });

    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    console.error('Update investor task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const deleteInvestorTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.investorTask.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Task not found' });
      return;
    }

    await prisma.investorTask.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete investor task error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
