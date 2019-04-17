const connect = require('connect');

function logger(req, res, next) {
    // 获取请求方式和请求路径
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req,res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

connect().use(logger).use(hello).listen(3000);
