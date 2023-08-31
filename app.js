const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoute = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require('./utils/database');

const app = express();

db.execute('SELECT * FROM products')
  .then((result) => {
    console.log(result[0], result[1]);
  })
  .catch((error) => console.log({ error }));

app.set('view engine', 'ejs');
app.set('views', 'views');

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property
app.use(bodyParser.urlencoded({ extended: true }));

// serves static files such as css, image, js files that we allow users to access them in the frontend
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoute);
app.use(shopRoutes);

app.use('/', errorController.get404);

const port = 3000;
// app.listen does 2 things, createServer and listen
app.listen(port);
