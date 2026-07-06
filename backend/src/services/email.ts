import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { prisma } from '../config/db';

dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

// Check if credentials are placeholders or set
const isPlaceholder = 
  !SMTP_HOST || 
  !SMTP_PORT || 
  SMTP_HOST.includes('placeholder') || 
  SMTP_USER?.includes('placeholder');

let transporter: nodemailer.Transporter | null = null;

if (!isPlaceholder) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } catch (error) {
    console.error('Failed to create real SMTP transporter, falling back to mock logger:', error);
  }
}

interface SendMailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  fromName?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, text, html, fromName, replyTo }: SendMailParams): Promise<boolean> {
  console.log(`[Email Service] Attempting to send email to: ${to}`);
  console.log(`[Email Service] Subject: ${subject}`);
  console.log(`[Email Service] Content Preview: ${text.slice(0, 100)}...`);

  let status = 'failed';

  if (transporter) {
    try {
      let fromHeader = SMTP_FROM || 'noreply@antara.com';
      if (replyTo) {
        fromHeader = fromName ? `"${fromName}" <${replyTo}>` : replyTo;
      } else if (fromName && SMTP_FROM) {
        const emailMatch = SMTP_FROM.match(/<([^>]+)>/);
        const emailAddr = emailMatch ? emailMatch[1] : SMTP_FROM;
        fromHeader = `"${fromName} (via Antara)" <${emailAddr}>`;
      } else if (fromName) {
        fromHeader = `"${fromName}" <noreply@antara.com>`;
      }

      const info = await transporter.sendMail({
        from: fromHeader,
        to,
        subject,
        text,
        html: html || text.replace(/\n/g, '<br>'),
        ...(replyTo && { replyTo }),
      });
      console.log(`[Email Service] Real email sent. Message ID: ${info.messageId}`);
      status = 'sent';
    } catch (error) {
      console.error('[Email Service] Error sending real email, logging instead:', error);
      status = 'failed';
    }
  } else {
    console.log('[Email Service] Running in MOCK Mode. Email not sent over the network (credentials are placeholders).');
    status = 'mocked';
  }

  // Persist notification log in the database if recipient is a registered user
  try {
    const user = await prisma.user.findUnique({ where: { email: to } });
    if (user) {
      await prisma.notification.create({
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
    } else {
      console.log(`[Email Service] Recipient ${to} is not a registered user. Skipping database notification logging.`);
    }
  } catch (dbError) {
    console.error('[Email Service] Failed to save notification to database:', dbError);
  }

  return status === 'sent' || status === 'mocked';
}


// Concrete notification helpers as requested by Module 8
export async function sendConsultationBookedEmail(founderEmail: string, meetingDetails: string) {
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

export async function sendLeadReceivedEmail(leadName: string, leadEmail: string, leadMessage: string) {
  await sendEmail({
    to: 'sales@antara.com',
    subject: 'New Lead Notification - Sales Team',
    text: `You have received a new lead on the platform:\n\nName: ${leadName}\nEmail: ${leadEmail}\nMessage:\n${leadMessage}`,
  });
}

export async function sendPartnerApprovedEmail(partnerEmail: string, partnerName: string) {
  await sendEmail({
    to: partnerEmail,
    subject: 'Welcome to Antara - Partner Account Approved!',
    text: `Dear ${partnerName},\n\nWe are pleased to inform you that your partner application has been approved. You now have full access to your partner dashboard.\n\nBest regards,\nAntara Team`,
  });
}

export async function sendEventRegistrationEmail(userEmail: string, eventDetails: string) {
  await sendEmail({
    to: userEmail,
    subject: 'Registration Confirmed: Upcoming Event',
    text: `Thank you for registering for the following event!\n\nDetails:\n${eventDetails}\n\nWe look forward to seeing you there.`,
  });
}

export async function sendFundraisingMilestoneEmail(founderEmail: string, startupName: string, milestoneDetails: string) {
  await sendEmail({
    to: founderEmail,
    subject: `Startup Milestone Updated: ${startupName}`,
    text: `Congratulations on your fundraising milestone progress!\n\nMilestone Updates:\n${milestoneDetails}`,
  });
}

export async function sendAssessmentCompletedEmail(userEmail: string, scorePercentage: number) {
  await sendEmail({
    to: userEmail,
    subject: 'Assessment Report Ready - Antara',
    text: `Your Venture Readiness Assessment is completed!\n\nOverall Score: ${scorePercentage}%\n\nYou can download the complete report from your dashboard.`,
  });
}
