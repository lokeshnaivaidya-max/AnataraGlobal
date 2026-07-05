"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeSession = exports.getSessions = exports.socialLogin = exports.resetPassword = exports.forgotPassword = exports.verifyOtp = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const email_1 = require("../services/email");
const JWT_SECRET = process.env.JWT_SECRET || 'antara-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const OTP_EXPIRES_IN_MINS = Number(process.env.OTP_EXPIRES_IN_MINS || 10);
// Helper to generate OTP
const generateOTPCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, roleName } = req.body;
        const existingUser = await db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ status: 'fail', message: 'Email already registered' });
            return;
        }
        // Find the role
        const role = await db_1.prisma.role.findUnique({ where: { name: roleName || 'Founder' } });
        if (!role) {
            res.status(400).json({ status: 'fail', message: `Invalid role name. Options: Founder, MSME, Advisor` });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
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
        await db_1.prisma.otpLog.create({
            data: {
                userId: user.id,
                code: otpCode,
                purpose: 'email_verification',
                expiresAt,
            },
        });
        // Send verification email (logged or real)
        await (0, email_1.sendEmail)({
            to: email,
            subject: 'Verify your Antara account',
            text: `Hello ${firstName},\n\nWelcome to Antara! Your verification code is: ${otpCode}.\nIt will expire in ${OTP_EXPIRES_IN_MINS} minutes.`,
        });
        res.status(201).json({
            status: 'success',
            message: 'Registration successful. Verification email sent.',
            data: {
                userId: user.id,
                email: user.email,
                roleName: role.name,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ status: 'error', message: 'Internal registration server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db_1.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Create session in DB
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration
        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        const ipAddress = req.ip || '0.0.0.0';
        await db_1.prisma.userSession.create({
            data: {
                userId: user.id,
                token,
                deviceInfo: userAgent,
                ipAddress,
                expiresAt,
            },
        });
        // If user has MFA enabled, require MFA OTP instead of direct login completion
        if (user.isMfaEnabled) {
            const otpCode = generateOTPCode();
            const otpExpires = new Date(Date.now() + OTP_EXPIRES_IN_MINS * 60 * 1000);
            await db_1.prisma.otpLog.create({
                data: {
                    userId: user.id,
                    code: otpCode,
                    purpose: 'login_mfa',
                    expiresAt: otpExpires,
                },
            });
            await (0, email_1.sendEmail)({
                to: email,
                subject: 'Antara MFA Login Code',
                text: `Your login verification code is: ${otpCode}.\nIt will expire in ${OTP_EXPIRES_IN_MINS} minutes.`,
            });
            res.status(200).json({
                status: 'success',
                message: 'MFA verification required',
                mfaRequired: true,
                email: user.email,
            });
            return;
        }
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Internal login server error' });
    }
};
exports.login = login;
const verifyOtp = async (req, res) => {
    try {
        const { email, code, purpose } = req.body;
        const user = await db_1.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            res.status(404).json({ status: 'fail', message: 'User not found' });
            return;
        }
        const otp = await db_1.prisma.otpLog.findFirst({
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
        await db_1.prisma.otpLog.update({
            where: { id: otp.id },
            data: { isUsed: true },
        });
        if (purpose === 'email_verification') {
            await db_1.prisma.user.update({
                where: { id: user.id },
                data: { isEmailVerified: true },
            });
        }
        // Generate active session for MFA or general verification callback
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db_1.prisma.userSession.create({
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
    }
    catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ status: 'error', message: 'Internal verification server error' });
    }
};
exports.verifyOtp = verifyOtp;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db_1.prisma.user.findUnique({ where: { email } });
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
        await db_1.prisma.otpLog.create({
            data: {
                userId: user.id,
                code: otpCode,
                purpose: 'password_reset',
                expiresAt,
            },
        });
        await (0, email_1.sendEmail)({
            to: email,
            subject: 'Reset your Antara password',
            text: `We received a request to reset your password. Use code: ${otpCode} to finalize the reset.\nIt will expire in ${OTP_EXPIRES_IN_MINS} minutes.`,
        });
        res.status(200).json({
            status: 'success',
            message: 'Password reset code sent to email.',
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ status: 'fail', message: 'User not found' });
            return;
        }
        const otp = await db_1.prisma.otpLog.findFirst({
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
        await db_1.prisma.otpLog.update({
            where: { id: otp.id },
            data: { isUsed: true },
        });
        // Update password
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await db_1.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });
        // Revoke all previous active sessions
        await db_1.prisma.userSession.updateMany({
            where: { userId: user.id, isActive: true },
            data: { isActive: false },
        });
        res.status(200).json({
            status: 'success',
            message: 'Password reset successful. Please login with your new password.',
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ status: 'error', message: 'Internal reset server error' });
    }
};
exports.resetPassword = resetPassword;
const socialLogin = async (req, res) => {
    try {
        const { provider, socialToken, email, firstName, lastName } = req.body;
        if (!provider || !email) {
            res.status(400).json({ status: 'fail', message: 'Provider and email are required for social login' });
            return;
        }
        // Mock validation of OAuth token and dynamic user ingestion
        let user = await db_1.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            const defaultRole = await db_1.prisma.role.findUnique({ where: { name: 'Founder' } });
            if (!defaultRole) {
                res.status(500).json({ status: 'error', message: 'System role missing' });
                return;
            }
            // Create random password hash for social login placeholders
            const dummyPassword = await bcryptjs_1.default.hash(Math.random().toString(36).substring(2, 15), 10);
            user = await db_1.prisma.user.create({
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
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        await db_1.prisma.userSession.create({
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
    }
    catch (error) {
        console.error('Social login error:', error);
        res.status(500).json({ status: 'error', message: 'Internal social login server error' });
    }
};
exports.socialLogin = socialLogin;
const getSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await db_1.prisma.userSession.findMany({
            where: { userId, isActive: true },
            select: {
                id: true,
                deviceInfo: true,
                ipAddress: true,
                createdAt: true,
                expiresAt: true,
            },
        });
        res.status(200).json({ status: 'success', data: sessions });
    }
    catch (error) {
        console.error('Fetch sessions error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getSessions = getSessions;
const revokeSession = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const session = await db_1.prisma.userSession.findUnique({ where: { id } });
        if (!session || session.userId !== userId) {
            res.status(404).json({ status: 'fail', message: 'Session not found or unauthorized' });
            return;
        }
        await db_1.prisma.userSession.update({
            where: { id },
            data: { isActive: false },
        });
        res.status(200).json({ status: 'success', message: 'Session revoked successfully' });
    }
    catch (error) {
        console.error('Revoke session error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.revokeSession = revokeSession;
