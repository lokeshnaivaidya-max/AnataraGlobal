"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const assessments_1 = require("../controllers/assessments");
const router = (0, express_1.Router)();
const startAssessmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        assessmentType: zod_1.z.enum(['readiness_checklist', 'diagnostic_engine']),
    }),
});
const saveAnswersSchema = zod_1.z.object({
    body: zod_1.z.object({
        answers: zod_1.z.array(zod_1.z.object({
            questionKey: zod_1.z.string().min(1, 'Question key is required'),
            answerValue: zod_1.z.any({ required_error: 'Answer value is required' }),
            comments: zod_1.z.string().optional(),
        })).min(1, 'At least one answer must be submitted'),
    }),
});
// All routes require authentication
router.use(auth_1.authenticate);
router.get('/questions', assessments_1.getAssessmentQuestions);
router.post('/start', (0, validation_1.validateRequest)(startAssessmentSchema), assessments_1.startAssessment);
router.post('/:id/answers', (0, validation_1.validateRequest)(saveAnswersSchema), assessments_1.saveAnswers);
router.get('/:id/scores', assessments_1.submitAndCalculateScores);
router.get('/history', assessments_1.getAssessmentHistory);
exports.default = router;
