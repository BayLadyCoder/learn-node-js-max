const express = require('express');

const app = express();

// use middleware
app.use('/add-product', (req, res, next) => {
  console.log('hello from 2nd middleware');
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title" /><button type="submit">Submit</button></form>'
  );
  // we don't use next because we already send response, don't need to send two response
  // use next to go to the next middleware
  // next();
});

app.use('/product', (req, res, next) => {
  console.log('/product', { body: req.body });
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  console.log('hello from middleware');
  res.send('<h1>Hello from Express!</h1>');
});

const port = 3000;
// app.listen does 2 things, createServer and listen
app.listen(port);
