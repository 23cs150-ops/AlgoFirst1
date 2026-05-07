const express = require('express');
const {
  registerController,
  loginController,
  verifyTokenMiddleware,
  getCurrentUserController,
} = require('../controllers/authController');

const router = express.Router();

router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.get('/auth/me', verifyTokenMiddleware, getCurrentUserController);

module.exports = router;
