import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';

const ALLOWED_CATEGORIES = [
  'Financial Statements',
  'GST',
  'Incorporation',
  'Cap Table',
  'Legal',
  'Patents',
  'Bank Statements',
  'Business Plan',
  'Pitch Deck',
];

// Ensure local uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user!.id;
    const { category, isSensitive, expiryDate, startupId } = req.body;

    if (!req.file) {
      res.status(400).json({ status: 'fail', message: 'No file uploaded.' });
      return;
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      res.status(400).json({ status: 'fail', message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}` });
      return;
    }

    const doc = await prisma.document.create({
      data: {
        ownerId,
        startupId: startupId || null,
        category,
        fileName: req.file.originalname,
        filePath: req.file.path,
        currentVersion: 1,
        isSensitive: isSensitive === 'true' || isSensitive === true,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    // Create version log
    await prisma.documentVersion.create({
      data: {
        documentId: doc.id,
        versionNumber: 1,
        filePath: req.file.path,
        uploadedById: ownerId,
        changelog: 'Initial upload',
      },
    });

    res.status(201).json({ status: 'success', data: doc });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const role = req.user!.roleName;

    let query: any = {};

    // Standard founders / MSMEs can only see documents they own
    if (role !== 'Admin' && role !== 'Super Admin' && role !== 'Advisor') {
      query.ownerId = userId;
    }

    const docs = await prisma.document.findMany({
      where: query,
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } },
        versions: { orderBy: { versionNumber: 'desc' } },
        approvals: true,
      },
    });

    res.status(200).json({ status: 'success', data: docs });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const uploadNewVersion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // Document ID
    const userId = req.user!.id;
    const { changelog } = req.body;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }

    if (doc.ownerId !== userId && req.user!.roleName !== 'Super Admin') {
      res.status(403).json({ status: 'fail', message: 'Unauthorized to update this document' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ status: 'fail', message: 'No file uploaded.' });
      return;
    }

    const nextVersion = doc.currentVersion + 1;

    await prisma.$transaction(async (tx) => {
      // Update document current version
      await tx.document.update({
        where: { id },
        data: {
          currentVersion: nextVersion,
          fileName: req.file!.originalname,
          filePath: req.file!.path,
        },
      });

      // Save version log
      await tx.documentVersion.create({
        data: {
          documentId: id,
          versionNumber: nextVersion,
          filePath: req.file!.path,
          uploadedById: userId,
          changelog: changelog || `Uploaded version ${nextVersion}`,
        },
      });
    });

    const updatedDoc = await prisma.document.findUnique({
      where: { id },
      include: { versions: true },
    });

    res.status(200).json({ status: 'success', data: updatedDoc });
  } catch (error) {
    console.error('Upload new version error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const approveDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const reviewerId = req.user!.id;
    const { status, comments } = req.body; // 'approved', 'rejected'

    if (req.user!.roleName !== 'Admin' && req.user!.roleName !== 'Super Admin' && req.user!.roleName !== 'Advisor') {
      res.status(403).json({ status: 'fail', message: 'Only admins and advisors can review documents.' });
      return;
    }

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found' });
      return;
    }

    // Upsert approval log
    const approval = await prisma.documentApproval.upsert({
      where: {
        id: (await prisma.documentApproval.findFirst({
          where: { documentId: id, versionNumber: doc.currentVersion },
        }))?.id || '',
      },
      update: {
        status,
        comments: comments || null,
        reviewedAt: new Date(),
        reviewerId,
      },
      create: {
        documentId: id,
        versionNumber: doc.currentVersion,
        reviewerId,
        status,
        comments: comments || null,
        reviewedAt: new Date(),
      },
    });

    res.status(200).json({ status: 'success', data: approval });
  } catch (error) {
    console.error('Approve document error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const downloadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const role = req.user!.roleName;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found.' });
      return;
    }

    // Role verification
    const isOwner = doc.ownerId === userId;
    const isVerifier = role === 'Admin' || role === 'Super Admin' || role === 'Advisor';

    if (!isOwner && !isVerifier) {
      res.status(403).json({ status: 'fail', message: 'Unauthorized to download this file.' });
      return;
    }

    if (!fs.existsSync(doc.filePath)) {
      res.status(404).json({ status: 'fail', message: 'Physical file not found on disk.' });
      return;
    }

    res.download(doc.filePath, doc.fileName);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getSecureShareLink = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      res.status(404).json({ status: 'fail', message: 'Document not found.' });
      return;
    }

    if (doc.ownerId !== userId && req.user!.roleName !== 'Super Admin') {
      res.status(403).json({ status: 'fail', message: 'Only the file owner can generate share links.' });
      return;
    }

    // Mock share token link generation (active for 24h)
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shareUrl = `${baseUrl}/api/v1/documents/share/download/${doc.id}?token=mock_share_token_${doc.id}_${Date.now()}`;

    res.status(200).json({ status: 'success', data: { shareUrl, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } });
  } catch (error) {
    console.error('Generate share link error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
