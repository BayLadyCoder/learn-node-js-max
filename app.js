const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoute = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const { mongoConnect } = require('./utils/database');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property
app.use(bodyParser.urlencoded({ extended: true }));

// serves static files such as css, image, js files that we allow users to access them in the frontend
app.use(express.static(path.join(__dirname, 'public')));

// this runs when there is an incoming request
// it always runs after app started,
app.use((req, res, next) => {
  const bayUserId = '650fbb39922c7c6a4aa3b91c';
  User.findById(bayUserId)
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoute);
app.use(shopRoutes);

app.use('/', errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
