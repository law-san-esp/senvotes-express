const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/verify', authController.verify);
router.post('/register', authController.register);
router.post('/resendVerification', authController.resendVerification);
router.post('/testMail', authController.testMail);

module.exports = router;
