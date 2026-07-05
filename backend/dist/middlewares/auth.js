"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.restrictTo = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'antara-super-secret-jwt-key-change-in-production';
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ status: 'fail', message: 'No authorization token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Check if session exists in DB and is active
        const session = await db_1.prisma.userSession.findUnique({
            where: { token },
            include: {
                user: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            res.status(401).json({ status: 'fail', message: 'Session expired or invalid' });
            return;
        }
        // Verify token structure
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (err) {
            res.status(401).json({ status: 'fail', message: 'Invalid token signature' });
            return;
        }
        const user = session.user;
        req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roleName: user.role.name,
            permissions: user.role.permissions.map((rp) => rp.permission.name),
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server authentication error' });
    }
};
exports.authenticate = authenticate;
// Check if user has one of the allowed roles
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.roleName)) {
            res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action (Role unauthorized)',
            });
            return;
        }
        next();
    };
};
exports.restrictTo = restrictTo;
// Check if user has the specific permission dynamically
const requirePermission = (permissionName) => {
    return (req, res, next) => {
        if (!req.user || (!req.user.permissions.includes(permissionName) && req.user.roleName !== 'Super Admin')) {
            res.status(403).json({
                status: 'fail',
                message: `You do not have permission: ${permissionName}`,
            });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
