const sqlite3 = require('sqlite3').verbose();


const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName); // 创建一个名字为dbName的数据库，并建立数据库连接


db.serialize(_ => {
  const sql = `CREATE TABLE IF NOT EXISTS articles(id integer primary key, title, content TEXT)`;
  db.run(sql);
});

class Article {
  // 获取所有文章
  static all(cb){
    db.all('SELECT * FROM articles', cb);
  }

  // 获取指定文章
  static find(id, cb){
    console.log(id + '...')
    db.get('SELECT * FROM articles WHERE id = ?', id, cb);
  }

  // 新增文章
  static create(data, cb){
    const sql = 'INSERT INTO articles(title, content) VALUES(?, ?)';
    db.run(sql, data.title, data.content, cb);
  }

  // 删除文章
  static delet(id, cb){
    console.log(id + '...')
    if(!id) {
      return cb(new Error('请输入有效的id'));
    }
    db.run('DELETE FROM articles WHERE id = ?', id, cb);
  }
}

module.exports = db;
module.exports.Articles = Article;