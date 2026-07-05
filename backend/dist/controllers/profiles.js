"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitMsmeTurnover = exports.submitMsmeGst = exports.upsertMsmeProfile = exports.getMsmeProfile = exports.upsertStartupDetails = exports.getStartupDetails = exports.addSkills = exports.deleteExperience = exports.addExperience = exports.deleteEducation = exports.addEducation = exports.updateFounderProfile = exports.getFounderProfile = void 0;
const db_1 = require("../config/db");
// --- Founder profile helpers ---
const calculateCompletion = async (founderId) => {
    const founder = await db_1.prisma.founder.findUnique({
        where: { id: founderId },
        include: { educations: true, experiences: true, skills: true },
    });
    if (!founder)
        return 0;
    let score = 0;
    if (founder.bio)
        score += 20;
    if (founder.linkedinUrl)
        score += 20;
    if (founder.educations.length > 0)
        score += 20;
    if (founder.experiences.length > 0)
        score += 20;
    if (founder.skills.length > 0)
        score += 20;
    return score;
};
// --- Founder Endpoints ---
const getFounderProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        let founder = await db_1.prisma.founder.findUnique({
            where: { userId },
            include: { educations: true, experiences: true, skills: true },
        });
        if (!founder) {
            // Auto-create founder skeleton if they don't have one
            founder = await db_1.prisma.founder.create({
                data: { userId },
                include: { educations: true, experiences: true, skills: true },
            });
        }
        res.status(200).json({ status: 'success', data: founder });
    }
    catch (error) {
        console.error('Get founder profile error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getFounderProfile = getFounderProfile;
const updateFounderProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio, linkedinUrl, panNumber, gstNumber, kycStatus } = req.body;
        let founder = await db_1.prisma.founder.findUnique({ where: { userId } });
        if (!founder) {
            founder = await db_1.prisma.founder.create({ data: { userId } });
        }
        const updatedFounder = await db_1.prisma.founder.update({
            where: { id: founder.id },
            data: {
                bio: bio !== undefined ? bio : founder.bio,
                linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : founder.linkedinUrl,
                panNumber: panNumber !== undefined ? panNumber : founder.panNumber,
                gstNumber: gstNumber !== undefined ? gstNumber : founder.gstNumber,
                kycStatus: kycStatus !== undefined ? kycStatus : founder.kycStatus,
            },
        });
        const completionPercentage = await calculateCompletion(updatedFounder.id);
        const finalFounder = await db_1.prisma.founder.update({
            where: { id: updatedFounder.id },
            data: { completionPercentage },
            include: { educations: true, experiences: true, skills: true },
        });
        res.status(200).json({ status: 'success', data: finalFounder });
    }
    catch (error) {
        console.error('Update founder profile error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.updateFounderProfile = updateFounderProfile;
const addEducation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { institution, degree, fieldOfStudy, startDate, endDate } = req.body;
        let founder = await db_1.prisma.founder.findUnique({ where: { userId } });
        if (!founder) {
            founder = await db_1.prisma.founder.create({ data: { userId } });
        }
        const education = await db_1.prisma.education.create({
            data: {
                founderId: founder.id,
                institution,
                degree,
                fieldOfStudy,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
            },
        });
        const completionPercentage = await calculateCompletion(founder.id);
        await db_1.prisma.founder.update({
            where: { id: founder.id },
            data: { completionPercentage },
        });
        res.status(201).json({ status: 'success', data: education });
    }
    catch (error) {
        console.error('Add education error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.addEducation = addEducation;
const deleteEducation = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const edu = await db_1.prisma.education.findUnique({
            where: { id },
            include: { founder: true },
        });
        if (!edu || edu.founder.userId !== userId) {
            res.status(404).json({ status: 'fail', message: 'Education not found or unauthorized' });
            return;
        }
        await db_1.prisma.education.delete({ where: { id } });
        const completionPercentage = await calculateCompletion(edu.founderId);
        await db_1.prisma.founder.update({
            where: { id: edu.founderId },
            data: { completionPercentage },
        });
        res.status(200).json({ status: 'success', message: 'Education record deleted' });
    }
    catch (error) {
        console.error('Delete education error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.deleteEducation = deleteEducation;
const addExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const { company, role, description, startDate, endDate } = req.body;
        let founder = await db_1.prisma.founder.findUnique({ where: { userId } });
        if (!founder) {
            founder = await db_1.prisma.founder.create({ data: { userId } });
        }
        const exp = await db_1.prisma.experience.create({
            data: {
                founderId: founder.id,
                company,
                role,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
            },
        });
        const completionPercentage = await calculateCompletion(founder.id);
        await db_1.prisma.founder.update({
            where: { id: founder.id },
            data: { completionPercentage },
        });
        res.status(201).json({ status: 'success', data: exp });
    }
    catch (error) {
        console.error('Add experience error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.addExperience = addExperience;
const deleteExperience = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const exp = await db_1.prisma.experience.findUnique({
            where: { id },
            include: { founder: true },
        });
        if (!exp || exp.founder.userId !== userId) {
            res.status(404).json({ status: 'fail', message: 'Experience record not found or unauthorized' });
            return;
        }
        await db_1.prisma.experience.delete({ where: { id } });
        const completionPercentage = await calculateCompletion(exp.founderId);
        await db_1.prisma.founder.update({
            where: { id: exp.founderId },
            data: { completionPercentage },
        });
        res.status(200).json({ status: 'success', message: 'Experience record deleted' });
    }
    catch (error) {
        console.error('Delete experience error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.deleteExperience = deleteExperience;
const addSkills = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skills } = req.body; // Array of strings
        let founder = await db_1.prisma.founder.findUnique({ where: { userId } });
        if (!founder) {
            founder = await db_1.prisma.founder.create({ data: { userId } });
        }
        // Delete existing skills
        await db_1.prisma.skill.deleteMany({ where: { founderId: founder.id } });
        // Ingest new skills
        const skillData = skills.map((name) => ({
            founderId: founder.id,
            name,
        }));
        await db_1.prisma.skill.createMany({ data: skillData });
        const completionPercentage = await calculateCompletion(founder.id);
        await db_1.prisma.founder.update({
            where: { id: founder.id },
            data: { completionPercentage },
        });
        res.status(200).json({ status: 'success', message: 'Skills updated successfully' });
    }
    catch (error) {
        console.error('Update skills error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.addSkills = addSkills;
// --- Startup Endpoints ---
const getStartupDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const founder = await db_1.prisma.founder.findUnique({ where: { userId } });
        if (!founder) {
            res.status(404).json({ status: 'fail', message: 'Founder profile not initialized.' });
            return;
        }
        const startup = await db_1.prisma.startup.findFirst({
            where: { founderId: founder.id },
            include: { businessStage: true, fundingStage: true },
        });
        if (!startup) {
            res.status(404).json({ status: 'fail', message: 'No startup profile created yet.' });
            return;
        }
        res.status(200).json({ status: 'success', data: startup });
    }
    catch (error) {
        console.error('Get startup details error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getStartupDetails = getStartupDetails;
const upsertStartupDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, industry, sector, problem, solution, revenue, traction, customers, capTable, currentValuation, currentFunding, previousFunding, businessStageId, fundingStageId, } = req.body;
        let founder = await db_1.prisma.founder.findUnique({ where: { userId } });
        if (!founder) {
            founder = await db_1.prisma.founder.create({ data: { userId } });
        }
        let startup = await db_1.prisma.startup.findFirst({ where: { founderId: founder.id } });
        if (startup) {
            startup = await db_1.prisma.startup.update({
                where: { id: startup.id },
                data: {
                    name: name ?? startup.name,
                    industry: industry ?? startup.industry,
                    sector: sector ?? startup.sector,
                    problem: problem ?? startup.problem,
                    solution: solution ?? startup.solution,
                    revenue: revenue !== undefined ? Number(revenue) : startup.revenue,
                    traction: traction ?? startup.traction,
                    customers: customers !== undefined ? Number(customers) : startup.customers,
                    capTable: capTable !== undefined ? capTable : startup.capTable,
                    currentValuation: currentValuation !== undefined ? Number(currentValuation) : startup.currentValuation,
                    currentFunding: currentFunding !== undefined ? Number(currentFunding) : startup.currentFunding,
                    previousFunding: previousFunding !== undefined ? Number(previousFunding) : startup.previousFunding,
                    businessStageId: businessStageId !== undefined ? Number(businessStageId) : startup.businessStageId,
                    fundingStageId: fundingStageId !== undefined ? Number(fundingStageId) : startup.fundingStageId,
                },
            });
        }
        else {
            startup = await db_1.prisma.startup.create({
                data: {
                    founderId: founder.id,
                    name,
                    industry,
                    sector,
                    problem,
                    solution,
                    revenue: Number(revenue || 0),
                    traction: traction || '',
                    customers: Number(customers || 0),
                    capTable: capTable || null,
                    currentValuation: Number(currentValuation || 0),
                    currentFunding: Number(currentFunding || 0),
                    previousFunding: Number(previousFunding || 0),
                    businessStageId: Number(businessStageId || 1),
                    fundingStageId: Number(fundingStageId || 1),
                },
            });
        }
        res.status(200).json({ status: 'success', data: startup });
    }
    catch (error) {
        console.error('Upsert startup error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.upsertStartupDetails = upsertStartupDetails;
// --- MSME Endpoints ---
const getMsmeProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        let msme = await db_1.prisma.msmeBusiness.findUnique({
            where: { userId },
            include: {
                gstDetails: true,
                turnoverLogs: true,
                financialHealth: true,
                compliance: true,
            },
        });
        if (!msme) {
            res.status(404).json({ status: 'fail', message: 'MSME business profile not found.' });
            return;
        }
        res.status(200).json({ status: 'success', data: msme });
    }
    catch (error) {
        console.error('Get MSME profile error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getMsmeProfile = getMsmeProfile;
const upsertMsmeProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { companyName, industryId, employeeCount, isExporter, exportCountries, exportPercentage, turnoverTier, } = req.body;
        let msme = await db_1.prisma.msmeBusiness.findUnique({ where: { userId } });
        if (msme) {
            msme = await db_1.prisma.msmeBusiness.update({
                where: { id: msme.id },
                data: {
                    companyName: companyName ?? msme.companyName,
                    industryId: industryId ?? msme.industryId,
                    employeeCount: employeeCount !== undefined ? Number(employeeCount) : msme.employeeCount,
                    isExporter: isExporter !== undefined ? Boolean(isExporter) : msme.isExporter,
                    exportCountries: exportCountries ?? msme.exportCountries,
                    exportPercentage: exportPercentage !== undefined ? Number(exportPercentage) : msme.exportPercentage,
                    turnoverTier: turnoverTier ?? msme.turnoverTier,
                },
            });
        }
        else {
            msme = await db_1.prisma.msmeBusiness.create({
                data: {
                    userId,
                    companyName,
                    industryId,
                    employeeCount: Number(employeeCount || 0),
                    isExporter: Boolean(isExporter || false),
                    exportCountries: exportCountries || [],
                    exportPercentage: Number(exportPercentage || 0),
                    turnoverTier,
                },
            });
            // Initialize default mock compliance dashboard for the MSME
            await db_1.prisma.msmeCompliance.create({
                data: {
                    businessId: msme.id,
                    taxCompliance: 'pending',
                    laborCompliance: 'pending',
                    environmentalCompliance: 'pending',
                    overallStatus: 'pending',
                },
            });
        }
        res.status(200).json({ status: 'success', data: msme });
    }
    catch (error) {
        console.error('Upsert MSME error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.upsertMsmeProfile = upsertMsmeProfile;
const submitMsmeGst = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gstNumber, fileUrl } = req.body;
        const msme = await db_1.prisma.msmeBusiness.findUnique({ where: { userId } });
        if (!msme) {
            res.status(404).json({ status: 'fail', message: 'MSME Business profile not initialized.' });
            return;
        }
        const gst = await db_1.prisma.gstDetails.create({
            data: {
                businessId: msme.id,
                gstNumber,
                fileUrl,
                verificationStatus: 'verified', // Auto verified mock for MVP
            },
        });
        // Update compliance status to true for tax
        await db_1.prisma.msmeCompliance.update({
            where: { businessId: msme.id },
            data: {
                taxCompliance: 'compliant',
                overallStatus: 'partial',
            },
        });
        res.status(201).json({ status: 'success', data: gst });
    }
    catch (error) {
        console.error('Submit MSME GST error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.submitMsmeGst = submitMsmeGst;
const submitMsmeTurnover = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, amount, fileUrl } = req.body;
        const msme = await db_1.prisma.msmeBusiness.findUnique({ where: { userId } });
        if (!msme) {
            res.status(404).json({ status: 'fail', message: 'MSME Business profile not initialized.' });
            return;
        }
        const log = await db_1.prisma.turnoverLog.create({
            data: {
                businessId: msme.id,
                year: Number(year),
                amount: Number(amount),
                fileUrl,
            },
        });
        res.status(201).json({ status: 'success', data: log });
    }
    catch (error) {
        console.error('Submit MSME turnover error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.submitMsmeTurnover = submitMsmeTurnover;
