const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  const flashErrorMessageArr = req.flash('error');

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: flashErrorMessageArr[0] || null,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  // todo: will add validation and error message later

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
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
          req.flash('error', 'Invalid email or password');
          res.redirect('/login');
        }
      });
    })
    .catch((err) => console.log(err));
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
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  // todo: will add validation and error message later

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          'error',
          'E-mail is already used. Please pick a different email'
        );
        return res.redirect('/signup');
      }

      const salt = 12;
      return bcrypt
        .hash(password, salt)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
          });

          return user.save();
        })
        .then(() => {
          res.redirect('/login');
          transporter
            .sendMail({
              to: email,
              from: process.env.MY_SENDGRID_EMAIL,
              subject: 'Bay Shop: Signup Succeeded',
              html: '<h1>You successfully signed up!</h1>',
            })
            .catch((err) => console.log(err));
        });
    })
    .catch((err) => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
  const flashErrorMessageArr = req.flash('error');

  res.render('auth/reset-password', {
    path: '/reset-password',
    pageTitle: 'Reset Password',
    errorMessage: flashErrorMessageArr[0] || null,
  });
};
