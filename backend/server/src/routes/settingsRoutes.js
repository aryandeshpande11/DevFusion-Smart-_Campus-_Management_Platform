const express = require('express');
const settingsController = require('../controllers/settingsController');
const requireAuth = require('../middlewares/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', settingsController.getSettings);
router.patch('/', settingsController.updateSettings);
router.post('/connected-accounts/google', settingsController.connectGoogleAccount);
router.delete('/me', settingsController.deleteMyAccount);

module.exports = router;
