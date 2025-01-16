class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checked = false;
    }
}

// multiple of these will exist, creatable by user, you can drag todos between them to transfer them around,
class TodoList {
    constructor(label) {
        this.label = label;
        this.todos = [];
    }

    addTodo(todo, idx) {
        if (idx === undefined) {
            this.todos.push(todo);
        } else {
            this.todos.splice(idx, 0, todo);
        }
    }

    removeTodo(todo) {
        const index = this.todos.indexOf(todo);
        if (index !== -1) {
            return this.todos.splice(index, 1);
        }
    }

    getTodos() {
        return this.todos;
    }
}

// grid of todoLists which will be displayed
class Project {
    constructor(label) {
        this.label = label;
        this.todoLists = [];
    }
    
    addTodoList(todoList, idx) {
        if (idx === undefined) {
            this.todoLists.push(todoList);
        } else {
            this.todoLists.splice(idx, 0, todoList);
        }
    }

    removeTodoList(todoList) {
        const index = this.todoLists.indexOf(todoList);
        if (index !== -1) {
            return this.todoLists.splice(index, 1);
        }
    }

    getTodoLists() {
        return this.todoLists;
    }
}

class Projects {
    constructor() {
        this.projects = [];
        this.addDefaultProject();
    }

    getProjects() {
        return this.projects;
    }

    addProject(project, idx) {
        if (idx === undefined) {
            this.projects.push(project);
        } else {
            this.projects.splice(idx, 0, project);
        }
        console.log(`Project added: `);
        console.log(project);
    }

    removeProject(project) {
        const index = this.projects.indexOf(project);
        if (index !== -1) {
            return this.projects.splice(index, 1);
        }
    }

    addDefaultProject(){
        const project = new Project("Default");
        project.addTodoList(new TodoList("Default"));
        project.getTodoLists()[0].addTodo(new Todo("Todo", "Description", "Due Date", "Priority"));
        this.addProject(project);
    }
}

class HTMLHandler {
    constructor() {
    }

    initialize
}

class LocalStorageHandler {
    constructor() {
    }

    // gets projects object from local or makes new
    getProjects = ()=>{
        let projects = localStorage.getItem("projects");
        if (projects) {
            return JSON.parse(projects);
        }
        projects = new Projects();
        if (!projects) { throw new Error("Projects object could not be made"); }
        return projects;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const htmlHandler = new HTMLHandler();
    const localStorageHandler = new LocalStorageHandler();
    const projects = localStorageHandler.getProjects();
    console.log("Projects: ");
    console.log(projects);
});