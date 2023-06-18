const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Parse incoming request bodies in a middleware before your handlers,
// available under the req.body property
app.use(bodyParser.urlencoded({ extended: true }));

// use middleware
app.use('/add-product', (req, res, next) => {
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title" /><button type="submit">Submit</button></form>'
  );
  // we don't use next because we already send response, don't need to send two response
  // use next to go to the next middleware
  // next();
});

app.post('/product', (req, res, next) => {
  console.log('/product', { body: req.body });
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello from Express!</h1>');
});

const port = 3000;
// app.listen does 2 things, createServer and listen
app.listen(port);
