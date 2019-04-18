const redis = require('redis');

const db = redis.createClient(); // 创建redis客户端实例
class Entry {
    constructor(obj){
        for (let key in obj){
            this[key] = obj[key];
        }
    }

    // 保存数据到数据库中
    save(cb) {
        console.log('this', this);
        const entryJson = JSON.stringify(this);
        db.lpush('entries', entryJson, err => {
            if(err) return cb(err);
            cb();
        })
    }

    // 获取一定范围的数据
    static getRange(from, to, cb){
        db.lrange('entries', from, to, (err, items) => {
            if(err) return cb(err);
            let entries = [];
            items.forEach(item => {
                entries.push(JSON.parse(item));
            });
            cb(null, entries);
        })
    }
}

module.exports = Entry;
