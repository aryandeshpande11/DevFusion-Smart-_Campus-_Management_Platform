const express = require('express');
const noticeController = require('../controllers/noticeController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(['faculty', 'coordinator', 'admin']), noticeController.createNotice);
router.get('/', noticeController.getNotices);
router.delete('/:id', requireRole(['faculty', 'coordinator', 'admin']), noticeController.deleteNotice);

module.exports = router;
