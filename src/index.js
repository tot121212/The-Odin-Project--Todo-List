console.log("Hello, world!")

class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.checked = false
    }
}

// multiple of these will exist, creatable by user, you can drag todos between them to transfer them around,
class TodoList {
    constructor(label) {
        this.label = label
        this.todos = []
    }

    addTodo(todo, idx) {
        if (idx === undefined) {
            this.todos.push(todo)
        } else {
            this.todos.splice(idx, 0, todo)
        }
    }

    removeTodo(todo) {
        const index = this.todos.indexOf(todo)
        if (index !== -1) {
            return this.todos.splice(index, 1)
        }
    }

    getTodos() {
        return this.todos
    }
}

// grid of todoLists which will be displayed
class Project {
    constructor() {
        this.todoLists = []
    }

    // button at end of todoListGrid will add new lists with a label via prompt or smthn
    createTodoList(label) {
        const todoList = new TodoList(label)
        this.todoLists.push(todoList)
        return todoList
    }
    
    addTodoList(todoList, idx) {
        if (idx === undefined) {
            this.todoLists.push(todoList)
        } else {
            this.todoLists.splice(idx, 0, todoList)
        }
    }

    removeTodoList(todoList) {
        const index = this.todoLists.indexOf(todoList)
        if (index !== -1) {
            return this.todoLists.splice(index, 1)
        }
    }

    getTodoLists() {
        return this.todoLists
    }
}

class HTMLHandler {
    constructor() {
    }
}