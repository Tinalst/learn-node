const http = require('http');
const port = 8080;

const server = http.createServer((req, res) => {
  res.end('hello word1');
})

server.listen(port, _ => {
  console.log('server listening on: http://locahost:%s', port);
})