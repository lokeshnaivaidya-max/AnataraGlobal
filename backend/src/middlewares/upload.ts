import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not allowed. Allowed: ${allowed.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Type-safe multer-aware request (eliminates `(req as any).file`)
export type MulterRequest = AuthenticatedRequest & { file?: Express.Multer.File };

const _uploadSingle = upload.single('file');
const _uploadMultiple = upload.array('files', 5);

// Wraps multer middleware to catch errors and return proper HTTP codes
const wrapMulter = (mw: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    mw(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(413).json({ status: 'fail', message: 'File too large. Maximum size is 10MB.' });
          return;
        }
        res.status(400).json({ status: 'fail', message: err.message });
        return;
      }
      if (err) {
        const message = err instanceof Error ? err.message : 'File upload failed';
        res.status(400).json({ status: 'fail', message });
        return;
      }
      next();
    });
  };
};

export const uploadSingle = wrapMulter(_uploadSingle);
export const uploadMultiple = wrapMulter(_uploadMultiple);
