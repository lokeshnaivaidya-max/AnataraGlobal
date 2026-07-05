import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import {
  uploadDocument,
  getDocuments,
  uploadNewVersion,
  approveDocument,
  downloadDocument,
  getSecureShareLink,
} from '../controllers/documents';

const router = Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const approveDocumentSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected']),
    comments: z.string().optional(),
  }),
});

// All routes require authentication
router.use(authenticate);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.post('/:id/version', upload.single('file'), uploadNewVersion);
router.post('/:id/approve', validateRequest(approveDocumentSchema), approveDocument);
router.get('/:id/download', downloadDocument);
router.get('/:id/share', getSecureShareLink);

export default router;
