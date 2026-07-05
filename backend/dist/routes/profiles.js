"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const profiles_1 = require("../controllers/profiles");
const router = (0, express_1.Router)();
const updateFounderProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        bio: zod_1.z.string().optional(),
        linkedinUrl: zod_1.z.string().url('Invalid LinkedIn URL').optional().or(zod_1.z.literal('')),
        panNumber: zod_1.z.string().optional(),
        gstNumber: zod_1.z.string().optional(),
        kycStatus: zod_1.z.enum(['pending', 'verified', 'rejected']).optional(),
    }),
});
const addEducationSchema = zod_1.z.object({
    body: zod_1.z.object({
        institution: zod_1.z.string().min(1, 'Institution is required'),
        degree: zod_1.z.string().min(1, 'Degree is required'),
        fieldOfStudy: zod_1.z.string().min(1, 'Field of study is required'),
        startDate: zod_1.z.string().datetime().or(zod_1.z.string().date()),
        endDate: zod_1.z.string().datetime().or(zod_1.z.string().date()).optional().nullable(),
    }),
});
const addExperienceSchema = zod_1.z.object({
    body: zod_1.z.object({
        company: zod_1.z.string().min(1, 'Company is required'),
        role: zod_1.z.string().min(1, 'Role is required'),
        description: zod_1.z.string().optional(),
        startDate: zod_1.z.string().datetime().or(zod_1.z.string().date()),
        endDate: zod_1.z.string().datetime().or(zod_1.z.string().date()).optional().nullable(),
    }),
});
const addSkillsSchema = zod_1.z.object({
    body: zod_1.z.object({
        skills: zod_1.z.array(zod_1.z.string()).min(1, 'Skills array must have at least one skill'),
    }),
});
const upsertStartupSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Startup name is required'),
        industry: zod_1.z.string().min(1, 'Industry is required'),
        sector: zod_1.z.string().min(1, 'Sector is required'),
        problem: zod_1.z.string().min(1, 'Problem description is required'),
        solution: zod_1.z.string().min(1, 'Solution description is required'),
        revenue: zod_1.z.number().optional(),
        traction: zod_1.z.string().optional(),
        customers: zod_1.z.number().int().optional(),
        capTable: zod_1.z.any().optional(),
        currentValuation: zod_1.z.number().optional(),
        currentFunding: zod_1.z.number().optional(),
        previousFunding: zod_1.z.number().optional(),
        businessStageId: zod_1.z.number().int().optional(),
        fundingStageId: zod_1.z.number().int().optional(),
    }),
});
const upsertMsmeSchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1, 'Company name is required'),
        industryId: zod_1.z.string().min(1, 'Industry ID is required'),
        employeeCount: zod_1.z.number().int().optional(),
        isExporter: zod_1.z.boolean().optional(),
        exportCountries: zod_1.z.array(zod_1.z.string()).optional(),
        exportPercentage: zod_1.z.number().optional(),
        turnoverTier: zod_1.z.string().min(1, 'Turnover tier is required'),
    }),
});
const gstSchema = zod_1.z.object({
    body: zod_1.z.object({
        gstNumber: zod_1.z.string().min(1, 'GST number is required'),
        fileUrl: zod_1.z.string().url('Invalid file URL').optional(),
    }),
});
const turnoverSchema = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.number().int().min(1900).max(2100),
        amount: zod_1.z.number().positive('Turnover amount must be positive'),
        fileUrl: zod_1.z.string().url('Invalid file URL').optional(),
    }),
});
// All routes require authentication
router.use(auth_1.authenticate);
// Founder profile routes
router.get('/founder', profiles_1.getFounderProfile);
router.put('/founder', (0, validation_1.validateRequest)(updateFounderProfileSchema), profiles_1.updateFounderProfile);
router.post('/founder/education', (0, validation_1.validateRequest)(addEducationSchema), profiles_1.addEducation);
router.delete('/founder/education/:id', profiles_1.deleteEducation);
router.post('/founder/experience', (0, validation_1.validateRequest)(addExperienceSchema), profiles_1.addExperience);
router.delete('/founder/experience/:id', profiles_1.deleteExperience);
router.post('/founder/skills', (0, validation_1.validateRequest)(addSkillsSchema), profiles_1.addSkills);
// Startup profile routes
router.get('/founder/startup', profiles_1.getStartupDetails);
router.post('/founder/startup', (0, validation_1.validateRequest)(upsertStartupSchema), profiles_1.upsertStartupDetails);
// MSME profile routes
router.get('/msme', profiles_1.getMsmeProfile);
router.post('/msme', (0, validation_1.validateRequest)(upsertMsmeSchema), profiles_1.upsertMsmeProfile);
router.post('/msme/gst', (0, validation_1.validateRequest)(gstSchema), profiles_1.submitMsmeGst);
router.post('/msme/turnover', (0, validation_1.validateRequest)(turnoverSchema), profiles_1.submitMsmeTurnover);
exports.default = router;
