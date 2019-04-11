const net = require('net');

const server = net.createServer( c => { // 当有客户端连接的时候
  console.log('c',c);

  // 响应重复性事件
  c.on('data', data => { // 监听套接字传输数据
      c.write(data)
    })

  // 响应只发生一次的事件
  // c.once('data', data => { // 监听套接字传输数据
  //     c.write(data)
  // })

}).listen(8888);

