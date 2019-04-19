const fs = require('fs');
const http = require('http');
const ejs = require('ejs');

// 获取文章
function getEntries() {
    let entriesRaw = fs.readFileSync('./entries.txt', 'utf-8');
    entriesRaw = entriesRaw.split('---');
    let entries = [];
    entriesRaw.map(entryRaq => {
        const entry = {};
        let lines = entryRaq.split('\n');
        // 去除数组中值为空的元素
        lines = lines.filter(line => {return line});
        lines.map(line => {
            if(line.indexOf('title:') === 0){
                entry.title = line.replace('title:', '');
            }else if(line.indexOf('date:') === 0) {
                entry.date = line.replace('date:', '');
            }else {
                entry.body = entry.body ? entry.body : '';
                entry.body += line;
            }
        });
        entries.push(entry);
    });
    return entries;
}
const entries = getEntries();
console.log(entries);

// 渲染模板
const templates = fs.readFileSync('./views/blog_page.ejs', 'utf8');
function blogPage(entries) {
    const values = { entries };
    return ejs.render(templates, values);
}


// 链接服务
const server = http.createServer((req, res) => {
    const output = blogPage(entries);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(output);
});
server.listen(8000);

