"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const documents_1 = require("../controllers/documents");
const router = (0, express_1.Router)();
// Configure Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
const approveDocumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['approved', 'rejected']),
        comments: zod_1.z.string().optional(),
    }),
});
// All routes require authentication
router.use(auth_1.authenticate);
router.post('/upload', upload.single('file'), documents_1.uploadDocument);
router.get('/', documents_1.getDocuments);
router.post('/:id/version', upload.single('file'), documents_1.uploadNewVersion);
router.post('/:id/approve', (0, validation_1.validateRequest)(approveDocumentSchema), documents_1.approveDocument);
router.get('/:id/download', documents_1.downloadDocument);
router.get('/:id/share', documents_1.getSecureShareLink);
exports.default = router;
