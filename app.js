const http = require('http');

const { requestHandler } = require('./vanillaNodeJsRoutes/routes');

const express = require('express');

const app = express();

const server = http.createServer(app);

const port = 3000;
server.listen(port);
