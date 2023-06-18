const { fstat } = require('fs');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Submit</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    console.log({ url, method });

    const body = [];

    // need to have `name` attribute on <input> to trigger req.on('data') callback
    req.on('data', (chunk) => {
      console.log({ chunk });
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      console.log({ message });

      // writeFile asynchronously
      fs.writeFile('message.txt', message, (err) => {
        // redirect to home page after POST message is done
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hellp from my Node.js!</h1></body>');
  res.write('</html>');
  res.end();

  // to quit the server
  // process.exit;
});

const port = 3000;
server.listen(port);
