const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  if(req.url == '/'){
    // 获取json文件中的数据
    getTitle(res);
  }
}).listen('8000', '127.0.0.1');

function getTitle(res) {
  fs.readFile('./titleList.json', (err, data) => {
    if(err){
      return
    }
    let list = JSON.parse(data.toString());
    // 获取HTML文件
    getTemplate(list, res);
  })
}

function getTemplate(list, res) {
  fs.readFile('./index.html', (err, data) => {
    if(err) {
      return
    }
    let template = data.toString();
    // 将获取到的标题数据改到模板文件中
    formatHtml(list, template, res);
  })
}

function formatHtml(list, template, res) {
  list.forEach(v => {

  });
  const html = template.replace('%', list.join('</li><li>'));
  // 响应头
  res.writeHead(200, {'Content-type': 'text/html'})
  // 相应结束标志
  res.end(html);
}

function handleErr(err, res){
  console.log('err');
  res.end('Server Error');
}