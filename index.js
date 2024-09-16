const http = require('http');

const port = process.env.PORT || '8080';

function handleRequest(req, res) {
  res.write('hello world lakjsd3');
  res.end();
}

const server = http.createServer();

server.on('request', handleRequest);

server.listen(port);
