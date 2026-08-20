const express = require('express');
const academicController = require('../controllers/academicController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth);

router.get('/', academicController.listDepartments);
router.post('/', requireRole(['admin', 'coordinator']), academicController.createDepartment);
router.patch('/:id', requireRole(['admin', 'coordinator']), academicController.updateDepartment);
router.delete('/:id', requireRole(['admin', 'coordinator']), academicController.deleteDepartment);

module.exports = router;