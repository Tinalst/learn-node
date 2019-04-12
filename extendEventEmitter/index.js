const Watcher = require('./Watcher');
const fs = require('fs');

const watchDir = './watch';
const processedDir = './done';

const watcher  = new Watcher(watchDir, processedDir);

// 订阅process事件
watcher.on('process', file => {
    const watchFile = `${watchDir}/${file}`;
    const processFile = `${processedDir}/${file.toLowerCase()}`;
    // 通过该变文件的的存放路径，实现文件移动
    fs.rename(watchFile, processFile, err => {
        if (err) throw err;
    })
});

watcher.start();
