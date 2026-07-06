import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { sendEmail } from '../services/email';
import { AuthenticatedRequest } from '../middlewares/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'antara-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const OTP_EXPIRES_IN_MINS = Number(process.env.OTP_EXPIRES_IN_MINS || 10);

async function verifyGoogleToken(idToken: string): Promise<{ email: string; name: string } | null> {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) return null;
    const data = await response.json() as Record<string, string>;
    if (!data.email) return null;
    return { email: data.email, name: data.name || '' };
  } catch {
    return null;
  }
}

async function verifyLinkedInToken(accessToken: string): Promise<{ email: string; name: string } | null> {
  try {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    const data = await response.json() as Record<string, string>;
    if (!data.email) return null;
    const name = `${data.given_name || ''} ${data.family_name || ''}`.trim();
    return { email: data.email, name };
  } catch {
    return null;
  }
}

// Helper to generate OTP
const generateOTPCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, roleName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ status: 'fail', message: 'Email already registered' });
      return;
    }

    // Find the role
    const role = await prisma.role.findUnique({ where: { name: roleName || 'Founder' } });
    if (!role) {
      res.status(400).json({ status: 'fail', message: `Invalid role name. Options: Founder, MSME, Advisor` });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        roleId: role.id,
      },
    });

    // Generate Verification OTP
    const otpCode = generateOTPCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINS * 60 * 1000);

    await prisma.otpLog.create({
      data: {
        userId: user.id,
        code: otpCode,
        purpose: 'email_verification',
        expiresAt,
      },
    });

    // Send verification email (logged or real)
    await sendEmail({
      to: email,
      subject: 'Verify your Antara account',
      text: `Hello ${firstName},\n\nWelcome to Antara! Your verification code is: ${otpCode}.\nIt will expire in ${OTP_EXPIRES_IN_MINS} minutes.`,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        deviceInfo: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || '0.0.0.0',
        expiresAt: sessionExpiresAt,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Verification email sent.',
      token,
      data: {
        userId: user.id,
        email: user.email,
        roleName: role.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Internal registration server error' });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
      return;
    }

    if (!user.passwordHash) {
      res.status(401).json({ status: 'fail', message: 'This account does not have a password set. Please log in using Google or reset your password.' });
      return;
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
      return;
    }

    // If user has MFA enabled, require MFA OTP instead of direct login completion
    if (user.isMfaEnabled) {
      const otpCode = generateOTPCode();
      const otpExpires = new Date(Date.now() + OTP_EXPIRES_IN_MINS * 60 * 1000);

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
        text: `Your login verification code is: ${otpCode}.\nIt will expire in ${OTP_EXPIRES_IN_MINS} minutes.`,
      });

      const mfaToken = jwt.sign(
        { id: user.id, email: user.email, purpose: 'mfa_verification' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );

      res.status(200).json({
        status: 'success',
        message: 'MFA verification required',
        mfaRequired: true,
        email: user.email,
        mfaToken,
      });
      return;
    }

    // Generate final JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Create session in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || '0.0.0.0';

    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        deviceInfo: userAgent,
        ipAddress,
        expiresAt,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleName: user.role.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal login server error' });
  }
};

export const verifyOtp = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, code, purpose } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    const otp = await prisma.otpLog.findFirst({
      where: {
        userId: user.id,
        code,
        purpose,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      res.status(400).json({ status: 'fail', message: 'Invalid or expired verification code' });
      return;
    }

    // Mark OTP as used
    await prisma.otpLog.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    if (purpose === 'email_verification') {
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
    }

    if (purpose !== 'password_reset') {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
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
        message: 'Code verified successfully',
        token,
        data: {
          userId: user.id,
          email: user.email,
          roleName: user.role.name,
        },
      });
    } else {
      res.status(200).json({
        status: 'success',
        message: 'Code verified successfully. Proceed to reset your password.',
      });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ status: 'error', message: 'Internal verification server error' });
  }
};

