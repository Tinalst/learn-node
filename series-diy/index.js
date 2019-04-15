const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');

const configFileName = './ssr.txt';
// 确保包含RSS预定源url列表的文件存在
function checkForRSSFile() {
    fs.access(configFileName, err => {
        if(err){
           return console.log(`${configFileName}文件不存在`)
        }
        console.log(`${configFileName}文件已存在`);
        next(null, configFileName);
    })
}

// 解析文件
function readRSSFile(configFileName) {
    fs.readFile(configFileName, (err, data) => {
        if(err) return  next(err);
        const list = data.toString()
                         .replace(/^\s+|\s+$/g, '')
                         .split('\n');
        console.log(list);
        // 获取随机一个url
        const random = Math.floor(Math.random() * list.length);
        next(null,list[random]);
    })
}

// 请求获取RSS数据
function downloadRSSFedd(url) {
    console.log(url);
    request(url, (err, res, body) => {
        if(err)  throw err;
        if(res.statusCode !== 200) return next(err);
        next(null, body);
    })
}

// 解析请求的数据
function parseRSSFile(rss) {
    const handler = new htmlparser.RssHandler();
    const parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);

    if(!handler.dom.items.length) return next(new Error('no rss items found'));
    const item = handler.dom.items.shift();
    console.log(item);
    console.log('title', item.title);
    console.log('link', item.link);
}

const tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFedd,
    parseRSSFile
];

// 串行执行的函数
function next(err, result) {
    if(err) throw err;
    const currentTask = tasks.shift(); // 删除数组第一个元素并返回当前元素
    if(currentTask){
        currentTask(result);
    }
}

// 开始执行串行任务
next();
