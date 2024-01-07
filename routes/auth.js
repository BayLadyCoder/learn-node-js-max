const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/reset-password', authController.getResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);

router.post(
  '/signup',
  check('email').isEmail().withMessage('Invalid email.'),
  authController.postSignup
);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/reset-password', authController.postResetPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