export const forgotPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 to prevent user enumeration attacks in production, but let them know it's processed
      res.status(200).json({
        status: 'success',
        message: 'If the email exists, a password reset code has been sent.',
      });
      return;
    }

    const otpCode = generateOTPCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINS * 60 * 1000);

    await prisma.otpLog.create({
      data: {
        userId: user.id,
        code: otpCode,
        purpose: 'password_reset',
        expiresAt,
      },
    });

    await sendEmail({
      to: email,
      subject: 'Reset your Antara password',
      text: `We received a request to reset your password. Use code: ${otpCode} to finalize the reset.\nIt will expire in ${OTP_EXPIRES_IN_MINS} minutes.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset code sent to email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const resetPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    const otp = await prisma.otpLog.findFirst({
      where: {
        userId: user.id,
        code,
        purpose: 'password_reset',
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      res.status(400).json({ status: 'fail', message: 'Invalid or expired reset code' });
      return;
    }

    // Mark OTP as used
    await prisma.otpLog.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Revoke all previous active sessions
    await prisma.userSession.updateMany({
      where: { userId: user.id, isActive: true },
      data: { isActive: false },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. Please login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ status: 'error', message: 'Internal reset server error' });
  }
};

export const socialLogin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { provider, socialToken, email, firstName, lastName } = req.body;

    if (!provider || !email) {
      res.status(400).json({ status: 'fail', message: 'Provider and email are required for social login' });
      return;
    }

    if (!socialToken) {
      res.status(400).json({ status: 'fail', message: 'Social token is required' });
      return;
    }

    let verifiedProfile: { email: string; name: string } | null = null;
    if (provider === 'google') {
      verifiedProfile = await verifyGoogleToken(socialToken);
    } else if (provider === 'linkedin') {
      verifiedProfile = await verifyLinkedInToken(socialToken);
    } else {
      res.status(400).json({ status: 'fail', message: `Unsupported provider: ${provider}. Supported: google, linkedin` });
      return;
    }

    if (!verifiedProfile) {
      res.status(401).json({ status: 'fail', message: 'Invalid or expired social token' });
      return;
    }

    if (verifiedProfile.email !== email) {
      res.status(401).json({ status: 'fail', message: 'Email mismatch: the social token does not belong to the provided email' });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      const defaultRole = await prisma.role.findUnique({ where: { name: 'Founder' } });
      if (!defaultRole) {
        res.status(500).json({ status: 'error', message: 'System role missing' });
        return;
      }

      // Create random password hash for social login placeholders
      const dummyPassword = await bcrypt.hash(Math.random().toString(36).substring(2, 15), 10);
      user = await prisma.user.create({
        data: {
          email,
          firstName: firstName || 'Social',
          lastName: lastName || 'User',
          passwordHash: dummyPassword,
          roleId: defaultRole.id,
          isEmailVerified: true,
        },
        include: { role: true },
      });
    }

    // If MFA is enabled, return MFA required status and short-lived mfaToken
    if (user.isMfaEnabled) {
      const otpCode = generateOTPCode();
      const otpExpires = new Date(Date.now() + OTP_EXPIRES_IN_MINS * 60 * 1000);

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
        text: `Your login verification code is: ${otpCode}.\nIt will expire in ${OTP_EXPIRES_IN_MINS} minutes.`,
      });

      const mfaToken = jwt.sign(
        { id: user.id, email: user.email, purpose: 'mfa_verification' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );

      res.status(200).json({
        status: 'success',
        message: 'MFA verification required',
        mfaRequired: true,
        email: user.email,
        mfaToken,
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        deviceInfo: `Social OAuth: ${provider}`,
        ipAddress: req.ip || '0.0.0.0',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      status: 'success',
      message: `Login via ${provider} successful`,
      token,
      data: {
        userId: user.id,
        email: user.email,
        roleName: user.role.name,
      },
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal social login server error' });
  }
};

export const getSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const currentToken = req.headers.authorization?.replace('Bearer ', '') || '';

    const sessions = await prisma.userSession.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    const currentSession = await prisma.userSession.findFirst({
      where: { token: currentToken, userId },
      select: { id: true },
    });
    const currentSessionId = currentSession?.id;

    const sessionsWithCurrent = sessions.map((s) => ({
      ...s,
      isCurrent: s.id === currentSessionId,
    }));

    res.status(200).json({ status: 'success', data: sessionsWithCurrent });
  } catch (error) {
    console.error('Fetch sessions error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const revokeSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const session = await prisma.userSession.findUnique({ where: { id } });
    if (!session || session.userId !== userId) {
      res.status(404).json({ status: 'fail', message: 'Session not found or unauthorized' });
      return;
    }

    await prisma.userSession.update({
      where: { id },
      data: { isActive: false },
    });

    res.status(200).json({ status: 'success', message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
