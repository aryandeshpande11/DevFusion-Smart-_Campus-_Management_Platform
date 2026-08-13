const express = require('express');
const placementController = require('../controllers/placementController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(['admin']), placementController.createPlacement);
router.get('/', placementController.listPlacements);
router.get('/me/applications', requireRole(['student']), placementController.getMyApplications);
router.get('/:id', placementController.getPlacementById);
router.patch('/:id', requireRole(['admin']), placementController.updatePlacement);
router.delete('/:id', requireRole(['admin']), placementController.deletePlacement);

router.post('/:id/apply', requireRole(['student']), placementController.applyToPlacement);
router.get('/:id/applications', requireRole(['admin']), placementController.getApplications);
router.patch('/applications/:id/status', requireRole(['admin']), placementController.updateApplicationStatus);

module.exports = router;
