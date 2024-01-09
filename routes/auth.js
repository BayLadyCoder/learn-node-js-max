const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/reset-password', authController.getResetPassword);
router.get('/reset-password/:token', authController.getNewPassword);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Invalid email.')
      .custom((value, { req }) => {
        // if (value === 'forbidden@test.com') {
        //   throw new Error('This email address is forbidden.');
        // }
        // return true;

        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'E-mail is already used. Please pick a different email.'
            );
          }
        });
      })
      .trim(),
    body(
      'password',
      'Please enter a password contains at least 5 characters with only numbers and text.'
    )
      .isLength({ min: 5 })
      .isString()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password have to match.');
        }
        return true;
      })
      .isLength({ min: 5 })
      .isString(),
  ],
  authController.postSignup
);
router.post(
  '/login',
  [body('email').trim(), body('password').trim()],
  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post('/reset-password', authController.postResetPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
