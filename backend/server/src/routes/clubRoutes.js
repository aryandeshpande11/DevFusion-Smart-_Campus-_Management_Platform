const express = require('express');
const clubController = require('../controllers/clubController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(['coordinator']), clubController.createClub);
router.get('/', clubController.listClubs);
router.patch('/:id', requireRole(['coordinator', 'admin']), clubController.updateClub);
router.delete('/:id', requireRole(['coordinator', 'admin']), clubController.deleteClub);

router.post('/:id/join', requireRole(['student']), clubController.joinClub);
router.patch('/:id/members/:userId', requireRole(['coordinator']), clubController.updateMemberStatus);
router.get('/:id/members', requireRole(['coordinator']), clubController.getClubMembers);

module.exports = router;
