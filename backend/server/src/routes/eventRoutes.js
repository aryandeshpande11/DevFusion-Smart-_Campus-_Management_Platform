const express = require('express');
const eventController = require('../controllers/eventController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const validateBody = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const { createEventSchema } = require('../validators/eventValidator');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(['coordinator', 'admin']), validateBody(createEventSchema), eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/:id', eventController.getEventById);
router.patch('/:id', requireRole(['coordinator', 'admin']), eventController.updateEvent);
router.delete('/:id', requireRole(['coordinator', 'admin']), eventController.deleteEvent);
router.post('/:id/banner', requireRole(['coordinator', 'admin']), upload.single('banner'), eventController.uploadBanner);

router.post('/:id/register', requireRole(['student']), eventController.registerForEvent);
router.delete('/:id/register', requireRole(['student']), eventController.cancelRegistration);
router.get('/:id/ticket', requireRole(['student']), eventController.getMyTicket);

router.get('/:id/attendees', requireRole(['coordinator', 'admin']), eventController.getAttendees);
router.post('/:id/checkin', requireRole(['coordinator', 'admin']), eventController.checkInAttendee);

module.exports = router;
