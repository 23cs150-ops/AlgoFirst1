const express = require('express');
const { executeController, getSubmissionsController } = require('../controllers/executeController');

const router = express.Router();

router.post('/execute', executeController);
router.get('/submissions', getSubmissionsController);

module.exports = router;
