"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const auth_2 = require("../controllers/auth");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        firstName: zod_1.z.string().min(1, 'First name is required'),
        lastName: zod_1.z.string().min(1, 'Last name is required'),
        roleName: zod_1.z.enum(['Founder', 'MSME', 'Advisor']).optional(),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
const verifyOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        code: zod_1.z.string().length(6, 'OTP code must be exactly 6 digits'),
        purpose: zod_1.z.enum(['email_verification', 'login_mfa', 'password_reset']),
    }),
});
const forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
    }),
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        code: zod_1.z.string().min(1, 'Verification code is required'),
        newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters'),
    }),
});
const socialLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        provider: zod_1.z.enum(['google', 'linkedin']),
        socialToken: zod_1.z.string().min(1, 'OAuth social token is required'),
        email: zod_1.z.string().email('OAuth email is required'),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
    }),
});
router.post('/register', (0, validation_1.validateRequest)(registerSchema), auth_2.register);
router.post('/login', (0, validation_1.validateRequest)(loginSchema), auth_2.login);
router.post('/verify-otp', (0, validation_1.validateRequest)(verifyOtpSchema), auth_2.verifyOtp);
router.post('/forgot-password', (0, validation_1.validateRequest)(forgotPasswordSchema), auth_2.forgotPassword);
router.post('/reset-password', (0, validation_1.validateRequest)(resetPasswordSchema), auth_2.resetPassword);
router.post('/social-login', (0, validation_1.validateRequest)(socialLoginSchema), auth_2.socialLogin);
// Protected session routers
router.get('/sessions', auth_1.authenticate, auth_2.getSessions);
router.delete('/sessions/:id', auth_1.authenticate, auth_2.revokeSession);
exports.default = router;
