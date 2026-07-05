"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendConsultationBookedEmail = sendConsultationBookedEmail;
exports.sendLeadReceivedEmail = sendLeadReceivedEmail;
exports.sendPartnerApprovedEmail = sendPartnerApprovedEmail;
exports.sendEventRegistrationEmail = sendEventRegistrationEmail;
exports.sendFundraisingMilestoneEmail = sendFundraisingMilestoneEmail;
exports.sendAssessmentCompletedEmail = sendAssessmentCompletedEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../config/db");
dotenv_1.default.config();
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
// Check if credentials are placeholders or set
const isPlaceholder = !SMTP_HOST ||
    !SMTP_PORT ||
    SMTP_HOST.includes('placeholder') ||
    SMTP_USER?.includes('placeholder');
let transporter = null;
if (!isPlaceholder) {
    try {
        transporter = nodemailer_1.default.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    }
    catch (error) {
        console.error('Failed to create real SMTP transporter, falling back to mock logger:', error);
    }
}
async function sendEmail({ to, subject, text, html }) {
    console.log(`[Email Service] Attempting to send email to: ${to}`);
    console.log(`[Email Service] Subject: ${subject}`);
    console.log(`[Email Service] Content Preview: ${text.slice(0, 100)}...`);
    let status = 'failed';
    if (transporter) {
        try {
            const info = await transporter.sendMail({
                from: SMTP_FROM || 'noreply@antara.com',
                to,
                subject,
                text,
                html: html || text.replace(/\n/g, '<br>'),
            });
            console.log(`[Email Service] Real email sent. Message ID: ${info.messageId}`);
            status = 'sent';
        }
        catch (error) {
            console.error('[Email Service] Error sending real email, logging instead:', error);
            status = 'failed';
        }
    }
    else {
        console.log('[Email Service] Running in MOCK Mode. Email not sent over the network (credentials are placeholders).');
        status = 'mocked';
    }
    // Persist notification log in the database if recipient is a registered user
    try {
        const user = await db_1.prisma.user.findUnique({ where: { email: to } });
        if (user) {
            await db_1.prisma.notification.create({
                data: {
                    recipientId: user.id,
                    type: 'email',
                    subject,
                    content: text,
                    status,
                    sentAt: status === 'sent' ? new Date() : null,
                },
            });
            console.log(`[Email Service] Saved notification log in database for User ID: ${user.id}`);
        }
        else {
            console.log(`[Email Service] Recipient ${to} is not a registered user. Skipping database notification logging.`);
        }
    }
    catch (dbError) {
        console.error('[Email Service] Failed to save notification to database:', dbError);
    }
    return status === 'sent' || status === 'mocked';
}
// Concrete notification helpers as requested by Module 8
async function sendConsultationBookedEmail(founderEmail, meetingDetails) {
    // 1. Send to founder
    await sendEmail({
        to: founderEmail,
        subject: 'Consultation Meeting Booked - Antara',
        text: `Your advisory meeting has been scheduled!\n\nDetails:\n${meetingDetails}\n\nThank you,\nThe Antara Team`,
    });
    // 2. Send alert to admin
    await sendEmail({
        to: 'admin@antara.com',
        subject: 'ALERT: New Consultation Booked',
        text: `A new advisory consultation has been booked by founder ${founderEmail}.\n\nDetails:\n${meetingDetails}`,
    });
}
async function sendLeadReceivedEmail(leadName, leadEmail, leadMessage) {
    await sendEmail({
        to: 'sales@antara.com',
        subject: 'New Lead Notification - Sales Team',
        text: `You have received a new lead on the platform:\n\nName: ${leadName}\nEmail: ${leadEmail}\nMessage:\n${leadMessage}`,
    });
}
async function sendPartnerApprovedEmail(partnerEmail, partnerName) {
    await sendEmail({
        to: partnerEmail,
        subject: 'Welcome to Antara - Partner Account Approved!',
        text: `Dear ${partnerName},\n\nWe are pleased to inform you that your partner application has been approved. You now have full access to your partner dashboard.\n\nBest regards,\nAntara Team`,
    });
}
async function sendEventRegistrationEmail(userEmail, eventDetails) {
    await sendEmail({
        to: userEmail,
        subject: 'Registration Confirmed: Upcoming Event',
        text: `Thank you for registering for the following event!\n\nDetails:\n${eventDetails}\n\nWe look forward to seeing you there.`,
    });
}
async function sendFundraisingMilestoneEmail(founderEmail, startupName, milestoneDetails) {
    await sendEmail({
        to: founderEmail,
        subject: `Startup Milestone Updated: ${startupName}`,
        text: `Congratulations on your fundraising milestone progress!\n\nMilestone Updates:\n${milestoneDetails}`,
    });
}
async function sendAssessmentCompletedEmail(userEmail, scorePercentage) {
    await sendEmail({
        to: userEmail,
        subject: 'Assessment Report Ready - Antara',
        text: `Your Venture Readiness Assessment is completed!\n\nOverall Score: ${scorePercentage}%\n\nYou can download the complete report from your dashboard.`,
    });
}
