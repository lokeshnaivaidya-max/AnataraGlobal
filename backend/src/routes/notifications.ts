import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  sendLeadReceivedEmail,
  sendPartnerApprovedEmail,
  sendEventRegistrationEmail,
  sendFundraisingMilestoneEmail,
} from '../services/email';

const router = Router();

const leadSchema = z.object({
  body: z.object({
    leadName: z.string().min(1, 'Lead name is required'),
    leadEmail: z.string().email('Invalid email address'),
    leadMessage: z.string().min(1, 'Message is required'),
  }),
});

const partnerApprovalSchema = z.object({
  body: z.object({
    partnerEmail: z.string().email('Invalid email address'),
    partnerName: z.string().min(1, 'Partner name is required'),
  }),
});

const eventRegistrationSchema = z.object({
  body: z.object({
    userEmail: z.string().email('Invalid email address'),
    eventDetails: z.string().min(5, 'Event details must be descriptive'),
  }),
});

const fundraisingMilestoneSchema = z.object({
  body: z.object({
    founderEmail: z.string().email('Invalid email address'),
    startupName: z.string().min(1, 'Startup name is required'),
    milestoneDetails: z.string().min(5, 'Milestone details must be descriptive'),
  }),
});

// Protect routes
router.use(authenticate);

router.post('/lead', validateRequest(leadSchema), async (req, res) => {
  try {
    const { leadName, leadEmail, leadMessage } = req.body;
    await sendLeadReceivedEmail(leadName, leadEmail, leadMessage);
    res.status(200).json({ status: 'success', message: 'Lead notification sent to sales team' });
  } catch (error: any) {
    console.error('Send lead notification error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/partner-approval', validateRequest(partnerApprovalSchema), async (req, res) => {
  try {
    const { partnerEmail, partnerName } = req.body;
    await sendPartnerApprovedEmail(partnerEmail, partnerName);
    res.status(200).json({ status: 'success', message: 'Partner welcome email sent' });
  } catch (error: any) {
    console.error('Send partner approval email error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/event', validateRequest(eventRegistrationSchema), async (req, res) => {
  try {
    const { userEmail, eventDetails } = req.body;
    await sendEventRegistrationEmail(userEmail, eventDetails);
    res.status(200).json({ status: 'success', message: 'Event registration confirmation sent' });
  } catch (error: any) {
    console.error('Send event registration email error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/milestone', validateRequest(fundraisingMilestoneSchema), async (req, res) => {
  try {
    const { founderEmail, startupName, milestoneDetails } = req.body;
    await sendFundraisingMilestoneEmail(founderEmail, startupName, milestoneDetails);
    res.status(200).json({ status: 'success', message: 'Milestone status update sent' });
  } catch (error: any) {
    console.error('Send milestone email error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
