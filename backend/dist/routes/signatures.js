"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = require("../middlewares/auth");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Sign a document
router.post('/:documentId/sign', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const userId = req.user.id;
        const document = await db_1.prisma.document.findUnique({
            where: { id: documentId },
        });
        if (!document) {
            res.status(404).json({ status: 'fail', message: 'Document not found' });
            return;
        }
        // Check if already signed
        const existingSig = await db_1.prisma.digitalSignature.findUnique({
            where: { documentId },
        });
        if (existingSig) {
            res.status(400).json({ status: 'fail', message: 'Document is already signed' });
            return;
        }
        // Create a digital signature hash using SHA-256
        const signTimestamp = new Date().toISOString();
        const signatureHash = crypto_1.default
            .createHash('sha256')
            .update(`${documentId}-${userId}-${signTimestamp}`)
            .digest('hex');
        const signature = await db_1.prisma.digitalSignature.create({
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
    }
    catch (error) {
        console.error('Sign document error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// View signature details
router.get('/:documentId/signature', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const signature = await db_1.prisma.digitalSignature.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
