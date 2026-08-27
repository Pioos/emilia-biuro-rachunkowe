const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 5401;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

http.createServer((req, res) => {
  let requestPath;
  try {
    requestPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  if (requestPath === '/') requestPath = '/index.html';
  if (!path.extname(requestPath)) requestPath += '.html';

  const filePath = path.resolve(root, `.${requestPath}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log(`Preview server on http://localhost:${port}`));
