const express = require('express');
const academicController = require('../controllers/academicController');
const requireAuth = require('../middlewares/auth');
const { requirePermission } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth);

router.get('/', academicController.listDepartments);
router.post('/', requirePermission('manageDepartments'), academicController.createDepartment);
router.patch('/:id', requirePermission('manageDepartments'), academicController.updateDepartment);
router.delete('/:id', requirePermission('manageDepartments'), academicController.deleteDepartment);

module.exports = router;