const assert = require('assert');
const Todo = require('./todo');

const todo = new Todo();
let testcompelet = 0;

// 单元测试-删除所有数据
function deletTest() {
    todo.add('11111');
    assert.strictEqual(todo.todos.length, 1);
    todo.deleteAll();
    assert.strictEqual(todo.todos.length, 0);
    testcompelet++;
    console.log(testcompelet);

}
deletTest();

// 单元测试-添加数据
function addTest() {
    todo.deleteAll();
    todo.add('adddd');
    assert.notStrictEqual(todo.getCount(), 0, '1 item shoud exist');
    testcompelet++;
    console.log(testcompelet);
}
addTest();

// 单元测试-异步测试
function doAsyncTest(cb) {
    todo.doAsync(value => {
        assert.ok(value, 'callback should be passed true');
        testcompelet++;
        console.log(testcompelet);
        cb();
    });

}
doAsyncTest(_ => console.log(1111));
