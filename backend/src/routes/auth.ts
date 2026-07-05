import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  register,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  socialLogin,
  getSessions,
  revokeSession,
} from '../controllers/auth';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    roleName: z.enum(['Founder', 'MSME', 'Advisor']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().length(6, 'OTP code must be exactly 6 digits'),
    purpose: z.enum(['email_verification', 'login_mfa', 'password_reset']),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().min(1, 'Verification code is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

const socialLoginSchema = z.object({
  body: z.object({
    provider: z.enum(['google', 'linkedin']),
    socialToken: z.string().min(1, 'OAuth social token is required'),
    email: z.string().email('OAuth email is required'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtp);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);
router.post('/social-login', validateRequest(socialLoginSchema), socialLogin);

// Protected session routers
router.get('/sessions', authenticate, getSessions);
router.delete('/sessions/:id', authenticate, revokeSession);

export default router;
