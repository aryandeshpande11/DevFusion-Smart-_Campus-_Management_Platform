const express = require('express');
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/auth');
const { requireRole, requirePermission } = require('../middlewares/rbac');
const upload = require('../middlewares/upload');
const { uploadRateLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

router.use(requireAuth);

// self-service profile routes
router.get('/me', userController.getMyProfile);
router.patch('/me', userController.updateMyProfile);
router.post('/me/avatar', uploadRateLimiter, upload.single('avatar'), userController.uploadMyAvatar);
router.post('/me/resume', uploadRateLimiter, upload.single('resume'), userController.uploadMyResume);

// admin/faculty management routes — permission-based so any role with
// manageUsers: true works, regardless of what that role is named
router.get('/', requirePermission('manageUsers'), userController.listUsers);
router.get('/roles/list', requirePermission('manageUsers'), userController.listRoles);
router.get('/:id', requireRole(['admin', 'faculty', 'coordinator']), userController.getUserById);
router.patch('/:id/role', requirePermission('manageUsers'), userController.updateUserRole);
router.patch('/:id/status', requirePermission('manageUsers'), userController.updateUserStatus);
router.patch('/:id/academic', requirePermission('manageUsers'), userController.updateUserAcademicInfo);
router.delete('/:id', requirePermission('manageUsers'), userController.deleteUser);

module.exports = router;