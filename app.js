require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// a MongoDBStore class that can be used to store sessions in MongoDB. https://www.npmjs.com/package/connect-mongodb-session
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const adminRoute = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

const PORT = 3000;

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// serves static files such as css, image, js files that we allow users to access them in the frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// initialize and configure session middleware, this automatically sets and reads cookies for you
// https://expressjs.com/en/resources/middleware/session.html
app.use(
  session({
    secret: 'this should be a long string value',
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// csrf middleware must be after session
// all routes that are not GET are CSRF protected
app.use(csrfProtection);

// https://www.npmjs.com/package/connect-flash
app.use(flash());

app.use((req, res, next) => {
  // set up local variables for all views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// this runs when there is an incoming request
// it always runs after app started,
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      // having issue connecting with the database
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
});

app.use('/admin', adminRoute);
app.use(authRoutes);
app.use(shopRoutes);

app.get('/500', errorController.get500);

app.use('/', errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  // or log to sentry
  // or res.status(error.httpStatusCode).render(...)
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log('database connected');
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('mongoose connection error: ', err);
    // having issue connecting with the database
    throw new Error(err);
  });
