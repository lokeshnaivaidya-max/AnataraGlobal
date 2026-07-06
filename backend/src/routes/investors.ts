import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate, restrictTo } from '../middlewares/auth';
import { prisma } from '../config/db';
import {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  getPortfolioCompanies,
  addPortfolioCompany,
  removePortfolioCompany,
  getCommunications,
  logCommunication,
  getMeetings,
  scheduleMeeting,
  getInvestorTasks,
  createInvestorTask,
  updateInvestorTask,
  deleteInvestorTask,
} from '../controllers/investor-crm';

const router = Router();

// Existing schemas
const createInvestorSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    contactName: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email address'),
    investmentStage: z.array(z.string()).min(1, 'At least one investment stage is required'),
    minTicket: z.number().nonnegative(),
    maxTicket: z.number().nonnegative(),
  }),
});

// New schemas for CRM
const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Contact name is required'),
    email: z.string().email().optional().or(z.literal('')),
    company: z.string().optional(),
    firm: z.string().optional(),
    role: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    status: z.string().optional(),
    type: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

const updateContactSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal('')),
    company: z.string().optional(),
    firm: z.string().optional(),
    role: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    status: z.string().optional(),
    type: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

const addPortfolioSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    investmentRound: z.string().optional(),
    investmentAmount: z.number().nonnegative().optional(),
    description: z.string().optional(),
  }),
});

const logCommunicationSchema = z.object({
  body: z.object({
    type: z.string().min(1, 'Communication type is required'),
    direction: z.enum(['inbound', 'outbound']).optional(),
    subject: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().optional(),
  }),
});

const scheduleMeetingSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    date: z.string().datetime('Valid date is required'),
    meetingLink: z.string().url().optional().or(z.literal('')),
    notes: z.string().optional(),
  }),
});

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required'),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    status: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

router.use(authenticate);

// --- Existing Investor Profile Routes ---
router.get('/', async (req, res) => {
  try {
    const list = await prisma.investorProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: list });
  } catch (error) {
    console.error('Get investors error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/', restrictTo('Admin', 'Super Admin'), validateRequest(createInvestorSchema), async (req, res) => {
  try {
    const { companyName, contactName, email, investmentStage, minTicket, maxTicket } = req.body;

    const existing = await prisma.investorProfile.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ status: 'fail', message: 'Investor email already exists' });
      return;
    }

    const investor = await prisma.investorProfile.create({
      data: {
        companyName,
        contactName,
        email,
        investmentStage,
        minTicket,
        maxTicket,
      },
    });

    res.status(201).json({ status: 'success', data: investor });
  } catch (error) {
    console.error('Create investor error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.put('/:id', restrictTo('Admin', 'Super Admin'), async (req, res) => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    const investor = await prisma.investorProfile.findUnique({ where: { id } });
    if (!investor) {
      res.status(404).json({ status: 'fail', message: 'Investor profile not found' });
      return;
    }

    const updated = await prisma.investorProfile.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Update investor error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.delete('/:id', restrictTo('Admin', 'Super Admin'), async (req, res) => {
  try {
    const id = req.params.id as string;

    const investor = await prisma.investorProfile.findUnique({ where: { id } });
    if (!investor) {
      res.status(404).json({ status: 'fail', message: 'Investor profile not found' });
      return;
    }

    await prisma.investorProfile.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Investor profile deleted successfully' });
  } catch (error) {
    console.error('Delete investor error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// --- New Investor CRM Routes ---

// Contacts
router.get('/contacts', getContacts);
router.post('/contacts', validateRequest(createContactSchema), createContact);
router.get('/contacts/:id', getContact);
router.put('/contacts/:id', validateRequest(updateContactSchema), updateContact);
router.delete('/contacts/:id', deleteContact);

// Portfolio
router.get('/:investorId/portfolio', getPortfolioCompanies);
router.post('/:investorId/portfolio', validateRequest(addPortfolioSchema), addPortfolioCompany);
router.delete('/portfolio/:id', removePortfolioCompany);

// Communications
router.get('/contacts/:id/communications', getCommunications);
router.post('/contacts/:id/communications', validateRequest(logCommunicationSchema), logCommunication);

// Meetings
router.get('/contacts/:id/meetings', getMeetings);
router.post('/contacts/:id/meetings', validateRequest(scheduleMeetingSchema), scheduleMeeting);

// Tasks
router.get('/contacts/:id/tasks', getInvestorTasks);
router.post('/contacts/:id/tasks', validateRequest(createTaskSchema), createInvestorTask);
router.put('/tasks/:id', validateRequest(updateTaskSchema), updateInvestorTask);
router.delete('/tasks/:id', deleteInvestorTask);

export default router;
