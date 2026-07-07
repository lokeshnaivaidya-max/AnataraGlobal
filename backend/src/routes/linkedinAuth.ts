import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'antara-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
const LINKEDIN_CALLBACK_URL = process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5001/api/v1/auth/linkedin/callback';

router.use(passport.initialize());

const linkedinAuthEnabled = !!(LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_SECRET);

function registerLinkedInRoutes(): boolean {
  let LinkedInStrategy: any;
  try {
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
  } catch {
    console.warn('[LinkedIn Auth] passport-linkedin-oauth2 not installed. Run: npm install passport-linkedin-oauth2');
    return false;
  }

  passport.use(
    new LinkedInStrategy(
      {
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: LINKEDIN_CALLBACK_URL,
        scope: ['openid', 'profile', 'email'],
        state: true,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from LinkedIn'), null);

          const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
          const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '';

          let user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            let role = await prisma.role.findUnique({ where: { name: 'Founder' } });
            if (!role) role = await prisma.role.create({ data: { name: 'Founder' } });

            user = await prisma.user.create({
              data: { email, firstName, lastName, passwordHash: null, linkedinId: profile.id, roleId: role.id, isEmailVerified: true },
            });
          } else {
            if (!user.linkedinId) {
              user = await prisma.user.update({ where: { id: user.id }, data: { linkedinId: profile.id, isEmailVerified: true } });
            } else if (user.linkedinId !== profile.id) {
              return done(new Error('This email is already linked to a different LinkedIn account.'), null);
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  router.get('/linkedin', passport.authenticate('linkedin', { session: false }));

  router.get(
    '/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=linkedin_failed` }),
    async (req: Request, res: Response) => {
      try {
        const user = req.user as any;
        if (!user) { res.redirect(`${FRONTEND_URL}/login?error=no_user`); return; }

        const fullUser = await prisma.user.findUnique({ where: { id: user.id }, include: { role: true } });

        if (fullUser?.role?.name === 'Founder') {
          const existingFounder = await prisma.founder.findUnique({ where: { userId: user.id } });
          if (!existingFounder) await prisma.founder.create({ data: { userId: user.id } });
        }

        if (fullUser?.isMfaEnabled) {
          const mfaToken = jwt.sign({ id: user.id, email: user.email, purpose: 'mfa_verification' }, JWT_SECRET, { expiresIn: '5m' });
          res.redirect(`${FRONTEND_URL}/mfa/verify?email=${encodeURIComponent(user.email)}&mfaToken=${mfaToken}`);
          return;
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: fullUser?.role?.name || 'Founder' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma.userSession.create({ data: { userId: user.id, token, deviceInfo: req.headers['user-agent'] || 'LinkedIn OAuth Device', ipAddress: req.ip || '0.0.0.0', expiresAt } });

        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&refreshToken=${token}`);
      } catch (err: any) {
        console.error('[LinkedIn OAuth Callback Error]', err);
        res.redirect(`${FRONTEND_URL}/login?error=server_error`);
      }
    }
  );

  return true;
}

if (linkedinAuthEnabled) {
  const registered = registerLinkedInRoutes();
  if (!registered) {
    router.get('/linkedin', (req, res) => res.status(503).json({ status: 'fail', message: 'Run: npm install passport-linkedin-oauth2' }));
    router.get('/linkedin/callback', (req, res) => res.status(503).json({ status: 'fail', message: 'LinkedIn OAuth package not installed.' }));
  }
} else {
  console.warn('[LinkedIn Auth] LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET not set. LinkedIn OAuth routes disabled.');
  router.get('/linkedin', (req, res) => res.status(503).json({ status: 'fail', message: 'LinkedIn OAuth not configured. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env and install passport-linkedin-oauth2.' }));
  router.get('/linkedin/callback', (req, res) => res.status(503).json({ status: 'fail', message: 'LinkedIn OAuth not configured.' }));
}

export default router;
