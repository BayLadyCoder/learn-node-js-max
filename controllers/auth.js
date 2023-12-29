const bcrypt = require('bcryptjs');

const User = require('../models/user');

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
        });
    })
    .catch((err) => console.log(err));
};
