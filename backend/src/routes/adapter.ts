import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { generateSecret, generateURI, verifySync } from 'otplib';
import { sendEmail, sendConsultationBookedEmail, sendLeadReceivedEmail } from '../services/email';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import googleAuthRouter from './googleAuth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'antara-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Require email verification middleware for protected routes
const requireVerified = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'User not found' });
      return;
    }
    if (!user.isEmailVerified) {
      // Fetch role to allow Admin / Super Admin bypass
      const role = await prisma.role.findUnique({ where: { id: user.roleId } });
      if (role?.name !== 'Super Admin' && role?.name !== 'Admin') {
        res.status(403).json({ status: 'fail', message: 'Email verification required.' });
        return;
      }
    }
    next();
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --- IN-MEMORY STATES (For non-DB mock modules) ---
let leads = [
  { id: 'lead-1', name: 'Acme Growth Corp', email: 'sales@acmegrowth.co', status: 'new', value: 15000, company: 'Acme Growth', phone: '+91 99999 88888', notes: 'Interested in growth platform' },
  { id: 'lead-2', name: 'Zeta Solutions', email: 'founder@zetasol.com', status: 'contacted', value: 25000, company: 'Zeta Tech', phone: '+91 77777 66666', notes: 'Needs valuation template' }
];
let leadActivities: any[] = [
  { id: 'act-1', leadId: 'lead-1', type: 'email', description: 'Sent introduction email', createdAt: new Date().toISOString() }
];

