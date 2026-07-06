import { Router, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'antara-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/v1/auth/google/callback';

// Initialize passport (no session — we use JWT)
router.use(passport.initialize());

// Only register Google Strategy + routes if credentials are available
const googleAuthEnabled = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

if (googleAuthEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email from Google'), null);
          }

          const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
          const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '';

          // Find or create user
          let user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            // Auto-assign Founder role for new Google signups
            let role = await prisma.role.findUnique({ where: { name: 'Founder' } });
            if (!role) {
              role = await prisma.role.create({ data: { name: 'Founder' } });
            }

            user = await prisma.user.create({
              data: {
                email,
                firstName,
                lastName,
                passwordHash: null,
                googleId: profile.id,
                roleId: role.id,
                isEmailVerified: true,
              },
            });
          } else {
            if (!user.googleId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  googleId: profile.id,
                  isEmailVerified: true,
                },
              });
            } else if (user.googleId !== profile.id) {
              return done(new Error('This email address is already linked to a different Google account. Please contact support.'), null);
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Step 1: Redirect to Google
  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })
  );

  // Step 2: Google redirects back here
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_failed` }),
    async (req: Request, res: Response) => {
      try {
        const user = req.user as any;
        if (!user) {
          res.redirect(`${FRONTEND_URL}/login?error=no_user`);
          return;
        }

        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { role: true },
        });

        if (fullUser?.role?.name === 'Founder') {
          const existingFounder = await prisma.founder.findUnique({ where: { userId: user.id } });
          if (!existingFounder) {
            await prisma.founder.create({ data: { userId: user.id } });
          }
        }

        if (fullUser?.isMfaEnabled) {
          const mfaToken = jwt.sign(
            { id: user.id, email: user.email, purpose: 'mfa_verification' },
            JWT_SECRET,
            { expiresIn: '5m' }
          );
          res.redirect(`${FRONTEND_URL}/mfa/verify?email=${encodeURIComponent(user.email)}&mfaToken=${mfaToken}`);
          return;
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: fullUser?.role?.name || 'Founder' },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma.userSession.create({
          data: {
            userId: user.id,
            token,
            deviceInfo: req.headers['user-agent'] || 'Google OAuth Device',
            ipAddress: req.ip || '0.0.0.0',
            expiresAt,
          },
        });

        const redirectUrl = `${FRONTEND_URL}/auth/callback?token=${token}&refreshToken=${token}`;
        res.redirect(redirectUrl);
      } catch (err: any) {
        console.error('[Google OAuth Callback Error]', err);
        res.redirect(`${FRONTEND_URL}/login?error=server_error`);
      }
    }
  );
} else {
  console.warn('[Google Auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set. Google OAuth routes disabled.');
  // Stub routes that return a clear message instead of crashing
  router.get('/google', (req: Request, res: Response) => {
    res.status(503).json({ status: 'fail', message: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env' });
  });
  router.get('/google/callback', (req: Request, res: Response) => {
    res.status(503).json({ status: 'fail', message: 'Google OAuth is not configured.' });
  });
}

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!user) {
      return done(null, null);
    }

    const expressUser: Express.User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleName: user.role.name,
      permissions: user.role.permissions.map((rp) => rp.permission.name),
    };

    done(null, expressUser);
  } catch (err) {
    done(err, null);
  }
});

export default router;
