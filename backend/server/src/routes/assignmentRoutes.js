const express = require('express');
const assignmentController = require('../controllers/assignmentController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const validateBody = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const { createAssignmentSchema, reviewSubmissionSchema } = require('../validators/assignmentValidator');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(['faculty']), validateBody(createAssignmentSchema), assignmentController.createAssignment);
router.get('/course/:courseId', assignmentController.getAssignmentsForCourse);
router.get('/me/submissions', requireRole(['student']), assignmentController.getMySubmissions);
router.get('/:id', assignmentController.getAssignmentById);
router.patch('/:id', requireRole(['faculty']), assignmentController.updateAssignment);
router.delete('/:id', requireRole(['faculty']), assignmentController.deleteAssignment);

router.post('/:id/submit', requireRole(['student']), upload.single('file'), assignmentController.submitAssignment);
router.get('/:id/submissions', requireRole(['faculty']), assignmentController.getSubmissions);
router.patch(
  '/submissions/:id/review',
  requireRole(['faculty']),
  validateBody(reviewSubmissionSchema),
  assignmentController.reviewSubmission
);

module.exports = router;
