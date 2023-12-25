const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const bayUserId = '6580a7be8040278aeb070c87';

  User.findById(bayUserId)
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;

      // to make sure session is saved before redirect
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
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
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  // todo: will add validation and error message later

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup');
      }

      const salt = 12;
      return bcrypt.hash(password, salt);
    })
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
      });

      return user.save().then((result) => {
        res.redirect('/login');
      });
    })

    .catch((err) => console.log(err));
};
