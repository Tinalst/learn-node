const redis = require('redis');
const bcrypt = require('bcrypt');

// 建立连接
const db = redis.createClient();

class User {
    constructor(obj){
        for(let key in obj){
            this[key] = obj[key];
        }
    }


    update(cb){
        const id = this.id;
        db.set(`user:id:${this.name}`, id, err => {
            if(err) return cb(err);
            db.hmset(`user:${id}`, this, err => {
                cb(err);
            })
        })
    }

    save(cb){
        if(this.id){
            this.update(cb)
        } else {
            db.incr('user:ids', (err, id) => {
                if(err) return cb(err);
                this.id = id;
                this.hashPassword(err => {
                    if(err) return cb(err);
                    this.update(cb);
                })
            })
        }
    }

    /**
     * hash加密，有效对抗彩虹表攻击
     * @param cb
     */
    hashPassword(cb){
        // 生成12字符串的salt,
        bcrypt.genSalt(12, (err, salt)=> {
            if(err) return cb(err);
            console.log('this.pass', this.pass);
            console.log('salt', salt);
            this.salt = salt;
            // 加密处理
            bcrypt.hash(this.pass, salt, (err, hash) => {
                if(err) return cb(err);
                this.pass = hash;
                cb();
            })
        })

    }

    // 获取账号id
    static getId(name, cb){
        db.get(`user:id:${name}`, cb);
    }

    // 获取普通对象id， 讲普通对象转换成新的user对象
    static get(id, cb){
        db.hgetall(`user:${id}`, (err, user)=>{
            if(err) return cb(err);
            cb(null, new User(user));
        })
    }

    // 根据用户名查找id
    static getByName(name, cb){
        User.getId(name, (err, id) => {
            if(err) return cb(err);
            User.get(id, cb);
        })
    }

    // 用户认证
    static  authenticate(name, pass, cb) {
        User.getByName(name, (err, user)=>{
            if(err) console.log(err);
            console.log(user);
            bcrypt.hash(pass, user.salt, (err, hash) => {
                if(err) return cb(err);
                if(hash === user.pass){
                    return cb(null, user);
                }
                cb();
            })
        });
    }


}

// for test
// const user = new User({
//     name: 'tina',
//     pass: 'test'
// });
//
// user.save(err => {
//    if(err) console.log(err);
//    console.log('user id %d', user.id);
// });

// User.getByName('tina', (err, user)=>{
//    if(err) console.log(err);
//    console.log(user);
// });

User.authenticate('tina', 'test', (err, user) => {
    if(err) return console.log(err);

    if(user){
        console.log('user', user);
    } else {
        console.log('不存在的用户');
    }
});
