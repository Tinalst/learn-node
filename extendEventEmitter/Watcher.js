const fs = require('fs');
const events = require('events');

/**
 * 功能： 拓展eventEmitter类，添加处理文件的能力
 * watchDir： 被监听的文件夹路径
 * processedDir： 存放处理结果的文件夹路径
 */

class Watcher extends events.EventEmitter {
    constructor(watchDir, processedDir) {
        super();
        this.watchDir = watchDir;
        this.processedDir = processedDir;
    }

    watch(wachDir){
        fs.readdir(wachDir, (err, files) => {
            if(err) throw err;
            for (let index in files){
                // 发射process事件
                this.emit('process', files[index]);
            }
        })
    }

    // 监听文件夹下的变化
    start(){
        fs.watchFile(this.watchDir, _ => {
            this.watch(this.watchDir);
        })
    }
}

module.exports = Watcher;
