const http = require('http');
const { requestHandler } = require('./routes');

const server = http.createServer(requestHandler);

const port = 3000;
server.listen(port);
