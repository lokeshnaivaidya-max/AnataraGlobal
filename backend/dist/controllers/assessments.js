"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentHistory = exports.submitAndCalculateScores = exports.saveAnswers = exports.startAssessment = exports.getAssessmentQuestions = void 0;
const db_1 = require("../config/db");
const assessment_1 = require("../services/assessment");
const email_1 = require("../services/email");
// Static template of questions to help user interfaces build dynamic assessments
const CHECKLIST_QUESTIONS = [
    { key: 'businessPlan', text: 'Do you have a documented business plan?', category: 'Readiness' },
    { key: 'pitchDeck', text: 'Do you have a current investor pitch deck?', category: 'Readiness' },
    { key: 'financialModel', text: 'Do you have a 3-year financial model?', category: 'Readiness' },
    { key: 'legal', text: 'Are co-founder agreement and incorporation papers signed?', category: 'Readiness' },
    { key: 'capTable', text: 'Is your cap table organized and up to date?', category: 'Readiness' },
    { key: 'dueDiligence', text: 'Is your virtual data room ready for due diligence?', category: 'Readiness' },
    { key: 'compliance', text: 'Are all tax and regulatory filings compliant?', category: 'Readiness' },
    { key: 'revenueMetrics', text: 'Are key performance indicators (MRR, CAC, Churn) tracked?', category: 'Readiness' },
];
const DIAGNOSTIC_SECTIONS = [
    { key: 'strategy', name: 'Strategy', description: 'Assesses business vision, market understanding, and milestones setup.' },
    { key: 'finance', name: 'Finance', description: 'Assesses budgeting, cash flow stability, and unit economics.' },
    { key: 'marketing', name: 'Marketing', description: 'Assesses acquisition channels, branding, and conversion efficiency.' },
    { key: 'hr', name: 'HR & Talent', description: 'Assesses recruiting pipelines, onboarding, and incentive schemes.' },
    { key: 'tech', name: 'Tech & Product', description: 'Assesses architecture scalability, security, and developer practices.' },
    { key: 'legal', name: 'Legal & Risk', description: 'Assesses contracts compliance, IP protections, and regulatory compliance.' },
    { key: 'ops', name: 'Operations', description: 'Assesses processes documentation, automation, and vendors management.' },
    { key: 'sales', name: 'Sales & BD', description: 'Assesses pipeline velocity, CRM tracking, and deal conversion.' },
];
const getAssessmentQuestions = async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            checklist: CHECKLIST_QUESTIONS,
            diagnosticSections: DIAGNOSTIC_SECTIONS,
        },
    });
};
exports.getAssessmentQuestions = getAssessmentQuestions;
const startAssessment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { assessmentType } = req.body; // 'readiness_checklist' or 'diagnostic_engine'
        if (!['readiness_checklist', 'diagnostic_engine'].includes(assessmentType)) {
            res.status(400).json({ status: 'fail', message: 'Invalid assessment type.' });
            return;
        }
        const assessment = await db_1.prisma.businessAssessment.create({
            data: {
                userId,
                assessmentType,
                overallScore: 0,
                riskScore: 0,
                growthScore: 0,
                investmentScore: 0,
                status: 'draft',
            },
        });
        res.status(201).json({ status: 'success', data: assessment });
    }
    catch (error) {
        console.error('Start assessment error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.startAssessment = startAssessment;
const saveAnswers = async (req, res) => {
    try {
        const id = req.params.id; // Assessment ID
        const { answers } = req.body; // Array of { questionKey: string, answerValue: any, comments?: string }
        const userId = req.user.id;
        const assessment = await db_1.prisma.businessAssessment.findUnique({ where: { id } });
        if (!assessment || assessment.userId !== userId) {
            res.status(404).json({ status: 'fail', message: 'Assessment session not found or unauthorized' });
            return;
        }
        if (assessment.status === 'completed') {
            res.status(400).json({ status: 'fail', message: 'Cannot update answers on a completed assessment' });
            return;
        }
        // Upsert answers
        for (const ans of answers) {
            const existingAns = await db_1.prisma.assessmentAnswer.findFirst({
                where: { assessmentId: id, questionKey: ans.questionKey },
            });
            if (existingAns) {
                await db_1.prisma.assessmentAnswer.update({
                    where: { id: existingAns.id },
                    data: {
                        answerValue: ans.answerValue,
                        comments: ans.comments || null,
                    },
                });
            }
            else {
                await db_1.prisma.assessmentAnswer.create({
                    data: {
                        assessmentId: id,
                        questionKey: ans.questionKey,
                        answerValue: ans.answerValue,
                        comments: ans.comments || null,
                    },
                });
            }
        }
        res.status(200).json({ status: 'success', message: 'Answers saved successfully' });
    }
    catch (error) {
        console.error('Save answers error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.saveAnswers = saveAnswers;
const submitAndCalculateScores = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const assessment = await db_1.prisma.businessAssessment.findUnique({
            where: { id },
            include: { answers: true },
        });
        if (!assessment || assessment.userId !== userId) {
            res.status(404).json({ status: 'fail', message: 'Assessment session not found or unauthorized' });
            return;
        }
        // Construct answer payload mapping
        const answersMap = {};
        assessment.answers.forEach((ans) => {
            answersMap[ans.questionKey] = ans.answerValue;
        });
        let overallScore = 0;
        let riskScore = 0;
        let growthScore = 0;
        let investmentScore = 0;
        let sectionsData = [];
        if (assessment.assessmentType === 'readiness_checklist') {
            const result = (0, assessment_1.calculateReadinessChecklistScore)(answersMap);
            overallScore = result.readinessPercentage;
            riskScore = 100 - result.readinessPercentage; // Inverse for checklist risk
            growthScore = result.readinessPercentage;
            investmentScore = result.readinessPercentage;
            sectionsData.push({
                section: 'Venture Readiness Checklist',
                score: result.readinessPercentage,
                recs: {
                    weakAreas: result.weakAreas,
                    recommendedActions: result.recommendedActions,
                },
            });
        }
        else {
            // Diagnostic engine
            const result = (0, assessment_1.calculateDiagnosticEngineScores)(answersMap);
            overallScore = result.overallScore;
            riskScore = result.riskScore;
            growthScore = result.growthScore;
            investmentScore = result.investmentScore;
            // Section scores mapping
            Object.entries(result.sectionScores).forEach(([section, score]) => {
                const matchingRecs = result.recommendations.filter((r) => r.section.toLowerCase() === section.toLowerCase());
                sectionsData.push({
                    section: section.charAt(0).toUpperCase() + section.slice(1),
                    score,
                    recs: matchingRecs.map((r) => r.recommendation),
                });
            });
        }
        // Save calculation back to database
        await db_1.prisma.$transaction(async (tx) => {
            // Update assessment overall scores
            await tx.businessAssessment.update({
                where: { id },
                data: {
                    overallScore,
                    riskScore,
                    growthScore,
                    investmentScore,
                    status: 'completed',
                },
            });
            // Clear previous section scores if any exist
            await tx.readinessScore.deleteMany({ where: { assessmentId: id } });
            // Save section scores
            const scoreRecords = sectionsData.map((sec) => ({
                assessmentId: id,
                sectionName: sec.section,
                score: sec.score,
                recommendations: sec.recs,
            }));
            await tx.readinessScore.createMany({ data: scoreRecords });
        });
        // Ingest compliance scores if MSME business details exist
        if (assessment.assessmentType === 'diagnostic_engine') {
            const msme = await db_1.prisma.msmeBusiness.findUnique({ where: { userId } });
            if (msme) {
                // Record financial health assessment score
                const answersDiag = answersMap;
                const financeScore = Number(answersDiag.finance || 5);
                const cashFlow = Math.min(10, Math.max(0, financeScore + 1)) * 10;
                const profitability = Math.min(10, Math.max(0, financeScore - 1)) * 10;
                const leverage = Math.min(10, Math.max(0, financeScore)) * 10;
                await db_1.prisma.msmeFinancialHealth.upsert({
                    where: { businessId: msme.id },
                    update: {
                        cashFlowScore: cashFlow,
                        profitabilityScore: profitability,
                        leverageScore: leverage,
                        overallScore: Math.round(overallScore),
                    },
                    create: {
                        businessId: msme.id,
                        cashFlowScore: cashFlow,
                        profitabilityScore: profitability,
                        leverageScore: leverage,
                        overallScore: Math.round(overallScore),
                    },
                });
                // Set compliance
                const legalScore = Number(answersDiag.legal || 5);
                await db_1.prisma.msmeCompliance.upsert({
                    where: { businessId: msme.id },
                    update: {
                        laborCompliance: legalScore >= 7 ? 'compliant' : 'non-compliant',
                        environmentalCompliance: legalScore >= 6 ? 'compliant' : 'non-compliant',
                        overallStatus: overallScore >= 70 ? 'good' : 'poor',
                    },
                    create: {
                        businessId: msme.id,
                        taxCompliance: 'pending',
                        laborCompliance: legalScore >= 7 ? 'compliant' : 'non-compliant',
                        environmentalCompliance: legalScore >= 6 ? 'compliant' : 'non-compliant',
                        overallStatus: overallScore >= 70 ? 'good' : 'poor',
                    },
                });
            }
        }
        // Trigger Notification trigger (Module 8)
        await (0, email_1.sendAssessmentCompletedEmail)(req.user.email, Math.round(overallScore));
        const finalAssessment = await db_1.prisma.businessAssessment.findUnique({
            where: { id },
            include: { readinessScores: true },
        });
        res.status(200).json({ status: 'success', data: finalAssessment });
    }
    catch (error) {
        console.error('Submit assessment calculation error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.submitAndCalculateScores = submitAndCalculateScores;
const getAssessmentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const list = await db_1.prisma.businessAssessment.findMany({
            where: { userId },
            include: { readinessScores: true },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ status: 'success', data: list });
    }
    catch (error) {
        console.error('Get assessment history error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getAssessmentHistory = getAssessmentHistory;
