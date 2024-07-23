const http = require('http');
const fs = require('fs');
const path = require('path');

const getRandomInt = max => Math.floor(Math.random() * max);
let data;

function sse(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  let id = 0;
  const interval = setInterval(() => {
    data = getRandomInt(111);
    if (data !== undefined && data !== "") {
      res.write(`data: ${data}\n`);
      res.write(`id: ${++id} \n`);
      res.write('\n');
    }
  }, 3000);
  
  setTimeout(() => {
    clearInterval(interval);
    res.write('event: end-of-stream\n');
    res.write('data: this is the end\n');
    res.write('\n');
    res.end();
  }, 15000);
}

http.createServer((req, res) => {
  const url = new URL(`http://${req.headers.host}${req.url}`);
  
  if (url.pathname === '/stream') {
    sse(req, res);
    return;
  }
  
  if (url.pathname === '/send-message') {
    data = url.searchParams.get('message');
    res.end(data);
    return;
  }
  
  const fileStream = fs.createReadStream(path.join(__dirname, 'index.html'));
  fileStream.pipe(res);
}).listen(8080, () => {
  console.log('server started on the 8080 port');
})
