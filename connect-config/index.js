const connect = require('connect');

function setup(format) {
    const regexp = /:(\w+)/g;

    return function createlogger(req, res, next) {
        const str = format.replace(regexp, (match, property)=>{
            console.log('match', match);
            console.log('property', property);
            return req[property];
        })
        console.log('str', str);
        next()
    }
}

function hello(req, res) {
    res.setHeader('Content-type', 'text/plain');
    res.end('hello world');
}

const app = connect()
            .use(setup(':method:url'))
            .use(hello)
            .listen(3000);


