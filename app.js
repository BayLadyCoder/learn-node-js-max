const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', (req, res, next) => {
  // .send() or sendFile() must be last
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

const port = 3000;
// app.listen does 2 things, createServer and listen
app.listen(port);
