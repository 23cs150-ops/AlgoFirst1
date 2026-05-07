const express = require('express');
const { verifyTokenMiddleware } = require('../controllers/authController');
const { getProfileStatsController } = require('../controllers/profileController');

const router = express.Router();

router.get('/profile/stats', verifyTokenMiddleware, getProfileStatsController);

module.exports = router;
