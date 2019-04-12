const events = require('events');
const net = require('net');

const channel = new events.EventEmitter();
channel.clients = {};
channel.subscription = {};
let count = 0;

channel.on('join', function(id, client, data = '') { // 订阅事件
    console.log('join id number : \n', id)
    console.log('id says: \n', data.toString())

    this.clients[id] = client;
    this.subscription[id] = (senderId, message) => {
        count ++;
        console.log('count number ： id \n', `${count}: ${senderId}`);

        if(id !== senderId) {
           this.clients[id].write(`${id}says: ${message}`);
        }
    };
    // 监听广播事件
    this.on('broadcast', this.subscription[id]);
    // 监听客户端断开事件
    this.on('leave', id => {
        // 移除离开的客户端的广播事件
        channel.removeListener('broadcast', this.subscription[id]);
        // 通知其他在线客户端,当前客户端已离开聊天室
        channel.emit('broadcast', id, 'i have been left chatroom.')
    });
    // 关闭所有聊天服务
    this.on('shutdown', _ => {
        channel.emit('broadcast', '', 'the server has shut down');
        channel.removeAllListeners('broadcast');
    })
});

const server = net.createServer(client => {  // socket class
    const id = `${client.remoteAddress}:${client.remotePort}`;
    console.log('server-id', id);
    // 客户端【接入】，发射事件
    channel.emit('join', id, client);
    //【监听】客户端【输入】
    client.on('data', data => {
        if(data.toString() === 'shutdown\r\n'){
            channel.emit('shutdown');
        }
        // 客户端输入，发射【广播】事件
        channel.emit('broadcast', id, data);
    });
    //【监听】客户端【关闭】事件
    client.on('close', _ => {
        // 客户端关闭，发射【离开】事件
        channel.emit('leave', id);
    })
});

server.listen(8888)

