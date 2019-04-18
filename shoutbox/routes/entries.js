const Entry = require('../models/entry');

// 获取表单页面
exports.form = (req, res) => {
    res.render('post', {title: 'post'});
};

// 监听表单提交按钮
exports.submit = (req, res, next) => {
    console.log(req.body);
    let reqDatas = req.body.entry;
    // if(!reqDatas.title) {
    //     res.status(500).json({error: 'title is requires'});
    //     return;
    // }
    // if(!reqDatas.body){
    //     res.status(500).json({error: 'body is requires'});
    //     return;
    // }
    const user = res.locals.user;
    const userName = user ? user.name : null;
    if(reqDatas.body && reqDatas.title){
        const entry = new Entry({
          username: userName,
          title: reqDatas.title,
          body: reqDatas.body
        });
        entry.save(err => {
          if(err) return next(err);
          res.redirect('/')
        })
    }

};

// 获取消息列表
exports.list = (req, res, next) => {
  Entry.getRange(0, -1, (err, entries) => {
      if(err) return next(err);
      console.log('entries', entries);

      res.render('entries', {
          title: 'Entries',
          entries: entries
      })
  })
};
