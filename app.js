const http = require('http');

const { requestHandler } = require('./vanillaNodeJsRoutes/routes');

const express = require('express');

const app = express();

// use middleware
app.use((req, res, next) => {
  console.log('hello from middleware');

  // use next to go to the next middleware
  next();
});

app.use((req, res, next) => {
  console.log('hello from 2nd middleware');
  res.send('<h1>Hello from Express!</h1>');
});

const port = 3000;

// app.listen does 2 things, createServer and listen
app.listen(port);