let investorContacts = [
  { id: 'ic-1', name: 'Sarah Jenkins', email: 'sarah@sequoia.com', company: 'Sequoia Capital', firm: 'Sequoia Capital', role: 'Partner', title: 'Partner', phone: '+91 90000 12345', linkedinUrl: 'https://linkedin.com/in/sarah', status: 'warm', type: 'vc', tags: ['SaaS', 'Fintech'], notes: 'Met at pitch event', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ic-2', name: 'Rajesh Nair', email: 'rajesh@accel.com', company: 'Accel Partners', firm: 'Accel Partners', role: 'VP Investments', title: 'VP Investments', phone: '+91 80000 54321', linkedinUrl: 'https://linkedin.com/in/rajesh', status: 'contacted', type: 'vc', tags: ['Deep Tech'], notes: 'Emailed summary sheet', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];
let investorComms: any[] = [
  { id: 'comm-1', contactId: 'ic-1', type: 'email', direction: 'outbound', subject: 'Follow up from pitching', summary: 'Sent the updated deck', content: 'Sent the updated deck', date: new Date().toISOString(), createdAt: new Date().toISOString() }
];
let investorMeetings: any[] = [
  { id: 'im-1', contactId: 'ic-1', title: 'Pitch Deck Review', date: new Date(Date.now() + 86400000).toISOString(), scheduledAt: new Date(Date.now() + 86400000).toISOString(), meetingLink: 'https://zoom.us/j/12345', notes: 'Bring financial model', actionItems: [] }
];
let investorTasks: any[] = [
  { id: 'it-1', contactId: 'ic-1', title: 'Send updated cap table', dueDate: new Date(Date.now() + 172800000).toISOString(), status: 'pending', priority: 'medium' }
];

let capitalProviders = [
  { 
    id: 'cp-1', 
    name: 'Trident Ventures', 
    type: 'vc_fund', 
    description: 'Early-stage SaaS investment fund offering seed funding and strategic mentorship.', 
    website: 'https://tridentventures.com', 
    minAmount: 100000, 
    maxAmount: 500000, 
    currency: 'USD', 
    interestRate: 8, 
    tenure: '3-5 years', 
    products: ['Equity', 'Convertible Note'], 
    eligibility: ['Early Stage SaaS', 'Working Prototype'], 
    tags: ['SaaS', 'Early Stage'], 
    status: 'active', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 'cp-2', 
    name: 'Apex Capital Group', 
    type: 'angel_network', 
    description: 'A global network of active angel investors investing in high-growth startups.', 
    website: 'https://apexcapital.com', 
    minAmount: 50000, 
    maxAmount: 250000, 
    currency: 'USD', 
    interestRate: 10, 
    tenure: '2-4 years', 
    products: ['Equity', 'Safe Note'], 
    eligibility: ['Market Traction', 'Strong Team'], 
    tags: ['Corporate', 'Growth Stage'], 
    status: 'active', 
    createdAt: new Date().toISOString() 
  }
];
let capitalRequests: any[] = [];

let fundraisingRounds: any[] = [
  { id: 'round-1', targetAmount: 500000, status: 'active', type: 'seed', valuation: 3000000, raisedAmount: 150000, closedAmount: 150000, closedAt: null, createdAt: new Date().toISOString() }
];
let fundraisingInvestors: any[] = [
  { id: 'inv-1', roundId: 'round-1', name: 'Sequoia Capital', commitment: 100000, status: 'closed', shares: 20000, notes: 'Signed Term Sheet' },
  { id: 'inv-2', roundId: 'round-1', name: 'Individual Angel', commitment: 50000, status: 'pending', shares: 10000, notes: 'Follow up call on Monday' }
];
let fundraisingMetrics = {
  burnRate: 20000,
  runway: 15,
  ltv: 8500,
  cac: 1200,
  mrr: 32000
};

let bookmarks = new Set<string>();
let knowledgeResources = [
  { id: 'kr-1', title: 'How to write a Pitch Deck that wins seed funding', description: 'A comprehensive guide on building a slides structure that VCs look for.', type: 'guide', category: 'fundraising', url: 'https://example.com/pitch-deck-guide', author: 'Antara Advisory Team', duration: '15 mins', tags: ['Pitch Deck', 'Seed Funding'], viewCount: 142, createdAt: new Date().toISOString() },
  { id: 'kr-2', title: 'Early-stage Startup Valuation Template', description: 'An Excel/Google Sheets template to model valuation based on comparable company analysis.', type: 'template', category: 'finance', url: 'https://example.com/valuation-template', author: 'Finance Team', duration: '5 mins', tags: ['Valuation', 'Template'], viewCount: 98, createdAt: new Date().toISOString() }
];

let paymentMethods = [
  { id: 'pm-1', type: 'card', name: 'Visa ending in 4242', isDefault: true, expiry: '12/28' }
];

// Mock Partners list
let partners = [
  { id: 'p-1', name: 'TechHub Accelerator', type: 'accelerator', description: 'Pre-seed and seed acceleration platform.', website: 'https://techhub.org', benefits: ['Free server credits', 'Weekly mentorship'], tags: ['Tech', 'Early Stage'], status: 'active', createdAt: new Date().toISOString() },
  { id: 'p-2', name: 'State Innovation Lab', type: 'incubator', description: 'Government backed incubator program.', website: 'https://innovation.gov.in', benefits: ['Grants up to 50k', 'Tax exemptions'], tags: ['Incubation', 'Govt Program'], status: 'active', createdAt: new Date().toISOString() }
];
let partnershipRequests: any[] = [];

// ==========================================
// MODULE 1: AUTHENTICATION & USER MANAGEMENT
// ==========================================

// Helper to generate OTP
const generateOTPCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ status: 'fail', message: 'Email already registered' });
      return;
    }

    const defaultRole = await prisma.role.findFirst({
      where: { name: { in: ['Founder', 'MSME'] } },
    });
    if (!defaultRole) {
      res.status(500).json({ status: 'error', message: 'System role missing' });
      return;
    }

    // Split name
    const parts = (name || 'Social User').trim().split(/\s+/);
    const firstName = parts[0] || 'User';
    const lastName = parts.slice(1).join(' ') || '';

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        roleId: defaultRole.id,
      },
      include: { role: true },
    });

    // Generate Verification OTP
    const otpCode = generateOTPCode();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpLog.create({
      data: {
        userId: user.id,
        code: otpCode,
        purpose: 'email_verification',
        expiresAt: otpExpires,
      },
    });

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify your Antara account',
      text: `Hello ${firstName},\n\nWelcome to Antara! Your verification code is: ${otpCode}.\nIt will expire in 10 minutes.`,
    });

    // Auto generate active token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Save session in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        deviceInfo: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || '0.0.0.0',
        expiresAt,
      },
    });

    res.status(201).json({
      status: 'success',
      token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role.name,
        isVerified: user.isEmailVerified,
        isMfaEnabled: user.isMfaEnabled,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Register adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      res.status(401).json({ status: 'fail', message: 'User not found. Please register or signup' });
      return;
    }

    if (!user.passwordHash) {
      res.status(401).json({ status: 'fail', message: 'This account does not have a password set. Please log in using Google or reset your password.' });
      return;
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ status: 'fail', message: 'Incorrect password. Please try again.' });
      return;
    }

    // If MFA is enabled, return MFA required status and short-lived mfaToken
    if (user.isMfaEnabled) {
      const otpCode = generateOTPCode();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.otpLog.create({
        data: {
          userId: user.id,
          code: otpCode,
          purpose: 'login_mfa',
          expiresAt: otpExpires,
        },
      });

      await sendEmail({
        to: email,
        subject: 'Antara MFA Login Code',
        text: `Your login verification code is: ${otpCode}.\nIt will expire in 10 minutes.`,
      });

      const mfaToken = jwt.sign(
        { id: user.id, email: user.email, purpose: 'mfa_verification' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );

      res.status(200).json({
        status: 'success',
        mfaRequired: true,
        email: user.email,
        mfaToken,
      });
      return;
    }

    // Generate final JWT only when MFA is not enabled
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Create session in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        deviceInfo: req.headers['user-agent'] || 'Unknown Device',
        ipAddress: req.ip || '0.0.0.0',
        expiresAt,
      },
    });

    res.status(200).json({
      status: 'success',
      token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role.name,
        isVerified: user.isEmailVerified,
        isMfaEnabled: user.isMfaEnabled,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Login adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Authenticate / Login with MFA (POST /auth/mfa/authenticate)
router.post('/auth/mfa/authenticate', async (req: Request, res: Response) => {
  try {
    const { email, password, mfaToken, code } = req.body;
    if (!email || (!password && !mfaToken) || !code) {
      res.status(400).json({ status: 'fail', message: 'Email, verification code, and either password or MFA token are required' });
      return;
    }

    let user;

    if (mfaToken) {
      try {
        const decoded = jwt.verify(mfaToken, JWT_SECRET) as any;
        if (!decoded || decoded.purpose !== 'mfa_verification' || decoded.email !== email) {
          res.status(401).json({ status: 'fail', message: 'Invalid or expired MFA token' });
          return;
        }
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
          include: { role: true },
        });
      } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Invalid or expired MFA token' });
        return;
      }
    } else {
      user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });
      if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
        res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        return;
      }
    }

    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    if (!user.isMfaEnabled || !user.mfaSecret) {
      res.status(400).json({ status: 'fail', message: 'MFA is not enabled for this user' });
      return;
    }

    // Verify token strictly using otplib named verifySync API
    const result = verifySync({
      token: code,
      secret: user.mfaSecret,
    });

    if (!result || !result.valid) {
      res.status(400).json({ status: 'fail', message: 'Invalid MFA verification code' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Create session in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        deviceInfo: req.headers['user-agent'] || 'Unknown Device',
        ipAddress: req.ip || '0.0.0.0',
        expiresAt,
      },
    });

    res.status(200).json({
      status: 'success',
      token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role.name,
        isVerified: user.isEmailVerified,
        isMfaEnabled: user.isMfaEnabled,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('MFA authenticate adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Verify OTP
router.post('/auth/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    // Verify OTP log
    const otpLog = await prisma.otpLog.findFirst({
      where: {
        userId: user.id,
        code: otp,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpLog) {
      res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP verification code' });
      return;
    }

    // Mark OTP as used
    await prisma.otpLog.update({
      where: { id: otpLog.id },
      data: { isUsed: true },
    });

    // Mark email as verified if registration flow
    if (otpLog.purpose === 'email_verification') {
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
    }

    // Generate active session
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        deviceInfo: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || '0.0.0.0',
        expiresAt,
      },
    });

    res.status(200).json({
      status: 'success',
      token,
      refreshToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role.name,
        isVerified: true,
        isMfaEnabled: user.isMfaEnabled,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Verify OTP adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Forgot Password
router.post('/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(200).json({ status: 'success', message: 'If the email exists, a password reset link has been sent.' });
      return;
    }

    const otpCode = generateOTPCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpLog.create({
      data: {
        userId: user.id,
        code: otpCode,
        purpose: 'password_reset',
        expiresAt,
      },
    });

    // Send reset URL with code
    const resetUrl = `http://localhost:5173/reset-password?token=${otpCode}`;
    await sendEmail({
      to: email,
      subject: 'Reset your Antara password',
      text: `Click the link to reset your password:\n\n${resetUrl}\n\nLink will expire in 10 minutes.`,
    });

    res.status(200).json({ status: 'success', message: 'Password reset link sent.' });
  } catch (error: any) {
    console.error('Forgot password adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Reset Password
router.post('/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ status: 'fail', message: 'Token and password are required' });
      return;
    }

    const otpLog = await prisma.otpLog.findFirst({
      where: {
        code: token,
        purpose: 'password_reset',
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
      include: { user: true },
    });

    if (!otpLog) {
      res.status(400).json({ status: 'fail', message: 'Invalid or expired reset token' });
      return;
    }

    // Hash password and update user
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: otpLog.userId },
      data: { passwordHash },
    });

    // Mark OTP as used
    await prisma.otpLog.update({
      where: { id: otpLog.id },
      data: { isUsed: true },
    });

    // Revoke previous sessions
    await prisma.userSession.updateMany({
      where: { userId: otpLog.userId, isActive: true },
      data: { isActive: false },
    });

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Reset password adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Set Password
router.post('/auth/set-password', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      res.status(400).json({ status: 'fail', message: 'Password must be at least 6 characters long' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { passwordHash },
    });

    res.status(200).json({ status: 'success', message: 'Password set successfully' });
  } catch (error: any) {
    console.error('Set password error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get Me (GET /auth/me)
router.get('/auth/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { role: true },
    });

    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: user.role.name,
      isVerified: user.isEmailVerified,
      isMfaEnabled: user.isMfaEnabled,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Get me adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Logout
router.post('/auth/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await prisma.userSession.updateMany({
        where: { token, isActive: true },
        data: { isActive: false },
      });
    }
    res.status(200).json({ status: 'success', message: 'Successfully logged out' });
  } catch (error: any) {
    console.error('Logout adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Refresh token
router.post('/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ status: 'fail', message: 'Refresh token required' });
      return;
    }

    // Look up session
    const session = await prisma.userSession.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { role: true } } },
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      res.status(401).json({ status: 'fail', message: 'Invalid or expired session' });
      return;
    }

    // Create new token
    const token = jwt.sign(
      { id: session.user.id, email: session.user.email, role: session.user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Update session
    await prisma.userSession.update({
      where: { id: session.id },
      data: { token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      status: 'success',
      token,
      refreshToken: token,
    });
  } catch (error: any) {
    console.error('Refresh token adapter error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Google OAuth routes (publicly accessible)
router.use('/auth', googleAuthRouter);

// Enforce authentication and verification for all subsequent endpoints
router.use(authenticate);
router.use(requireVerified);

// Setup MFA
router.get('/auth/mfa/setup', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const secret = generateSecret();
    
    // Save generated secret in the user record dynamically
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { mfaSecret: secret },
    });

    const otpAuthUrl = generateURI({ secret, label: req.user!.email, issuer: 'Antara' });
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`;

    res.status(200).json({
      secret,
      qrCode,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Verify and Enable MFA
router.post('/auth/mfa/verify', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ status: 'fail', message: 'Verification code required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user || !user.mfaSecret) {
      res.status(400).json({ status: 'fail', message: 'MFA setup has not been initiated. Please run setup first.' });
      return;
    }

    // Verify token strictly using otplib named verifySync API
    const result = verifySync({
      token: code,
      secret: user.mfaSecret,
    });

    if (result && result.valid) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          isMfaEnabled: true,
        },
      });
      res.status(200).json({ status: 'success', message: 'MFA enabled successfully' });
    } else {
      res.status(400).json({ status: 'fail', message: 'Invalid MFA verification code' });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Disable MFA
router.post('/auth/mfa/disable', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        isMfaEnabled: false,
        mfaSecret: null,
      },
    });
    res.status(200).json({ status: 'success', message: 'MFA disabled successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Sessions
router.get('/auth/sessions', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessions = await prisma.userSession.findMany({
      where: { userId: req.user!.id, isActive: true },
    });
    res.status(200).json(
      sessions.map((s) => ({
        id: s.id,
        device: s.deviceInfo || 'Unknown Device',
        ip: s.ipAddress || '0.0.0.0',
        lastActive: s.createdAt.toISOString(),
        isCurrent: req.headers.authorization?.split(' ')[1] === s.token,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/auth/sessions/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.userSession.updateMany({
      where: { id, userId: req.user!.id },
      data: { isActive: false },
    });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Devices (Mock / Aliased to Sessions)
router.get('/auth/devices', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessions = await prisma.userSession.findMany({
      where: { userId: req.user!.id, isActive: true },
    });
    res.status(200).json(
      sessions.map((s) => ({
        id: s.id,
        name: s.deviceInfo || 'Unknown Device',
        type: (s.deviceInfo || '').toLowerCase().includes('mobile') ? 'mobile' : 'desktop',
        lastActive: s.createdAt.toISOString(),
        ipAddress: s.ipAddress || '0.0.0.0',
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/auth/devices/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.userSession.updateMany({
      where: { id, userId: req.user!.id },
      data: { isActive: false },
    });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/auth/sessions/end-all', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.userSession.updateMany({
      where: { userId: req.user!.id, isActive: true },
      data: { isActive: false },
    });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// MODULE 2: FOUNDER / STARTUP PROFILE
// ==========================================

// Get founder profile
router.get('/founder/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let founder = await prisma.founder.findUnique({
      where: { userId: req.user!.id },
      include: { educations: true, experiences: true, skills: true },
    });

    if (!founder) {
      founder = await prisma.founder.create({
        data: { userId: req.user!.id },
        include: { educations: true, experiences: true, skills: true },
      });
    }

    res.status(200).json({
      id: founder.id,
      userId: founder.userId,
      bio: founder.bio || '',
      phone: founder.phone || '',
      linkedinUrl: founder.linkedinUrl || '',
      kycStatus: founder.kycStatus || 'pending',
      profileCompletion: founder.completionPercentage || 0,
      createdAt: founder.createdAt.toISOString(),
      updatedAt: founder.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update profile
router.put('/founder/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bio, phone, linkedinUrl } = req.body;
    const includeOpts = { educations: true, experiences: true, skills: true } as const;
    let founder: Prisma.FounderGetPayload<{ include: typeof includeOpts }> | null =
      await prisma.founder.findUnique({
        where: { userId: req.user!.id },
        include: includeOpts,
      });
    if (!founder) {
      founder = await prisma.founder.create({
        data: { userId: req.user!.id },
        include: includeOpts,
      });
    }

    const newBio = bio !== undefined ? bio : founder.bio;
    const newPhone = phone !== undefined ? phone : founder.phone;
    const newLinkedinUrl = linkedinUrl !== undefined ? linkedinUrl : founder.linkedinUrl;

    // Recalculate profile completion
    let completionScore = 0;
    if (newBio) completionScore += 20;
    if (newLinkedinUrl) completionScore += 20;
    if (founder.educations.length > 0) completionScore += 20;
    if (founder.experiences.length > 0) completionScore += 20;
    if (founder.skills.length > 0) completionScore += 20;

    const updated = await prisma.founder.update({
      where: { id: founder.id },
      data: {
        bio: newBio,
        phone: newPhone,
        linkedinUrl: newLinkedinUrl,
        completionPercentage: completionScore,
      },
    });

    res.status(200).json({
      id: updated.id,
      userId: updated.userId,
      bio: updated.bio || '',
      phone: updated.phone || '',
      linkedinUrl: updated.linkedinUrl || '',
      kycStatus: updated.kycStatus || 'pending',
      profileCompletion: updated.completionPercentage || 0,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Education
router.get('/founder/education', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const founder = await prisma.founder.findUnique({
      where: { userId: req.user!.id },
      include: { educations: true },
    });
    const list = founder?.educations || [];
    res.status(200).json(
      list.map((e) => ({
        id: e.id,
        founderId: e.founderId,
        degree: e.degree,
        institution: e.institution,
        fieldOfStudy: e.fieldOfStudy || '',
        startYear: e.startDate.getFullYear(),
        endYear: e.endDate ? e.endDate.getFullYear() : undefined,
        isCurrent: e.endDate === null,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/founder/education', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { degree, institution, fieldOfStudy, startYear, endYear, isCurrent } = req.body;
    let founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      founder = await prisma.founder.create({ data: { userId: req.user!.id } });
    }

    const start = new Date(startYear, 0, 1);
    const end = isCurrent ? null : new Date(endYear || startYear + 4, 0, 1);

    const edu = await prisma.education.create({
      data: {
        founderId: founder.id,
        degree,
        institution,
        fieldOfStudy: fieldOfStudy || '',
        startDate: start,
        endDate: end,
      },
    });

    res.status(201).json({
      id: edu.id,
      founderId: edu.founderId,
      degree: edu.degree,
      institution: edu.institution,
      fieldOfStudy: edu.fieldOfStudy || '',
      startYear: edu.startDate.getFullYear(),
      endYear: edu.endDate ? edu.endDate.getFullYear() : undefined,
      isCurrent: edu.endDate === null,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/founder/education/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.education.deleteMany({ where: { id } });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Experience
router.get('/founder/experience', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const founder = await prisma.founder.findUnique({
      where: { userId: req.user!.id },
      include: { experiences: true },
    });
    const list = founder?.experiences || [];
    res.status(200).json(
      list.map((e) => ({
        id: e.id,
        founderId: e.founderId,
        company: e.company,
        role: e.role,
        description: e.description || '',
        startMonth: 'January',
        startYear: e.startDate.getFullYear(),
        endMonth: 'December',
        endYear: e.endDate ? e.endDate.getFullYear() : undefined,
        isCurrent: e.endDate === null,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/founder/experience', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { company, role, description, startYear, endYear, isCurrent } = req.body;
    let founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      founder = await prisma.founder.create({ data: { userId: req.user!.id } });
    }

    const start = new Date(startYear, 0, 1);
    const end = isCurrent ? null : new Date(endYear || startYear + 2, 0, 1);

    const exp = await prisma.experience.create({
      data: {
        founderId: founder.id,
        company,
        role,
        description: description || '',
        startDate: start,
        endDate: end,
      },
    });

    res.status(201).json({
      id: exp.id,
      founderId: exp.founderId,
      company: exp.company,
      role: exp.role,
      description: exp.description || '',
      startMonth: 'January',
      startYear: exp.startDate.getFullYear(),
      endMonth: 'December',
      endYear: exp.endDate ? exp.endDate.getFullYear() : undefined,
      isCurrent: exp.endDate === null,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/founder/experience/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.experience.deleteMany({ where: { id } });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Skills
router.get('/founder/skills', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const founder = await prisma.founder.findUnique({
      where: { userId: req.user!.id },
      include: { skills: true },
    });
    const list = founder?.skills || [];
    res.status(200).json(
      list.map((s) => ({
        id: s.id,
        founderId: s.founderId,
        name: s.name,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/founder/skills', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    let founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      founder = await prisma.founder.create({ data: { userId: req.user!.id } });
    }

    const skill = await prisma.skill.create({
      data: {
        founderId: founder.id,
        name,
      },
    });

    res.status(201).json({
      id: skill.id,
      founderId: skill.founderId,
      name: skill.name,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/founder/skills/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.skill.deleteMany({ where: { id } });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Startup details
router.get('/startup', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      res.status(404).json({ status: 'fail', message: 'Profile not found' });
      return;
    }

    let startup = await prisma.startup.findFirst({
      where: { founderId: founder.id },
    });

    if (!startup) {
      // Auto-create skeleton
      startup = await prisma.startup.create({
        data: {
          founderId: founder.id,
          name: 'My Startup',
          industry: 'Technology',
          sector: 'SaaS',
          problem: 'Description of problem',
          solution: 'Description of solution',
          businessStageId: 1,
          fundingStageId: 1,
        },
      });
    }

    res.status(200).json({
      id: startup.id,
      founderId: startup.founderId,
      name: startup.name,
      tagline: startup.tagline || '',
      description: startup.description || '',
      industry: startup.industry,
      sector: startup.sector,
      problem: startup.problem,
      solution: startup.solution,
      website: startup.website || '',
      incorporationType: startup.incorporationType || '',
      businessStageId: startup.businessStageId?.toString() || '',
      fundingStageId: startup.fundingStageId?.toString() || '',
      valuation: startup.currentValuation,
      revenue: startup.revenue,
      traction: startup.traction,
      customerCount: startup.customers,
      employeeCount: startup.employees || 0,
      createdAt: startup.createdAt.toISOString(),
      updatedAt: startup.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/startup', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, tagline, description, industry, sector, problem, solution, website,
            incorporationType, businessStageId, fundingStageId,
            valuation, revenue, traction, customerCount, employeeCount } = req.body;
    const founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      res.status(404).json({ status: 'fail', message: 'Profile not found' });
      return;
    }

    let startup = await prisma.startup.findFirst({ where: { founderId: founder.id } });
    if (!startup) {
      startup = await prisma.startup.create({
        data: {
          founderId: founder.id,
          name: name || 'My Startup',
          industry: industry || 'Technology',
          sector: sector || 'SaaS',
          problem: problem || '',
          solution: solution || '',
          businessStageId: businessStageId ? Number(businessStageId) : 1,
          fundingStageId: fundingStageId ? Number(fundingStageId) : 1,
        },
      });
    }

    const updated = await prisma.startup.update({
      where: { id: startup.id },
      data: {
        name: name !== undefined ? name : startup.name,
        tagline: tagline !== undefined ? tagline : startup.tagline,
        description: description !== undefined ? description : startup.description,
        industry: industry !== undefined ? industry : startup.industry,
        sector: sector !== undefined ? sector : startup.sector,
        problem: problem !== undefined ? problem : startup.problem,
        solution: solution !== undefined ? solution : startup.solution,
        website: website !== undefined ? website : startup.website,
        incorporationType: incorporationType !== undefined ? incorporationType : startup.incorporationType,
        businessStageId: businessStageId ? Number(businessStageId) : startup.businessStageId,
        fundingStageId: fundingStageId ? Number(fundingStageId) : startup.fundingStageId,
        currentValuation: valuation !== undefined ? Number(valuation) : startup.currentValuation,
        revenue: revenue !== undefined ? Number(revenue) : startup.revenue,
        traction: traction !== undefined ? traction : startup.traction,
        customers: customerCount !== undefined ? Number(customerCount) : startup.customers,
        employees: employeeCount !== undefined ? Number(employeeCount) : startup.employees,
      },
    });

    res.status(200).json({
      id: updated.id,
      founderId: updated.founderId,
      name: updated.name,
      tagline: updated.tagline || '',
      description: updated.description || '',
      industry: updated.industry,
      sector: updated.sector,
      problem: updated.problem,
      solution: updated.solution,
      website: updated.website || '',
      incorporationType: updated.incorporationType || '',
      businessStageId: updated.businessStageId?.toString() || '',
      fundingStageId: updated.fundingStageId?.toString() || '',
      valuation: updated.currentValuation,
      revenue: updated.revenue,
      traction: updated.traction,
      customerCount: updated.customers,
      employeeCount: updated.employees || 0,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Business & Funding Stages
router.get('/startup/business-stages', async (req, res) => {
  try {
    const list = await prisma.businessStage.findMany();
    res.status(200).json(
      list.map((s) => ({
        id: s.id.toString(),
        name: s.name,
        description: s.description || '',
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/startup/funding-stages', async (req, res) => {
  try {
    const list = await prisma.fundingStage.findMany();
    res.status(200).json(
      list.map((s) => ({
        id: s.id.toString(),
        name: s.name,
        description: s.description || '',
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Team Members
router.get('/startup/team', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      res.status(200).json([]);
      return;
    }
    const startup = await prisma.startup.findFirst({ where: { founderId: founder.id } });
    if (!startup) {
      res.status(200).json([]);
      return;
    }

    const list = await prisma.teamMember.findMany({ where: { startupId: startup.id } });
    res.status(200).json(
      list.map((m) => ({
        id: m.id,
        startupId: m.startupId,
        name: m.name,
        role: m.role,
        email: m.email || '',
        isCoFounder: m.role.toLowerCase().includes('co-founder') || m.role.toLowerCase().includes('cofounder'),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/startup/team', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, role, email, isCoFounder } = req.body;
    const founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      res.status(400).json({ status: 'fail', message: 'Founder profile must be created first.' });
      return;
    }

    let startup = await prisma.startup.findFirst({ where: { founderId: founder.id } });
    if (!startup) {
      startup = await prisma.startup.create({
        data: {
          founderId: founder.id,
          name: 'My Startup',
          industry: 'Technology',
          sector: 'SaaS',
          problem: '',
          solution: '',
          businessStageId: 1,
          fundingStageId: 1,
        },
      });
    }

    const member = await prisma.teamMember.create({
      data: {
        startupId: startup.id,
        name,
        role: isCoFounder ? `${role} (Co-Founder)` : role,
        email: email || '',
      },
    });

    res.status(201).json({
      id: member.id,
      startupId: member.startupId,
      name: member.name,
      role: member.role,
      email: member.email || '',
      isCoFounder: !!isCoFounder,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/startup/team/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.teamMember.delete({ where: { id } });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Cap Table
router.get('/startup/cap-table', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      res.status(200).json([]);
      return;
    }
    const startup = await prisma.startup.findFirst({ where: { founderId: founder.id } });
    if (!startup) {
      res.status(200).json([]);
      return;
    }

    const capTable: any = startup.capTable;
    const list = Array.isArray(capTable) ? capTable : [];
    res.status(200).json(list);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/startup/cap-table', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, equity, type, vestingSchedule } = req.body;
    const founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      res.status(400).json({ status: 'fail', message: 'Founder profile must be created first.' });
      return;
    }

    let startup = await prisma.startup.findFirst({ where: { founderId: founder.id } });
    if (!startup) {
      startup = await prisma.startup.create({
        data: {
          founderId: founder.id,
          name: 'My Startup',
          industry: 'Technology',
          sector: 'SaaS',
          problem: '',
          solution: '',
          businessStageId: 1,
          fundingStageId: 1,
        },
      });
    }

    const currentCapTable: any = startup.capTable;
    const list = Array.isArray(currentCapTable) ? [...currentCapTable] : [];

    const newEntry = {
      id: 'cap-' + Date.now(),
      startupId: startup.id,
      name,
      equity: Number(equity),
      type,
      vestingSchedule: vestingSchedule || '',
    };

    list.push(newEntry);

    await prisma.startup.update({
      where: { id: startup.id },
      data: { capTable: list as any },
    });

    res.status(201).json(newEntry);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/startup/cap-table/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const founder = await prisma.founder.findUnique({ where: { userId: req.user!.id } });
    if (!founder) {
      res.status(404).json({ status: 'fail' });
      return;
    }
    const startup = await prisma.startup.findFirst({ where: { founderId: founder.id } });
    if (!startup) {
      res.status(404).json({ status: 'fail' });
      return;
    }

    const capTable: any = startup.capTable;
    const list = Array.isArray(capTable) ? [...capTable] : [];
    const filtered = list.filter((e: any) => e.id !== id);

    await prisma.startup.update({
      where: { id: startup.id },
      data: { capTable: filtered as any },
    });

    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// MODULE 3: MSME BUSINESS PROFILE
// ==========================================

router.get('/msme/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let business = await prisma.msmeBusiness.findUnique({
      where: { userId: req.user!.id },
    });

    if (!business) {
      business = await prisma.msmeBusiness.create({
        data: {
          userId: req.user!.id,
          companyName: 'My MSME Business',
          industryId: 'manufacturing',
          turnoverTier: 'micro',
        },
      });
    }

    res.status(200).json({
      id: business.id,
      userId: business.userId,
      companyName: business.companyName,
      industryId: business.industryId,
      employeeCount: business.employeeCount,
      isExporter: business.isExporter,
      exportCountries: business.exportCountries,
      exportPercentage: business.exportPercentage,
      turnoverTier: business.turnoverTier,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/msme/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { companyName, industryId, employeeCount, isExporter, exportCountries, exportPercentage, turnoverTier } = req.body;

    const business = await prisma.msmeBusiness.upsert({
      where: { userId: req.user!.id },
      update: {
        companyName,
        industryId,
        employeeCount: employeeCount !== undefined ? Number(employeeCount) : undefined,
        isExporter: isExporter !== undefined ? !!isExporter : undefined,
        exportCountries: exportCountries !== undefined ? exportCountries : undefined,
        exportPercentage: exportPercentage !== undefined ? Number(exportPercentage) : undefined,
        turnoverTier,
      },
      create: {
        userId: req.user!.id,
        companyName: companyName || 'My MSME Business',
        industryId: industryId || 'manufacturing',
        employeeCount: Number(employeeCount || 0),
        isExporter: !!isExporter,
        exportCountries: exportCountries || [],
        exportPercentage: Number(exportPercentage || 0),
        turnoverTier: turnoverTier || 'micro',
      },
    });

    res.status(200).json({
      id: business.id,
      userId: business.userId,
      companyName: business.companyName,
      industryId: business.industryId,
      employeeCount: business.employeeCount,
      isExporter: business.isExporter,
      exportCountries: business.exportCountries,
      exportPercentage: business.exportPercentage,
      turnoverTier: business.turnoverTier,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/msme/gst', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const business = await prisma.msmeBusiness.findUnique({
      where: { userId: req.user!.id },
      include: { gstDetails: true },
    });
    const latestGst = business?.gstDetails[0];
    if (!latestGst) {
      res.status(404).json({ status: 'fail', message: 'No GST registered' });
      return;
    }
    res.status(200).json({
      id: latestGst.id,
      businessId: latestGst.businessId,
      gstNumber: latestGst.gstNumber,
      verificationStatus: latestGst.verificationStatus,
      fileUrl: latestGst.fileUrl || '',
      uploadedAt: latestGst.uploadedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/msme/gst', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { gstNumber, fileUrl } = req.body;
    let business = await prisma.msmeBusiness.findUnique({ where: { userId: req.user!.id } });
    if (!business) {
      business = await prisma.msmeBusiness.create({
        data: {
          userId: req.user!.id,
          companyName: 'My MSME Business',
          industryId: 'manufacturing',
          turnoverTier: 'micro',
        },
      });
    }

    const gst = await prisma.gstDetails.create({
      data: {
        businessId: business.id,
        gstNumber,
        fileUrl: fileUrl || '',
        verificationStatus: 'verified', // Auto verified in dev
      },
    });

    res.status(201).json({
      id: gst.id,
      businessId: gst.businessId,
      gstNumber: gst.gstNumber,
      verificationStatus: gst.verificationStatus,
      fileUrl: gst.fileUrl || '',
      uploadedAt: gst.uploadedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/msme/turnover', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const business = await prisma.msmeBusiness.findUnique({
      where: { userId: req.user!.id },
      include: { turnoverLogs: true },
    });
    const logs = business?.turnoverLogs || [];
    res.status(200).json(
      logs.map((log) => ({
        id: log.id,
        businessId: log.businessId,
        year: log.year,
        amount: log.amount,
        fileUrl: log.fileUrl || '',
        createdAt: log.createdAt.toISOString(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/msme/turnover', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { year, amount, fileUrl } = req.body;
    let business = await prisma.msmeBusiness.findUnique({ where: { userId: req.user!.id } });
    if (!business) {
      business = await prisma.msmeBusiness.create({
        data: {
          userId: req.user!.id,
          companyName: 'My MSME Business',
          industryId: 'manufacturing',
          turnoverTier: 'micro',
        },
      });
    }

    const log = await prisma.turnoverLog.create({
      data: {
        businessId: business.id,
        year: Number(year),
        amount: Number(amount),
        fileUrl: fileUrl || '',
      },
    });

    res.status(201).json({
      id: log.id,
      businessId: log.businessId,
      year: log.year,
      amount: log.amount,
      fileUrl: log.fileUrl || '',
      createdAt: log.createdAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/msme/employees', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const business = await prisma.msmeBusiness.findUnique({ where: { userId: req.user!.id } });
    res.status(200).json({
      employeeCount: business?.employeeCount || 0,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/msme/export-status', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const business = await prisma.msmeBusiness.findUnique({ where: { userId: req.user!.id } });
    res.status(200).json({
      isExporter: business?.isExporter || false,
      exportCountries: business?.exportCountries || [],
      exportPercentage: business?.exportPercentage || 0,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/msme/financial-health', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const business = await prisma.msmeBusiness.findUnique({
      where: { userId: req.user!.id },
      include: { financialHealth: true },
    });

    let health = business?.financialHealth;
    if (!health && business) {
      health = await prisma.msmeFinancialHealth.create({
        data: {
          businessId: business.id,
          cashFlowScore: 80,
          profitabilityScore: 75,
          leverageScore: 70,
          overallScore: 75,
        },
      });
    }

    res.status(200).json({
      cashFlowScore: health?.cashFlowScore || 0,
      profitabilityScore: health?.profitabilityScore || 0,
      leverageScore: health?.leverageScore || 0,
      overallScore: health?.overallScore || 0,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/msme/compliance', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const business = await prisma.msmeBusiness.findUnique({
      where: { userId: req.user!.id },
      include: { compliance: true },
    });

    let compliance = business?.compliance;
    if (!compliance && business) {
      compliance = await prisma.msmeCompliance.create({
        data: {
          businessId: business.id,
          taxCompliance: 'good',
          laborCompliance: 'good',
          environmentalCompliance: 'good',
          overallStatus: 'compliant',
        },
      });
    }

    res.status(200).json({
      taxCompliance: compliance?.taxCompliance || 'good',
      laborCompliance: compliance?.laborCompliance || 'good',
      environmentalCompliance: compliance?.environmentalCompliance || 'good',
      overallStatus: compliance?.overallStatus || 'compliant',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// MODULE 4: VENTURE READINESS ASSESSMENT
// ==========================================

router.get('/venture-readiness', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assessment = await prisma.businessAssessment.findFirst({
      where: { userId: req.user!.id },
      include: { answers: true, readinessScores: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!assessment) {
      // Return empty checklist skeleton
      res.status(200).json({
        id: '',
        startupId: '',
        overallScore: 0,
        dimensionScores: [],
        responses: [],
        strengths: [],
        gaps: [],
        recommendations: [],
      });
      return;
    }

    res.status(200).json({
      id: assessment.id,
      startupId: assessment.id,
      overallScore: assessment.overallScore,
      dimensionScores: assessment.readinessScores.map((score) => ({
        dimension: score.sectionName as any,
        score: score.score,
        maxScore: 100,
        percentage: score.score,
      })),
      responses: assessment.answers.map((ans) => {
        const val = ans.answerValue as any;
        return {
          questionId: ans.questionKey,
          score: val?.score || 0,
          notes: ans.comments || '',
        };
      }),
      strengths: ['Dynamic strategy definitions', 'Financial metrics setup'],
      gaps: ['Marketing budget definition'],
      recommendations: ['Perform market analysis', 'Draft full compliance policies'],
      assessedAt: assessment.createdAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/venture-readiness/assess', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { responses } = req.body; // Array of { questionId, score, notes }

    if (!Array.isArray(responses)) {
      res.status(400).json({ status: 'fail', message: 'Responses array required' });
      return;
    }

    // Calculate score
    let totalScore = 0;
    responses.forEach((r: any) => {
      totalScore += Number(r.score || 0);
    });
    const avgScore = responses.length > 0 ? (totalScore / responses.length) * 20 : 0; // assuming scale 1-5, convert to %

    const assessment = await prisma.businessAssessment.create({
      data: {
        userId: req.user!.id,
        assessmentType: 'venture_readiness',
        overallScore: avgScore,
        riskScore: 30,
        growthScore: 75,
        investmentScore: avgScore,
        status: 'submitted',
      },
    });

    // Create Answers
    for (const r of responses) {
      await prisma.assessmentAnswer.create({
        data: {
          assessmentId: assessment.id,
          questionKey: r.questionId,
          answerValue: { score: r.score },
          comments: r.notes || '',
        },
      });
    }

    // Create readiness score dimensions
    const dimensions = ['team', 'product', 'market', 'traction', 'financials', 'legal'];
    for (const dim of dimensions) {
      await prisma.readinessScore.create({
        data: {
          assessmentId: assessment.id,
          sectionName: dim,
          score: Math.floor(avgScore + (Math.random() * 20 - 10)),
          recommendations: ['Strengthen governance', 'Track key metrics'] as any,
        },
      });
    }

    // Return the response
    const finalAssessment = await prisma.businessAssessment.findUnique({
      where: { id: assessment.id },
      include: { answers: true, readinessScores: true },
    });

    res.status(200).json({
      id: finalAssessment!.id,
      startupId: finalAssessment!.id,
      overallScore: finalAssessment!.overallScore,
      dimensionScores: finalAssessment!.readinessScores.map((score) => ({
        dimension: score.sectionName as any,
        score: score.score,
        maxScore: 100,
        percentage: score.score,
      })),
      responses: finalAssessment!.answers.map((ans) => {
        const val = ans.answerValue as any;
        return {
          questionId: ans.questionKey,
          score: val?.score || 0,
          notes: ans.comments || '',
        };
      }),
      strengths: ['Strategy definition'],
      gaps: ['Market size validation'],
      recommendations: ['Draft governance structure'],
      assessedAt: finalAssessment!.createdAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/venture-readiness/reassess', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Delete existing assessments
    await prisma.businessAssessment.deleteMany({
      where: { userId: req.user!.id },
    });

    // Fetch user profile data
    const founder = await prisma.founder.findUnique({
      where: { userId: req.user!.id },
      include: { educations: true, experiences: true, skills: true },
    });

    let startup = founder ? await prisma.startup.findFirst({
      where: { founderId: founder.id },
    }) : null;

    const teamCount = startup ? await prisma.teamMember.count({
      where: { startupId: startup.id },
    }) : 0;

    const docs = await prisma.document.findMany({
      where: { ownerId: req.user!.id },
    });

    // 1. Team Score (max 100)
    let teamScore = 30;
    if (founder?.experiences && founder.experiences.length > 0) teamScore += 30;
    if (founder?.educations && founder.educations.length > 0) teamScore += 20;
    if (teamCount > 0) teamScore += 20;

    // 2. Product Score (max 100)
    let productScore = 30;
    if (startup?.problem && startup?.solution) productScore += 40;
    if (startup?.name && startup?.name !== 'My Startup') productScore += 30;

    // 3. Market Score (max 100)
    let marketScore = 40;
    if (startup?.industry && startup?.sector) marketScore += 30;
    if (startup?.traction) marketScore += 30;

    // 4. Traction Score (max 100)
    let tractionScore = 30;
    if (startup?.revenue && startup.revenue > 0) tractionScore += 35;
    if (startup?.customers && startup.customers > 0) tractionScore += 35;

    // 5. Financials Score (max 100)
    let financialsScore = 30;
    const hasFinancialDocs = docs.some(d => d.category === 'Financial Statements' || d.category === 'Bank Statements');
    if (hasFinancialDocs) financialsScore += 40;
    if (startup?.currentValuation && startup.currentValuation > 0) financialsScore += 30;

    // 6. Legal Score (max 100)
    let legalScore = 45;
    const hasLegalDocs = docs.some(d => d.category === 'Incorporation' || d.category === 'Legal');
    if (hasLegalDocs) legalScore += 55;

    // Overall Score (average of dimensions)
    const overallScore = Math.round((teamScore + productScore + marketScore + tractionScore + financialsScore + legalScore) / 6);

    // Save dynamic assessment
    const assessment = await prisma.businessAssessment.create({
      data: {
        userId: req.user!.id,
        assessmentType: 'venture_readiness',
        overallScore,
        riskScore: 25,
        growthScore: 80,
        investmentScore: overallScore,
        status: 'submitted',
      },
    });

    // Save dimension scores
    const dimensions = [
      { name: 'team', score: teamScore },
      { name: 'product', score: productScore },
      { name: 'market', score: marketScore },
      { name: 'traction', score: tractionScore },
      { name: 'financials', score: financialsScore },
      { name: 'legal', score: legalScore }
    ];

    for (const d of dimensions) {
      await prisma.readinessScore.create({
        data: {
          assessmentId: assessment.id,
          sectionName: d.name,
          score: d.score,
          recommendations: ['Target area improvement'] as any,
        },
      });
    }

    // Dynamic Strengths, Gaps, and Recommendations
    const strengths = [];
    if (teamScore > 60) strengths.push('Core founding team and members are established.');
    if (productScore > 60) strengths.push('Product problem and solution statement is clearly structured.');
    if (financialsScore > 60) strengths.push('Financial statements or projections are documented.');
    if (strengths.length === 0) strengths.push('Venture readiness analysis framework initialized.');

    const gaps = [];
    if (teamScore <= 50) gaps.push('Need to structure and add core team members.');
    if (financialsScore <= 50) gaps.push('Missing uploaded financial statement documents.');
    if (productScore <= 50) gaps.push('Startup profile details require completion.');
    if (gaps.length === 0) gaps.push('Review compliance checklist for further gaps.');

    const recommendations = [];
    if (teamScore <= 50) recommendations.push('Build out startup team details and upload profiles.');
    if (financialsScore <= 50) recommendations.push('Upload recent financial or bank statements to the documents hub.');
    if (productScore <= 50) recommendations.push('Specify sector, industry, and problem-solution details.');
    if (recommendations.length === 0) recommendations.push('Schedule a session with an advisory expert to review investment readiness.');

    res.status(200).json({
      id: assessment.id,
      startupId: assessment.id,
      overallScore: assessment.overallScore,
      dimensionScores: dimensions.map(d => ({
        dimension: d.name as any,
        score: d.score,
        maxScore: 100,
        percentage: d.score,
      })),
      responses: [],
      strengths,
      gaps,
      recommendations,
      assessedAt: assessment.createdAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// MODULE 5: ADVISORY MODULE
// ==========================================

router.get('/advisors', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { expertise, search } = req.query;

    // Build dynamic filter
    const where: any = {};
    if (expertise && String(expertise).trim()) {
      // Filter advisors whose expertise array contains the given expertise (case-insensitive)
      where.expertise = {
        has: String(expertise),
      };
    }

    const list = await prisma.advisor.findMany({
      where,
      include: {
        user: true,
        meetings: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let results = list.map((adv) => ({
      id: adv.id,
      name: `${adv.user.firstName} ${adv.user.lastName}`,
      email: adv.user.email,
      expertise: adv.expertise as string[],
      availabilitySlots: adv.availabilitySlots,
      bio: adv.bio || null,
      rate: adv.rate,
      status: adv.status,
      sessionCount: adv.meetings.length,
      avatar: null as string | null,
    }));

    // Apply optional text search on name/bio/expertise client-side after DB fetch
    if (search && String(search).trim()) {
      const q = String(search).toLowerCase();
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.bio || '').toLowerCase().includes(q) ||
          a.expertise.some((e) => e.toLowerCase().includes(q))
      );
    }

    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/advisors/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adv = await prisma.advisor.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: true,
        meetings: { select: { id: true } },
      },
    });

    if (!adv) {
      res.status(404).json({ status: 'fail', message: 'Advisor not found' });
      return;
    }

    res.status(200).json({
      id: adv.id,
      name: `${adv.user.firstName} ${adv.user.lastName}`,
      email: adv.user.email,
      expertise: adv.expertise,
      availabilitySlots: adv.availabilitySlots,
      bio: adv.bio || null,
      rate: adv.rate,
      status: adv.status,
      sessionCount: adv.meetings.length,
      avatar: null,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/advisors/sessions', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.meeting.findMany({
      where: { clientId: req.user!.id },
      include: { advisor: { include: { user: true } } },
    });

    res.status(200).json(
      list.map((m) => ({
        id: m.id,
        advisorId: m.advisorId,
        advisorName: `${m.advisor.user.firstName} ${m.advisor.user.lastName}`,
        date: m.scheduledAt.toISOString(),
        time: m.scheduledAt.toLocaleTimeString(),
        duration: m.durationMinutes,
        status: m.status as any,
        meetingLink: m.meetingLink || '',
        notes: m.notes || '',
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/advisors/book', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { advisorId, scheduledAt, date, time, duration, topic, notes } = req.body;

    if (!advisorId) {
      res.status(400).json({ status: 'fail', message: 'advisorId is required' });
      return;
    }

    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId },
      include: { user: true },
    });

    if (!advisor) {
      res.status(404).json({ status: 'fail', message: 'Advisor not found' });
      return;
    }

    // Parse the scheduled datetime from ISO string or date+time pair
    let sched: Date;
    if (scheduledAt) {
      sched = new Date(scheduledAt);
    } else if (date) {
      sched = new Date(date + 'T' + (time || '10:00:00'));
    } else {
      res.status(400).json({ status: 'fail', message: 'scheduledAt or date is required' });
      return;
    }

    if (isNaN(sched.getTime())) {
      res.status(400).json({ status: 'fail', message: 'Invalid scheduled date/time format' });
      return;
    }

    const durationMinutes = duration || 60;

    // Check for double-booking: does this advisor have another active meeting overlapping?
    const endTime = new Date(sched.getTime() + durationMinutes * 60 * 1000);
    const conflicting = await prisma.meeting.findFirst({
      where: {
        advisorId,
        status: { notIn: ['cancelled'] },
        scheduledAt: { lt: endTime },
        AND: [
          {
            scheduledAt: {
              gte: new Date(sched.getTime() - durationMinutes * 60 * 1000),
            },
          },
        ],
      },
    });

    if (conflicting) {
      res.status(409).json({
        status: 'fail',
        message: 'This time slot is already booked for the selected advisor. Please choose a different time.',
      });
      return;
    }

    const meeting = await prisma.meeting.create({
      data: {
        advisorId,
        clientId: req.user!.id,
        scheduledAt: sched,
        durationMinutes,
        notes: topic ? `Topic: ${topic}${notes ? '\n' + notes : ''}` : (notes || ''),
        meetingLink: 'https://meet.google.com/' + Math.random().toString(36).substring(2, 11),
      },
      include: { advisor: { include: { user: true } } },
    });

    await sendConsultationBookedEmail(
      req.user!.email,
      `Advisor: ${advisor.user.firstName} ${advisor.user.lastName}\nTopic: ${topic || 'General Consultation'}\nScheduled Date: ${sched.toLocaleString()}\nDuration: ${durationMinutes} mins\nMeeting Link: ${meeting.meetingLink}`
    );

    res.status(201).json({
      id: meeting.id,
      advisorId: meeting.advisorId,
      advisorName: `${advisor.user.firstName} ${advisor.user.lastName}`,
      scheduledAt: meeting.scheduledAt.toISOString(),
      date: meeting.scheduledAt.toISOString(),
      time: meeting.scheduledAt.toTimeString().slice(0, 5),
      duration: meeting.durationMinutes,
      status: meeting.status,
      meetingLink: meeting.meetingLink || '',
      notes: meeting.notes || '',
      topic: topic || null,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/advisors/sessions/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.meeting.updateMany({
      where: { id, clientId: req.user!.id },
      data: { status: 'cancelled' },
    });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// MODULE 5: MILESTONE (PROGRESS TRACKING) CRUD
// ==========================================

// List milestones for the logged-in user (client)
router.get('/milestones', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const milestones = await prisma.progressTracking.findMany({
      where: { clientId: req.user!.id },
      orderBy: { targetDate: 'asc' },
    });
    res.status(200).json(
      milestones.map((m) => ({
        id: m.id,
        milestoneName: m.milestoneName,
        description: m.description || '',
        targetDate: m.targetDate.toISOString(),
        status: m.status,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Create a milestone
router.post('/milestones', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { milestoneName, description, targetDate, status } = req.body;

    if (!milestoneName || !targetDate) {
      res.status(400).json({ status: 'fail', message: 'milestoneName and targetDate are required' });
      return;
    }

    const parsedDate = new Date(targetDate);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ status: 'fail', message: 'Invalid targetDate format' });
      return;
    }

    const milestone = await prisma.progressTracking.create({
      data: {
        clientId: req.user!.id,
        milestoneName,
        description: description || null,
        targetDate: parsedDate,
        status: status || 'not_started',
      },
    });

    res.status(201).json({
      id: milestone.id,
      milestoneName: milestone.milestoneName,
      description: milestone.description || '',
      targetDate: milestone.targetDate.toISOString(),
      status: milestone.status,
      createdAt: milestone.createdAt.toISOString(),
      updatedAt: milestone.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update a milestone (status, description, targetDate)
router.put('/milestones/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { milestoneName, description, targetDate, status } = req.body;

    const existing = await prisma.progressTracking.findFirst({
      where: { id, clientId: req.user!.id },
    });

    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Milestone not found or access denied' });
      return;
    }

    const updated = await prisma.progressTracking.update({
      where: { id },
      data: {
        ...(milestoneName !== undefined && { milestoneName }),
        ...(description !== undefined && { description }),
        ...(targetDate !== undefined && { targetDate: new Date(targetDate) }),
        ...(status !== undefined && { status }),
      },
    });

    res.status(200).json({
      id: updated.id,
      milestoneName: updated.milestoneName,
      description: updated.description || '',
      targetDate: updated.targetDate.toISOString(),
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Delete a milestone
router.delete('/milestones/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.progressTracking.findFirst({
      where: { id, clientId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ status: 'fail', message: 'Milestone not found or access denied' });
      return;
    }
    await prisma.progressTracking.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Milestone deleted' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Timeline: merged list of meetings + milestones sorted by date
router.get('/advisors/timeline', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [meetings, milestones] = await Promise.all([
      prisma.meeting.findMany({
        where: { clientId: req.user!.id },
        include: { advisor: { include: { user: true } } },
        orderBy: { scheduledAt: 'asc' },
      }),
      prisma.progressTracking.findMany({
        where: { clientId: req.user!.id },
        orderBy: { targetDate: 'asc' },
      }),
    ]);

    const timelineItems = [
      ...meetings.map((m) => ({
        id: m.id,
        type: 'meeting' as const,
        title: `Meeting with ${m.advisor.user.firstName} ${m.advisor.user.lastName}`,
        date: m.scheduledAt.toISOString(),
        status: m.status,
        meetingLink: m.meetingLink || null,
        notes: m.notes || '',
        duration: m.durationMinutes,
      })),
      ...milestones.map((ms) => ({
        id: ms.id,
        type: 'milestone' as const,
        title: ms.milestoneName,
        date: ms.targetDate.toISOString(),
        status: ms.status,
        description: ms.description || '',
        meetingLink: null,
        notes: '',
        duration: null,
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json(timelineItems);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Helper to derive mimeType from file extension
const getMimeType = (fileName: string): string => {
  const ext = (fileName || '').split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    txt: 'text/plain',
  };
  return map[ext] || 'application/octet-stream';
};

// Category mapping from backend category string to frontend categoryId
const getCategoryId = (category: string): string => {
  const map: Record<string, string> = {
    'KYC': 'legal',
    'Incorporation': 'legal',
    'Legal': 'legal',
    'Financial': 'financial',
    'Business Plan': 'business-plan',
    'Product': 'product',
    'Team': 'team',
    'Marketing': 'marketing',
  };
  return map[category] || 'other';
};

const getCategoryNameFromId = (categoryId: string): string => {
  const map: Record<string, string> = {
    'business-plan': 'Business Plan',
    'financial': 'Financial',
    'legal': 'Legal',
    'product': 'Product',
    'team': 'Team',
    'marketing': 'Marketing',
    'other': 'Other',
  };
  return map[categoryId] || 'Other';
};

// Helper mapping — returns the full shape the frontend Document type expects
const mapDocFields = (d: any) => ({
  id: d.id,
  founderId: d.ownerId,
  startupId: d.startupId || '',
  // DocumentsPage fields
  name: d.fileName,
  description: d.description || '',
  tags: d.tags || [],
  categoryId: getCategoryId(d.category),
  currentVersion: d.currentVersion || 1,
  status: 'approved' as const,
  sharedWith: d.shares ? d.shares.map((s: any) => s.sharedWith) : [],
  fileUrl: `/api/documents/${d.id}/download`,
  fileSize: d.fileSize || 0,
  mimeType: getMimeType(d.fileName),
  createdAt: d.createdAt.toISOString(),
  updatedAt: d.updatedAt ? d.updatedAt.toISOString() : d.createdAt.toISOString(),
  // KYC page fields
  type: d.category,
  fileName: d.fileName,
  uploadedAt: d.createdAt.toISOString(),
});

// Get user documents
router.get('/founder/documents', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.document.findMany({
      where: { ownerId: req.user!.id },
      include: { shares: true },
    });
    res.status(200).json(list.map(mapDocFields));
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/documents', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId   = req.user!.id;
    const userEmail = req.user!.email;
    const isAdmin  = ['Admin', 'Super Admin'].includes(req.user!.roleName || '');

    // 1. Fetch documents the user owns
    const ownedDocs = await prisma.document.findMany({
      where: { ownerId: userId },
      include: { shares: true },
    });

    // 2. Fetch documents shared with this user (via email)
    const shareRecords = await prisma.documentShare.findMany({
      where: { sharedWith: userEmail },
      include: {
        document: {
          include: { shares: true },
        },
      },
    });

    const sharedDocs = shareRecords.map((sr) => ({
      ...mapDocFields(sr.document),
      myPermission: sr.permission,   // 'view' | 'edit'
      sharedById: sr.sharedById,
    }));

    // 3. For admin, also include everything (de-duped)
    if (isAdmin) {
      const allDocs = await prisma.document.findMany({
        include: { shares: true },
      });
      const ownedIds = new Set(ownedDocs.map((d) => d.id));
      const sharedIds = new Set(sharedDocs.map((d: any) => d.id));
      const adminExtra = allDocs
        .filter((d) => !ownedIds.has(d.id) && !sharedIds.has(d.id))
        .map(mapDocFields);
      return res.status(200).json([
        ...ownedDocs.map(mapDocFields),
        ...sharedDocs,
        ...adminExtra,
      ]);
    }

    // De-duplicate: if a doc appears in both (owner shared with self edge-case), owned wins
    const ownedIds = new Set(ownedDocs.map((d) => d.id));
    const dedupedShared = sharedDocs.filter((d: any) => !ownedIds.has(d.id));

    res.status(200).json([
      ...ownedDocs.map((d) => ({ ...mapDocFields(d), myPermission: 'owner' })),
      ...dedupedShared,
    ]);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Upload Document (GET by ID, POST)
router.post('/founder/documents/upload', authenticate, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, isSensitive, expiryDate } = req.body;
    if (!req.file) {
      res.status(400).json({ status: 'fail', message: 'File is required' });
      return;
    }

    const doc = await prisma.document.create({
      data: {
        ownerId: req.user!.id,
        category: type || 'Incorporation',
        fileName: req.file.originalname,
        filePath: req.file.path,
        isSensitive: isSensitive === 'true' || isSensitive === true,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    await prisma.documentVersion.create({
      data: {
        documentId: doc.id,
        versionNumber: 1,
        filePath: req.file.path,
        uploadedById: req.user!.id,
        changelog: 'Initial Upload',
      },
    });

    res.status(201).json(mapDocFields(doc));
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/founder/kyc/upload', authenticate, upload.single('kycDocument'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ status: 'fail', message: 'No file uploaded.' });
      return;
    }

    const doc = await prisma.document.create({
      data: {
        ownerId: req.user!.id,
        category: 'KYC',
        fileName: req.file.originalname,
        filePath: req.file.path,
        isSensitive: true,
      },
    });

    await prisma.documentVersion.create({
      data: {
        documentId: doc.id,
        versionNumber: 1,
        filePath: req.file.path,
        uploadedById: req.user!.id,
        changelog: 'KYC Document Submission',
      },
    });

    let founder = await prisma.founder.findUnique({
      where: { userId: req.user!.id }
    });

    if (!founder) {
      founder = await prisma.founder.create({
        data: { userId: req.user!.id }
      });
    }

    const updatedFounder = await prisma.founder.update({
      where: { id: founder.id },
      data: {
        kycStatus: 'submitted',
      },
    });

    res.status(200).json({
      status: 'success',
      kycStatus: updatedFounder.kycStatus,
      document: doc,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/documents/upload', authenticate, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, categoryId, description, name } = req.body;
    if (!req.file) {
      res.status(400).json({ status: 'fail', message: 'File is required' });
      return;
    }

    const docCategory = getCategoryNameFromId(categoryId || type || '');

    const doc = await prisma.document.create({
      data: {
        ownerId: req.user!.id,
        category: docCategory,
        fileName: name || req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        description: description || '',
        tags: [],
      },
    });

    await prisma.documentVersion.create({
      data: {
        documentId: doc.id,
        versionNumber: 1,
        filePath: req.file.path,
        uploadedById: req.user!.id,
        changelog: 'Initial Upload',
      },
    });

    res.status(201).json(mapDocFields(doc));
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/founder/documents/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (doc) {
      await prisma.document.delete({ where: { id, ownerId: req.user!.id } });
      if (doc.category === 'KYC') {
        const remaining = await prisma.document.count({
          where: { ownerId: req.user!.id, category: 'KYC' }
        });
        if (remaining === 0) {
          const founder = await prisma.founder.findUnique({
            where: { userId: doc.ownerId }
          });
          if (founder) {
            await prisma.founder.update({
              where: { id: founder.id },
              data: { kycStatus: 'pending' },
            });
          }
        }
      }
    }
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/documents/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (doc) {
      await prisma.document.delete({ where: { id, ownerId: req.user!.id } });
      if (doc.category === 'KYC') {
        const remaining = await prisma.document.count({
          where: { ownerId: req.user!.id, category: 'KYC' }
        });
        if (remaining === 0) {
          const founder = await prisma.founder.findUnique({
            where: { userId: doc.ownerId }
          });
          if (founder) {
            await prisma.founder.update({
              where: { id: founder.id },
              data: { kycStatus: 'pending' },
            });
          }
        }
      }
    }
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/documents/:id/download', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const doc = await prisma.document.findUnique({ where: { id } });

    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }

    const isOwner = doc.ownerId === req.user!.id;
    const isAdmin = ['Admin', 'Super Admin'].includes(req.user!.roleName || '');

    // Check if the user has been explicitly shared this document
    let isSharedWith = false;
    if (!isOwner && !isAdmin) {
      const shareRecord = await prisma.documentShare.findUnique({
        where: { documentId_sharedWith: { documentId: id, sharedWith: req.user!.email } },
      });
      isSharedWith = !!shareRecord;
    }

    if (!isOwner && !isAdmin && !isSharedWith) {
      res.status(403).json({ status: 'fail', message: 'Unauthorized access' });
      return;
    }

    if (!fs.existsSync(doc.filePath)) {
      res.status(404).json({ status: 'fail', message: 'File not found on server' });
      return;
    }

    res.download(doc.filePath, doc.fileName);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/documents/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }

    const isOwner = doc.ownerId === req.user!.id;
    const isAdmin = ['Admin', 'Super Admin'].includes(req.user!.roleName || '');

    // Check if the document is shared with this user
    let shareRecord = null;
    if (!isOwner && !isAdmin) {
      shareRecord = await prisma.documentShare.findUnique({
        where: { documentId_sharedWith: { documentId: id, sharedWith: req.user!.email } },
      });
      if (!shareRecord) {
        res.status(403).json({ status: 'fail', message: 'Access denied' });
        return;
      }
    }

    res.status(200).json({
      ...mapDocFields(doc),
      myPermission: isOwner ? 'owner' : isAdmin ? 'admin' : shareRecord!.permission,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Share a document with another user by email (sends email invite dynamically)
router.post('/documents/:id/share', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const documentId = req.params.id as string;
    const { email, permission } = req.body;

    if (!email) {
      res.status(400).json({ status: 'fail', message: 'Recipient email is required' });
      return;
    }

    // Verify the document exists and the requester is the owner
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }
    if (doc.ownerId !== req.user!.id) {
      res.status(403).json({ status: 'fail', message: 'Only the document owner can share it' });
      return;
    }

    // Cannot share with yourself
    if (email === req.user!.email) {
      res.status(400).json({ status: 'fail', message: 'You cannot share a document with yourself' });
      return;
    }

    // Look up recipient user by email (if they exist)
    const recipient = await prisma.user.findUnique({ where: { email } });
    const greetingName = recipient ? recipient.firstName : 'User';
    const recipientFullName = recipient ? `${recipient.firstName} ${recipient.lastName}` : email;

    // Upsert share record (update permission if already shared)
    const share = await prisma.documentShare.upsert({
      where: { documentId_sharedWith: { documentId, sharedWith: email } },
      update: { permission: permission || 'view' },
      create: {
        documentId,
        sharedById: req.user!.id,
        sharedWith: email,
        permission: permission || 'view',
      },
    });

    // Send email invite notification dynamically
    const senderName = `${req.user!.firstName} ${req.user!.lastName}`;
    const accessUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/founder/documents`;

    await sendEmail({
      to: email,
      subject: `Document Shared with You: ${doc.fileName}`,
      text: `Hello ${greetingName},\n\n${senderName} has shared a document with you on Antara.\n\nDocument Name: ${doc.fileName}\nPermission: ${permission || 'view'}\n\nYou can access it by logging into your dashboard under the Documents tab:\n${accessUrl}\n\nBest regards,\nThe Antara Team`,
      fromName: senderName,
      replyTo: req.user!.email,
    });

    res.status(200).json({
      status: 'success',
      message: `Document successfully shared with ${recipientFullName} (${email})`,
      share: {
        id: share.id,
        sharedWith: share.sharedWith,
        recipientName: recipientFullName,
        permission: share.permission,
        createdAt: share.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update document details (PUT /documents/:id)
router.put('/documents/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, tags, categoryId } = req.body;

    const doc = await prisma.document.findUnique({
      where: { id },
      include: { shares: true },
    });

    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }

    const isOwner = doc.ownerId === req.user!.id;
    const isAdmin = ['Admin', 'Super Admin'].includes(req.user!.roleName || '');

    let canEdit = isOwner || isAdmin;
    if (!canEdit) {
      const shareRecord = await prisma.documentShare.findUnique({
        where: { documentId_sharedWith: { documentId: id, sharedWith: req.user!.email } },
      });
      if (shareRecord && shareRecord.permission === 'edit') {
        canEdit = true;
      }
    }

    if (!canEdit) {
      res.status(403).json({ status: 'fail', message: 'Access denied or insufficient permission to edit' });
      return;
    }

    const updateData: any = {};
    if (name !== undefined) updateData.fileName = name;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (categoryId !== undefined) updateData.category = getCategoryNameFromId(categoryId);

    const updated = await prisma.document.update({
      where: { id },
      data: updateData,
      include: { shares: true },
    });

    res.status(200).json(mapDocFields(updated));
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get the list of users a document is shared with
router.get('/documents/:id/shares', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const documentId = req.params.id as string;

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }
    if (doc.ownerId !== req.user!.id) {
      res.status(403).json({ status: 'fail', message: 'Access denied' });
      return;
    }

    const shares = await prisma.documentShare.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
    });

    // Resolve recipient names from user table
    const emails = shares.map((s) => s.sharedWith);
    const users = await prisma.user.findMany({
      where: { email: { in: emails } },
      select: { email: true, firstName: true, lastName: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.email, `${u.firstName} ${u.lastName}`]));

    res.status(200).json(
      shares.map((s) => ({
        id: s.id,
        sharedWith: s.sharedWith,
        recipientName: userMap[s.sharedWith] || s.sharedWith,
        permission: s.permission,
        createdAt: s.createdAt.toISOString(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Revoke sharing for a specific email
router.delete('/documents/:id/shares', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const documentId = req.params.id as string;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ status: 'fail', message: 'email is required to revoke sharing' });
      return;
    }

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.ownerId !== req.user!.id) {
      res.status(403).json({ status: 'fail', message: 'Only the document owner can revoke sharing' });
      return;
    }

    await prisma.documentShare.deleteMany({
      where: { documentId, sharedWith: email },
    });

    res.status(200).json({ status: 'success', message: `Sharing revoked for ${email}` });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


// ==========================================
// MODULE 7: ADMIN DASHBOARD
// ==========================================

router.get('/admin/stats', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const usersCount = await prisma.user.count();
    const activeSessionsCount = await prisma.userSession.count({ where: { isActive: true } });
    const documentsCount = await prisma.document.count();
    const meetingsCount = await prisma.meeting.count();

    res.status(200).json({
      totalUsers: usersCount,
      activeUsers: activeSessionsCount,
      totalDocuments: documentsCount,
      totalMeetings: meetingsCount,
      revenue: 85000,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/admin/users', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.user.findMany({
      include: { role: true },
    });
    res.status(200).json(
      list.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role.name,
        status: 'active',
        createdAt: u.createdAt.toISOString(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// MODULE 8: NOTIFICATIONS (EMAIL) LOGS
// ==========================================

router.get('/notifications', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.notification.findMany({
      where: { recipientId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(
      list.map((n) => ({
        id: n.id,
        title: n.subject,
        message: n.content,
        read: n.status === 'read',
        createdAt: n.createdAt.toISOString(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/notifications/unread-count', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const count = await prisma.notification.count({
      where: { recipientId: req.user!.id, status: 'pending' },
    });
    res.status(200).json({ count });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/notifications/preferences', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.status(200).json({
      email: true,
      push: false,
      sms: false,
      newsletter: true,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/notifications/preferences', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.status(200).json(req.body);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// TASKS MODULE
// ==========================================

router.get('/tasks', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.task.findMany({
      where: { assignedToId: req.user!.id },
    });
    res.status(200).json(
      list.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        dueDate: t.dueDate.toISOString(),
        status: t.status as any,
        createdAt: t.createdAt.toISOString(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/tasks', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;

    // Create a mock/detached meeting to satisfy Prisma constraint if needed, or find an existing meeting
    let meeting = await prisma.meeting.findFirst({
      where: { clientId: req.user!.id },
    });

    if (!meeting) {
      // Find advisor or mock
      const advisor = await prisma.advisor.findFirst();
      if (!advisor) {
        res.status(400).json({ status: 'fail', message: 'No advisors registered to map task' });
        return;
      }
      meeting = await prisma.meeting.create({
        data: {
          clientId: req.user!.id,
          advisorId: advisor.id,
          scheduledAt: new Date(),
          durationMinutes: 60,
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        meetingId: meeting.id,
        assignedToId: req.user!.id,
        title,
        description: description || '',
        dueDate: new Date(dueDate || Date.now() + 86400000 * 2),
      },
    });

    res.status(201).json({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate.toISOString(),
      status: task.status as any,
      createdAt: task.createdAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/tasks/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, title, description, dueDate } = req.body;
    const id = req.params.id as string;

    const task = await prisma.task.update({
      where: { id, assignedToId: req.user!.id },
      data: {
        status: status !== undefined ? status : undefined,
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        dueDate: dueDate !== undefined ? new Date(dueDate) : undefined,
      },
    });

    res.status(200).json({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate.toISOString(),
      status: task.status as any,
      createdAt: task.createdAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/tasks/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.task.delete({ where: { id, assignedToId: req.user!.id } });
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==========================================
// MOCK ENDPOINTS FOR OTHER FRONTEND ROUTING
// ==========================================

// CRM leads
router.get('/crm/leads', authenticate, (req, res) => res.json(leads));
router.post('/crm/leads', authenticate, (req, res) => {
  const newLead = { id: 'lead-' + Date.now(), ...req.body, status: 'new' };
  leads.push(newLead);
  res.status(201).json(newLead);
});
router.get('/crm/leads/:id', authenticate, (req, res) => {
  const lead = leads.find((l) => l.id === req.params.id);
  lead ? res.json(lead) : res.status(404).json({ message: 'Lead not found' });
});
router.put('/crm/leads/:id', authenticate, (req, res) => {
  const index = leads.findIndex((l) => l.id === req.params.id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...req.body };
    res.json(leads[index]);
  } else {
    res.status(404).json({ message: 'Lead not found' });
  }
});
router.delete('/crm/leads/:id', authenticate, (req, res) => {
  leads = leads.filter((l) => l.id !== req.params.id);
  res.json({ status: 'success' });
});
router.get('/crm/leads/:leadId/activities', authenticate, (req, res) => {
  res.json(leadActivities.filter((a) => a.leadId === req.params.leadId));
});
router.post('/crm/leads/:leadId/activities', authenticate, (req, res) => {
  const act = { id: 'act-' + Date.now(), leadId: req.params.leadId, ...req.body, createdAt: new Date().toISOString() };
  leadActivities.push(act);
  res.status(201).json(act);
});

// Investor CRM contacts
router.get('/investor-crm/contacts', authenticate, (req, res) => res.json(investorContacts));
router.post('/investor-crm/contacts', authenticate, (req, res) => {
  const contact = { id: 'ic-' + Date.now(), ...req.body, status: 'contacted' };
  investorContacts.push(contact);
  res.status(201).json(contact);
});
router.get('/investor-crm/contacts/:id', authenticate, (req, res) => {
  const contact = investorContacts.find((c) => c.id === req.params.id);
  contact ? res.json(contact) : res.status(404).json({ message: 'Contact not found' });
});
router.delete('/investor-crm/contacts/:id', authenticate, (req, res) => {
  investorContacts = investorContacts.filter((c) => c.id !== req.params.id);
  res.json({ status: 'success' });
});
router.get('/investor-crm/contacts/:id/communications', authenticate, (req, res) => {
  res.json(investorComms.filter((c) => c.contactId === req.params.id));
});
router.post('/investor-crm/contacts/:id/communications', authenticate, (req, res) => {
  const comm = { id: 'comm-' + Date.now(), contactId: req.params.id, ...req.body, createdAt: new Date().toISOString() };
  investorComms.push(comm);
  res.status(201).json(comm);
});
router.get('/investor-crm/contacts/:id/meetings', authenticate, (req, res) => {
  res.json(investorMeetings.filter((m) => m.contactId === req.params.id));
});
router.post('/investor-crm/contacts/:id/meetings', authenticate, (req, res) => {
  const mtg = { id: 'im-' + Date.now(), contactId: req.params.id, ...req.body };
  investorMeetings.push(mtg);
  res.status(201).json(mtg);
});
router.get('/investor-crm/contacts/:id/tasks', authenticate, (req, res) => {
  res.json(investorTasks.filter((t) => t.contactId === req.params.id));
});
router.post('/investor-crm/contacts/:id/tasks', authenticate, (req, res) => {
  const task = { id: 'it-' + Date.now(), contactId: req.params.id, ...req.body, status: 'pending' };
  investorTasks.push(task);
  res.status(201).json(task);
});

// Capital
router.get('/capital/providers', authenticate, (req, res) => res.json(capitalProviders));
router.get('/capital/providers/:id', authenticate, (req, res) => {
  const provider = capitalProviders.find((p) => p.id === req.params.id);
  provider ? res.json(provider) : res.status(404).json({ message: 'Provider not found' });
});
router.get('/capital/my-requests', authenticate, (req, res) => res.json(capitalRequests));
router.post('/capital/requests', authenticate, (req, res) => {
  const reqst = { id: 'cr-' + Date.now(), status: 'pending', createdAt: new Date().toISOString(), ...req.body };
  capitalRequests.push(reqst);
  res.status(201).json(reqst);
});

// Fundraising
router.get('/fundraising/rounds', authenticate, (req, res) => res.json(fundraisingRounds));
router.get('/fundraising/rounds/:id', authenticate, (req, res) => {
  const round = fundraisingRounds.find((r) => r.id === req.params.id);
  round ? res.json(round) : res.status(404).json({ message: 'Round not found' });
});
router.post('/fundraising/rounds', authenticate, (req, res) => {
  const round = { id: 'round-' + Date.now(), status: 'active', raisedAmount: 0, closedAmount: 0, createdAt: new Date().toISOString(), ...req.body };
  fundraisingRounds.push(round);
  res.status(201).json(round);
});
router.get('/fundraising/investors', authenticate, (req, res) => res.json(fundraisingInvestors));
router.post('/fundraising/investors', authenticate, (req, res) => {
  const inv = { id: 'inv-' + Date.now(), status: 'pending', ...req.body };
  fundraisingInvestors.push(inv);
  res.status(201).json(inv);
});
router.put('/fundraising/investors/:id/stage', authenticate, (req, res) => {
  const index = fundraisingInvestors.findIndex((i) => i.id === req.params.id);
  if (index !== -1) {
    fundraisingInvestors[index].stage = req.body.stage;
    res.json(fundraisingInvestors[index]);
  } else {
    res.status(404).json({ message: 'Investor not found' });
  }
});
router.get('/fundraising/metrics', authenticate, (req, res) => res.json(fundraisingMetrics));

// Knowledge Hub
router.get('/knowledge', authenticate, (req, res) => {
  const list = knowledgeResources.map((k) => ({ ...k, isBookmarked: bookmarks.has(k.id) }));
  res.json(list);
});
router.get('/knowledge/:id', authenticate, (req, res) => {
  const id = req.params.id as string;
  const resource = knowledgeResources.find((r) => r.id === id);
  resource ? res.json({ ...resource, isBookmarked: bookmarks.has(resource.id) }) : res.status(404).json({ message: 'Resource not found' });
});
router.post('/knowledge/:id/bookmark', authenticate, (req, res) => {
  const id = req.params.id as string;
  if (bookmarks.has(id)) {
    bookmarks.delete(id);
  } else {
    bookmarks.add(id);
  }
  res.json({ status: 'success', isBookmarked: bookmarks.has(id) });
});

// Partnership request
router.get('/partners', authenticate, (req, res) => res.json(partners));
router.get('/partners/my-requests', authenticate, (req, res) => res.json(partnershipRequests));
router.get('/partners/:id', authenticate, (req, res) => {
  const id = req.params.id as string;
  const partner = partners.find((p) => p.id === id);
  partner ? res.json(partner) : res.status(404).json({ message: 'Partner not found' });
});
router.post('/partners/:partnerId/request', authenticate, (req, res) => {
  const partnerId = req.params.partnerId as string;
  const partner = partners.find((p) => p.id === partnerId);
  const newReq = {
    id: 'req-' + Date.now(),
    partnerId: partnerId,
    partnerName: partner ? partner.name : 'Unknown Partner',
    status: 'pending',
    message: req.body.message || '',
    createdAt: new Date().toISOString(),
  };
  partnershipRequests.push(newReq);
  res.status(201).json(newReq);
});

// Payments
router.get('/payments/methods', authenticate, (req, res) => res.json(paymentMethods));
router.post('/payments/methods', authenticate, (req, res) => {
  const pm = { id: 'pm-' + Date.now(), isDefault: false, ...req.body };
  paymentMethods.push(pm);
  res.status(201).json(pm);
});
router.delete('/payments/methods/:id', authenticate, (req, res) => {
  paymentMethods = paymentMethods.filter((pm) => pm.id !== req.params.id);
  res.json({ status: 'success' });
});
router.get('/payments/transactions', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.billingLedger.findMany({ where: { userId: req.user!.id } });
    res.json(
      list.map((l) => ({
        id: l.id,
        amount: l.amount,
        status: l.status === 'paid' ? 'completed' : l.status,
        description: l.description,
        createdAt: l.invoiceDate.toISOString(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
router.get('/payments/invoices', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.billingLedger.findMany({ where: { userId: req.user!.id } });
    res.json(
      list.map((l) => ({
        id: l.id,
        amount: l.amount,
        status: l.status,
        dueDate: l.dueDate.toISOString(),
        description: l.description,
        createdAt: l.invoiceDate.toISOString(),
        invoiceNumber: 'INV-' + l.id.substring(0, 8).toUpperCase(),
      }))
    );
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
