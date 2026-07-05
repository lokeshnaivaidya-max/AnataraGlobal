import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'antara-super-secret-jwt-key-change-in-production';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roleName: string;
      permissions: string[];
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: Express.User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ status: 'fail', message: 'No authorization token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Check if session exists in DB and is active
    const session = await prisma.userSession.findUnique({
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
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
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
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server authentication error' });
  }
};

// Check if user has one of the allowed roles
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

// Check if user has the specific permission dynamically
export const requirePermission = (permissionName: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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
