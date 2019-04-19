class Todo {
    constructor(){
        this.todos = [];
    }

    // 添加代办事件
    add(item){
        if(!item) throw new Error('todo.propertype.add require an item');
        this.todos.push(item);
    }

    // 删除所有代办事件
    deleteAll(){
        this.todos = [];
    }

    // 取得代办事件数量
    getCount(){
        return this.todos.length;
    }

    // 两秒后带着true调用回调
    doAsync(cb){
        setTimeout(cb, 2000, true);
    }
}

module.exports = Todo;
