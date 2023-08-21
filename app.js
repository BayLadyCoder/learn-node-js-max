const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const rootDir = require('./utils/path');

const app = express();

app.set('view engine', 'ejs');
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
  res
    .status(404)
    .render('404', { pageTitle: 'Page Not Found', path: undefined });
});

const port = 3000;
// app.listen does 2 things, createServer and listen
app.listen(port);
