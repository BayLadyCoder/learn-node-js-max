const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property
app.use(bodyParser.urlencoded({ extended: true }));

app.use(adminRoutes);
app.use(shopRoutes);

const port = 3000;
// app.listen does 2 things, createServer and listen
app.listen(port);
