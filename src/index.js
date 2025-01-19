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
    // it is not necessary to load all projects at once but i already started doing it this way so eh, ideally i would get the currentProject from local storage
    constructor() {
        this.projects = [];
        this.currentProject = null;
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
        this.currentProject = this.getProjects()[0];
    }
}

class HTMLHandler {
    // need to be able to move elements around, delete them, edit them, all whilst said elements are saved correctly...
    // easiest way would be give each dom element a uuid and just find that specific element via data-id but thats annoying

    static loadProjectsList = ()=>{
        let main = document.querySelector("main");
        main.innerHTML = "";
        /*
        document.addEventListener("click", (event)=>{
            const projects = LocalStorageHandler.getProjects();
            const project = projects.currentProject;
            if (event.target.classList.contains("project")) {
                HTMLHandler.createProject(project);
            }
        });
        */
    }

    static addLabelToElement = (element)=>{
        const labelElement = document.createElement("div");
        labelElement.classList.add("label");
        element.appendChild(labelElement);
    }


    static createTodoElement = (todo)=>{
        const todoElement = document.createElement("div");
        todoElement.classList.add("todo");
        return todoElement;
    }

    static createTodosContainer = ()=>{
        const todosContainer = document.getElementById("todos");
        todosContainer.classList.add("todos");
        return todosContainer;
    }

    static createTodos = (todos) => {
        const todosContainer = this.createTodosContainer();
        todos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todosContainer.appendChild(todoElement);
        });
    }


    // need to be able to move todo lists around so move in array save to storage, never worry abt updating page at all cuz we working with either new elements or existing ones.
    static updateTodoLists = (todoLists, projectElement) => {
        const todoListsContainer = projectElement.querySelector("div.todo-lists");
        todoListsContainer.innerHTML = "";
        todoLists.forEach(todoList => {
            const todoListElement = this.createTodoListElement(todoList);
            todoListsContainer.appendChild(todoListElement);
        });
    }

    static createTodoListElement = (todoList) => {
        const todoListElement = document.createElement("div");
        todoListElement.classList.add("todo-list");
        this.addLabelToElement(todoListElement);
        return todoListElement;
    }

    static createTodoListsContainer = ()=>{
        const todoListsContainer = document.createElement("div");
        todoListsContainer.classList.add("todo-lists");
        return todoListsContainer;
    }

    static createTodoLists = (todoLists, projectElement) => {
        const todoListsContainer = this.createTodoListsContainer();
        
        todoLists.forEach(todoList => {
            const todoListElement = this.createTodoListElement(todoList);
            todoListsContainer.appendChild(todoListElement);
        });

        projectElement.appendChild(todoListsContainer);
    }


    static createProjectElement = (project)=>{
        const projectElement = document.createElement("div");
        projectElement.classList.add("project");

        this.addLabelToElement(projectElement);
        return projectElement;
    }

    static createProject = (project) => {
        const projectElement = this.createProjectElement(project);

        this.createTodoLists(project.getTodoLists(), projectElement);
        this.updateTodoLists(project.getTodoLists(), projectElement);

        document.body.appendChild(projectElement);
    }

    static destroyExistingProject = () => {
        const existingProject = document.querySelector("div.project");
        if (existingProject) { existingProject.remove(); }
    }
}

class LocalStorageHandler {
    // gets projects object from local or makes new
    static getProjects = ()=>{
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
    const projects = LocalStorageHandler.getProjects();
    console.log("Projects: ");
    console.log(projects);
    HTMLHandler.loadProjectsList();
});