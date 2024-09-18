const http = require('node:http');
const fs = require('node:fs');

const port = process.env.PORT || '8080';

function handleRequest(req, res) {
  console.log(req.url);

  if (req.url.includes('favicon.ico')) {
    res.setHeader('content-type', 'image/png')
    const gasCanData = fs.readFileSync('gas-tracker-frontend-dist/gascan.png')
    res.write(gasCanData);
    res.end();
    return;
  }

  if (req.url.includes('gas-data-lib.js')) {
    res.setHeader('content-type', 'text/javascript');
    const bundle = fs.readFileSync('gas-tracker-frontend-dist/gas-data-lib.js');
    res.write(bundle);
    res.end();
    return;
  }

  res.setHeader('content-type', 'text/html');
  const frontend = fs.readFileSync('gas-tracker-frontend-dist/index.html');
  res.write(frontend);
  res.end();
}

const server = http.createServer();

server.on('request', handleRequest);

server.listen(port);
