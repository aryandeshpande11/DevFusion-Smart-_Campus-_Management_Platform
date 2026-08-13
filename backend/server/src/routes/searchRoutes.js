const express = require('express');
const searchController = require('../controllers/searchController');
const requireAuth = require('../middlewares/auth');

const router = express.Router();

router.get('/', requireAuth, searchController.search);

module.exports = router;
