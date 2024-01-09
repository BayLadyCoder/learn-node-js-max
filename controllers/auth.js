const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: null,
    oldInput: { email: '', password: '' },
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: { email, password },
        });
      }

      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;

          // to make sure session is saved before redirect
          req.session.save((err) => {
            if (err) {
              console.log(err);
            }
            return res.redirect('/');
          });
        } else {
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: { email, password },
          });
        }
      });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
    console.log(err);
  });
};

exports.getSignup = (req, res, next) => {
  const flashErrorMessageArr = req.flash('error');

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: flashErrorMessageArr[0] || null,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req, res);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, Number(process.env.SALT))
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
      });

      return user.save();
    })
    .then(() => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: process.env.MY_SENDGRID_EMAIL,
        subject: 'Bay Shop: Signup Succeeded',
        html: '<h1>You successfully signed up!</h1>',
      });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getResetPassword = (req, res, next) => {
  const flashErrorMessageArr = req.flash('error');

  res.render('auth/reset-password', {
    path: '/reset-password',
    pageTitle: 'Reset Password',
    errorMessage: flashErrorMessageArr[0] || null,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset-password');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset-password');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 60 * 5 * 1000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        transporter
          .sendMail({
            to: req.body.email,
            from: process.env.MY_SENDGRID_EMAIL,
            subject: 'Bay Shop: Password Reset',
            html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset a new password.</p>
                  `,
          })
          .catch((err) => {
            const error = new Error(err.message);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch((err) => {
        const error = new Error(err.message);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      const flashErrorMessageArr = req.flash('error');

      res.render('auth/new-password', {
        path: '/reset-password',
        pageTitle: 'New Password',
        errorMessage: flashErrorMessageArr[0] || null,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { password: newPassword, userId, passwordToken } = req.body;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, Number(process.env.SALT));
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};
