import { Router, Response } from 'express';
import crypto from 'crypto';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { prisma } from '../config/db';

const router = Router();

router.use(authenticate);

// Sign a document
router.post('/:documentId/sign', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const documentId = req.params.documentId as string;
    const userId = req.user!.id;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }

    // Check if already signed
    const existingSig = await prisma.digitalSignature.findUnique({
      where: { documentId },
    });

    if (existingSig) {
      res.status(400).json({ status: 'fail', message: 'Document is already signed' });
      return;
    }

    // Create a digital signature hash using SHA-256
    const signTimestamp = new Date().toISOString();
    const signatureHash = crypto
      .createHash('sha256')
      .update(`${documentId}-${userId}-${signTimestamp}`)
      .digest('hex');

    const signature = await prisma.digitalSignature.create({
      data: {
        documentId,
        signedById: userId,
        signatureHash,
        signedAt: new Date(),
      },
      include: {
        signedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ status: 'success', data: signature });
  } catch (error: any) {
    console.error('Sign document error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// View signature details
router.get('/:documentId/signature', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const documentId = req.params.documentId as string;

    const signature = await prisma.digitalSignature.findUnique({
      where: { documentId },
      include: {
        signedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!signature) {
      res.status(404).json({ status: 'fail', message: 'No digital signature found for this document' });
      return;
    }

    res.status(200).json({ status: 'success', data: signature });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

