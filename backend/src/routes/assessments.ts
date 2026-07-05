import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  getAssessmentQuestions,
  startAssessment,
  saveAnswers,
  submitAndCalculateScores,
  getAssessmentHistory,
} from '../controllers/assessments';

const router = Router();

const startAssessmentSchema = z.object({
  body: z.object({
    assessmentType: z.enum(['readiness_checklist', 'diagnostic_engine']),
  }),
});

const saveAnswersSchema = z.object({
  body: z.object({
    answers: z.array(
      z.object({
        questionKey: z.string().min(1, 'Question key is required'),
        answerValue: z.any({ required_error: 'Answer value is required' }),
        comments: z.string().optional(),
      })
    ).min(1, 'At least one answer must be submitted'),
  }),
});

// All routes require authentication
router.use(authenticate);

router.get('/questions', getAssessmentQuestions);
router.post('/start', validateRequest(startAssessmentSchema), startAssessment);
router.post('/:id/answers', validateRequest(saveAnswersSchema), saveAnswers);
router.get('/:id/scores', submitAndCalculateScores);
router.get('/history', getAssessmentHistory);

export default router;
