const express = require('express');
const { executeController, getSubmissionsController } = require('../controllers/executeController');
const { verifyTokenMiddleware } = require('../controllers/authController');

const router = express.Router();

// All execution and submission endpoints require authentication
router.post('/execute', verifyTokenMiddleware, executeController);
router.get('/submissions', verifyTokenMiddleware, getSubmissionsController);

module.exports = router;
