var createError = require('http-errors'); // 为Express，Koa，Connect等创建HTTP错误。
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var entriesRouter = require('./routes/entries');

var validator = require('./middleware/validator');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 指定查找视图目录
app.set('view engine', 'ejs'); // 指定模板引擎

app.use(logger('dev'));
app.use(express.json()); // 解析请求主体,功能类似bodyparser
app.use(express.urlencoded({ extended: true })); // 解析请求主体，功能类似bodyparser
app.use(cookieParser()); // 解析Cookie标头并使用由cookie名称键入的对象填充req.cookies
app.use(express.static(path.join(__dirname, 'public'))); // 静态资源文件

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/', entriesRouter.list)
app.post('/post',
  validator.required('entry[title]'),
  validator.lengthAbove('entry[title]', 4),
  entriesRouter.submit);
app.get('/get', entriesRouter.form);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
