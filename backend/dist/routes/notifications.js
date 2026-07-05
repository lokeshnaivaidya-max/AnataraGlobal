"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
const leadSchema = zod_1.z.object({
    body: zod_1.z.object({
        leadName: zod_1.z.string().min(1, 'Lead name is required'),
        leadEmail: zod_1.z.string().email('Invalid email address'),
        leadMessage: zod_1.z.string().min(1, 'Message is required'),
    }),
});
const partnerApprovalSchema = zod_1.z.object({
    body: zod_1.z.object({
        partnerEmail: zod_1.z.string().email('Invalid email address'),
        partnerName: zod_1.z.string().min(1, 'Partner name is required'),
    }),
});
const eventRegistrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userEmail: zod_1.z.string().email('Invalid email address'),
        eventDetails: zod_1.z.string().min(5, 'Event details must be descriptive'),
    }),
});
const fundraisingMilestoneSchema = zod_1.z.object({
    body: zod_1.z.object({
        founderEmail: zod_1.z.string().email('Invalid email address'),
        startupName: zod_1.z.string().min(1, 'Startup name is required'),
        milestoneDetails: zod_1.z.string().min(5, 'Milestone details must be descriptive'),
    }),
});
// Protect routes
router.use(auth_1.authenticate);
router.post('/lead', (0, validation_1.validateRequest)(leadSchema), async (req, res) => {
    try {
        const { leadName, leadEmail, leadMessage } = req.body;
        await (0, email_1.sendLeadReceivedEmail)(leadName, leadEmail, leadMessage);
        res.status(200).json({ status: 'success', message: 'Lead notification sent to sales team' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
router.post('/partner-approval', (0, validation_1.validateRequest)(partnerApprovalSchema), async (req, res) => {
    try {
        const { partnerEmail, partnerName } = req.body;
        await (0, email_1.sendPartnerApprovedEmail)(partnerEmail, partnerName);
        res.status(200).json({ status: 'success', message: 'Partner welcome email sent' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
router.post('/event', (0, validation_1.validateRequest)(eventRegistrationSchema), async (req, res) => {
    try {
        const { userEmail, eventDetails } = req.body;
        await (0, email_1.sendEventRegistrationEmail)(userEmail, eventDetails);
        res.status(200).json({ status: 'success', message: 'Event registration confirmation sent' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
router.post('/milestone', (0, validation_1.validateRequest)(fundraisingMilestoneSchema), async (req, res) => {
    try {
        const { founderEmail, startupName, milestoneDetails } = req.body;
        await (0, email_1.sendFundraisingMilestoneEmail)(founderEmail, startupName, milestoneDetails);
        res.status(200).json({ status: 'success', message: 'Milestone status update sent' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
