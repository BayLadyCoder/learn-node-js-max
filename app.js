const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./utils/path');

const app = express();

// first parameter's value determine the file format in /views and app.set()'s 2nd parameter
app.engine(
  'hbs',
  expressHbs({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs', // need to set this for the layout file
  })
);

app.set('view engine', 'hbs');
app.set('views', 'views');

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property
app.use(bodyParser.urlencoded({ extended: true }));

// serves static files such as css, image, js files that we allow users to access them in the frontend
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use('/', (req, res, next) => {
  // .send() or sendFile() must be last
  // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
  res.render('404');
});

const port = 3000;
// app.listen does 2 things, createServer and listen
app.listen(port);
