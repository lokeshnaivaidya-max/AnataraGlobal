"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
const updateUserRoleSchema = zod_1.z.object({
    body: zod_1.z.object({
        roleId: zod_1.z.string().uuid('Invalid role ID').optional(),
        isEmailVerified: zod_1.z.boolean().optional(),
    }),
});
// Protect all routes to Admin/Super Admin role users only
router.use(auth_1.authenticate);
router.use((0, auth_1.restrictTo)('Admin', 'Super Admin'));
router.get('/users', admin_1.getUsers);
router.put('/users/:id', (0, validation_1.validateRequest)(updateUserRoleSchema), admin_1.updateUserRole);
router.delete('/users/:id', admin_1.deleteUser);
router.get('/stats', admin_1.getDashboardStats);
router.get('/assessments', admin_1.getAssessmentsTracker);
exports.default = router;
