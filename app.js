const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoute = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();
const PORT = 3000;

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
  const bayUserId = '6580a7be8040278aeb070c87';
  User.findById(bayUserId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoute);
app.use(shopRoutes);

app.use('/', errorController.get404);

mongoose
  .connect(
    'mongodb+srv://rachadabayc:oVS2JvvnG5k0eQ7p@cluster0.bhlelx4.mongodb.net/?retryWrites=true&w=majority'
  )
  .then((result) => {
    // automatically add a user if there is none (temp)
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Bay',
          email: 'bay@test.com',
          cart: { items: [] },
        });
        user.save();
      }
    });

    console.log('database connected');
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('mongoose connection error: ', err);
  });
