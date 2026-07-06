import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routers
import authRouter from './routes/auth';
import profilesRouter from './routes/profiles';
import assessmentsRouter from './routes/assessments';
import advisoryRouter from './routes/advisory';
import documentsRouter from './routes/documents';
import adminRouter from './routes/admin';
import notificationsRouter from './routes/notifications';
import teamRouter from './routes/team';
import signaturesRouter from './routes/signatures';
import billingRouter from './routes/billing';
import partnersRouter from './routes/partners';
import investorsRouter from './routes/investors';
import eventsRouter from './routes/events';
import adapterRouter from './routes/adapter';
import googleAuthRouter from './routes/googleAuth';
import fundraisingRouter from './routes/fundraising';
import knowledgeRouter from './routes/knowledge';
import tasksRouter from './routes/tasks';
import crmRouter from './routes/crm';

// Import Swagger Setup
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

// Import Mail services
import { sendEmail } from './services/email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with origins matching frontend configurations
app.use(cors({
  origin: '*', // Customize to match localhost:5173 / frontend url in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Compatibility Adapter Router for Frontend (bypassed for /api/v1 endpoints)
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith('/api/v1')) {
    return next();
  }
  adapterRouter(req, res, next);
});

// Health Check API
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Antara Platform MVP API is healthy.' });
});

// Main Endpoint Routers (Modules 1 - 7)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/assessments', assessmentsRouter);
app.use('/api/v1/advisory', advisoryRouter);
app.use('/api/v1/documents', documentsRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/team', teamRouter);
app.use('/api/v1/signatures', signaturesRouter);
app.use('/api/v1/billing', billingRouter);
app.use('/api/v1/partners', partnersRouter);
app.use('/api/v1/investors', investorsRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/fundraising', fundraisingRouter);
app.use('/api/v1/knowledge', knowledgeRouter);
app.use('/api/v1/tasks', tasksRouter);
app.use('/api/v1/crm', crmRouter);
app.use('/api/v1/auth', googleAuthRouter);


// Module 8: Notifications Test endpoint (Admin / Debug only utility)
app.post('/api/v1/notifications/send-test', async (req: Request, res: Response) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      res.status(400).json({ status: 'fail', message: 'Missing fields: to, subject, body' });
      return;
    }

    const success = await sendEmail({ to, subject, text: body });
    if (success) {
      res.status(200).json({ status: 'success', message: 'Test email successfully triggered!' });
    } else {
      res.status(500).json({ status: 'fail', message: 'Email failed to send.' });
    }
  } catch (error: any) {
    console.error('Test notification trigger error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Fallback Route for non-existing endpoints
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'fail', message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Logger]', err);
  const status = err.status || 'error';
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong inside the server.',
  });
});

// Import Expiry Alert Scheduler
import { startExpiryAlertScheduler } from './services/expiryAlerts';

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Antara Platform MVP Backend is running!`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`===============================================`);

  // Start background schedulers
  startExpiryAlertScheduler();
});


export default app;
