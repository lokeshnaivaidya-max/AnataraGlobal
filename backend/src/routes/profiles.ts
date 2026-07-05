import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  getFounderProfile,
  updateFounderProfile,
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addSkills,
  getStartupDetails,
  upsertStartupDetails,
  getMsmeProfile,
  upsertMsmeProfile,
  submitMsmeGst,
  submitMsmeTurnover,
} from '../controllers/profiles';

const router = Router();

const updateFounderProfileSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    panNumber: z.string().optional(),
    gstNumber: z.string().optional(),
    kycStatus: z.enum(['pending', 'verified', 'rejected']).optional(),
  }),
});

const addEducationSchema = z.object({
  body: z.object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    startDate: z.string().datetime().or(z.string().date()),
    endDate: z.string().datetime().or(z.string().date()).optional().nullable(),
  }),
});

const addExperienceSchema = z.object({
  body: z.object({
    company: z.string().min(1, 'Company is required'),
    role: z.string().min(1, 'Role is required'),
    description: z.string().optional(),
    startDate: z.string().datetime().or(z.string().date()),
    endDate: z.string().datetime().or(z.string().date()).optional().nullable(),
  }),
});

const addSkillsSchema = z.object({
  body: z.object({
    skills: z.array(z.string()).min(1, 'Skills array must have at least one skill'),
  }),
});

const upsertStartupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Startup name is required'),
    industry: z.string().min(1, 'Industry is required'),
    sector: z.string().min(1, 'Sector is required'),
    problem: z.string().min(1, 'Problem description is required'),
    solution: z.string().min(1, 'Solution description is required'),
    revenue: z.number().optional(),
    traction: z.string().optional(),
    customers: z.number().int().optional(),
    capTable: z.any().optional(),
    currentValuation: z.number().optional(),
    currentFunding: z.number().optional(),
    previousFunding: z.number().optional(),
    businessStageId: z.number().int().optional(),
    fundingStageId: z.number().int().optional(),
  }),
});

const upsertMsmeSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    industryId: z.string().min(1, 'Industry ID is required'),
    employeeCount: z.number().int().optional(),
    isExporter: z.boolean().optional(),
    exportCountries: z.array(z.string()).optional(),
    exportPercentage: z.number().optional(),
    turnoverTier: z.string().min(1, 'Turnover tier is required'),
  }),
});

const gstSchema = z.object({
  body: z.object({
    gstNumber: z.string().min(1, 'GST number is required'),
    fileUrl: z.string().url('Invalid file URL').optional(),
  }),
});

const turnoverSchema = z.object({
  body: z.object({
    year: z.number().int().min(1900).max(2100),
    amount: z.number().positive('Turnover amount must be positive'),
    fileUrl: z.string().url('Invalid file URL').optional(),
  }),
});

// All routes require authentication
router.use(authenticate);

// Founder profile routes
router.get('/founder', getFounderProfile);
router.put('/founder', validateRequest(updateFounderProfileSchema), updateFounderProfile);
router.post('/founder/education', validateRequest(addEducationSchema), addEducation);
router.delete('/founder/education/:id', deleteEducation);
router.post('/founder/experience', validateRequest(addExperienceSchema), addExperience);
router.delete('/founder/experience/:id', deleteExperience);
router.post('/founder/skills', validateRequest(addSkillsSchema), addSkills);

// Startup profile routes
router.get('/founder/startup', getStartupDetails);
router.post('/founder/startup', validateRequest(upsertStartupSchema), upsertStartupDetails);

// MSME profile routes
router.get('/msme', getMsmeProfile);
router.post('/msme', validateRequest(upsertMsmeSchema), upsertMsmeProfile);
router.post('/msme/gst', validateRequest(gstSchema), submitMsmeGst);
router.post('/msme/turnover', validateRequest(turnoverSchema), submitMsmeTurnover);

export default router;
