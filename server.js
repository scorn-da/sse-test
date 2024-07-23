const http = require('http');
const fs = require('fs');
const path = require('path');

const getRandomInt = max => Math.floor(Math.random() * max);

function sse(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  let id = 0;
  let data;
  
  setInterval(() => {
    data = getRandomInt(111);
    res.write(`data: Dmitriy's ${data}\n`);
    res.write(`last succeed message id: ${++id} \n`);
    res.write('\n');
  }, 1000)
}

http.createServer((req, res) => {
  const url = new URL(`http://${req.headers.host}${req.url}`);
  
  if (url.pathname === '/stream') {
    sse(req, res);
    return;
  }
  
  const fileStream = fs.createReadStream(path.join(__dirname, 'index.html'));
  fileStream.pipe(res);
}).listen(8080, () => {
  console.log('server started on the 8080 port')
})
