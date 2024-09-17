const http = require('node:http');
const fs = require('node:fs');

const port = process.env.PORT || '8080';

function handleRequest(req, res) {
  if (req.url.includes('index.mjs')) {
    res.setHeader('content-type', 'text/javascript');
    const bundle = fs.readFileSync('gas-tracker-frontend/index.mjs');
    res.write(bundle);
    res.end();
    return;
  }

  const frontend = fs.readFileSync('gas-tracker-frontend/index.html');
  res.write(frontend);
  res.end();
}

const server = http.createServer();

server.on('request', handleRequest);

server.listen(port);
