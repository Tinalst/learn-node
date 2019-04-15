const express = require('express');
const bodyParser = require('body-parser');

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
     res.send(articles);
});

// 添加文章
app.post('/articles', (req, res, next) => {
    console.log('req.body', req.body);
    articles.push({
        title: req.body.title
    });
    res.send(articles);
});

// 获取指定文章
app.get('/articles/:id', (req,res, next) => {
    const id = req.params.id;
    console.log('fetching:', id);
    res.send(articles[id]);
});

// 删除指定文章
app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('deleting :', id);
    delete articles[id];
    res.send('delete succ');
});


app.listen(app.get('port'), _ => {
    console.log(`app started on port: ${app.get('port')}`);
});
