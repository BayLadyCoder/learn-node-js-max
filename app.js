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
});

const server = http.createServer(app);

const port = 3000;
server.listen(port);
