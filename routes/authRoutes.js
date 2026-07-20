const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

router.get('/me', requireAuth, ctrl.me);
router.put('/profile', requireAuth, ctrl.updateProfile);

module.exports = router;
