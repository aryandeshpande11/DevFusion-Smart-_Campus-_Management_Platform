const express = require('express');
const academicController = require('../controllers/academicController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth);

router.get('/', academicController.listCourses);
router.post('/', requireRole(['admin']), academicController.createCourse);
router.patch('/:id', requireRole(['admin']), academicController.updateCourse);
router.delete('/:id', requireRole(['admin']), academicController.deleteCourse);
router.get('/:id/students', requireRole(['faculty', 'admin']), academicController.getStudentsInCourse);

module.exports = router;
