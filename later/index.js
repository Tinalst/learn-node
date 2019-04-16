const express = require('express');
const bodyParser = require('body-parser');
const Articles = require('./db').Articles;
const readability = require('node-readability');

const app = express();

// const port = process.env.PORT || 3000;
app.set('port', process.env.PORT || 3000);

const articles  = [{
     title: 'example'
}];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json
app.use(bodyParser.json());


//========= 添加路由处理器
// 获取所有文章
app.get('/articles', (req, res, next) => {
    Articles.all((err, articles) => {
        if(err) return next(err);
        res.format({
            html: _ => {
                res.render('articles.ejs', {articles: articles})
            },
            json: _ => {
                res.send(articles)
            }
        })
    });
});

// 添加文章
app.post('/articles', (req, res, next) => {
    console.log('req.body.url', req.body.url); // 请求参数
    const url = req.body.url;
    // 把网页转换成简化版的阅读视图
    readability(url, (err, result) => {
        console.log(err);
        if (err) return next(err);
        Articles.create(result, (err, articles) => {
            res.send(`${result.title}添加进数据库成功`);
        })
    })
});

// 获取指定文章
app.get('/articles/:id', (req,res, next) => {
    const id = req.params.id;
    Articles.find(id, (err, article)=> {
       if(err) return next(err);
       res.send(article);
    });
});

// 删除指定文章
app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Articles.delet(id, (err, result) => {
        if(err) return next(err);
        res.send({msg: 'oks'});
    });
});


app.listen(app.get('port'), _ => {
    console.log(`app started on port: ${app.get('port')}`);
});

module.exports = app;
