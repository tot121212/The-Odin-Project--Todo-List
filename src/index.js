import "./css-reset.css";
import "./template.css";

import { v4 as uuidv4 } from 'uuid';
import { LocalStorageHandler } from "./local-storage-handler.js";
import { HTMLHandler } from "./html-handler.js";

class Todo {
    constructor(title, description, dueDate, priority) {
        this.uuid = uuidv4();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checked = false;
    }
}

// multiple of these will exist, creatable by user, you can drag todos between them to transfer them around,
class TodoList {
    constructor(name) {
        this.uuid = uuidv4();
        this.name = name;
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
}

// grid of todoLists which will be displayed
class Project {
    constructor(name, desc) {
        this.uuid = uuidv4();
        this.name = name;
        this.description = desc;
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
}

export class Projects {
    // it is not necessary to load all projects at once but i already started doing it this way so eh, ideally i would get the current from local storage
    static init(){
        console.log("Initializing Projects");
        this.list = [];
        this.current = null;
        this.uuidToProject = newMap();
        this.addDefaultProject();
    }

    static addProject(project) {
        this.list.push(project);
        project.uuidToProject.set(project.uuid, project);
        console.log(`Project added: `);
        console.log(project);
    }

    static removeProject(project) {
        const index = this.list.indexOf(project);
        if (index !== -1) {
            return this.list.splice(index, 1);
        }
    }

    static addDefaultProject(){
        const project = new Project("Default", "");
        project.addTodoList(new TodoList("Tasks"));
        project.todoLists[0].addTodo(new Todo("Get milk.", "", "1/24/2025", ""));
        this.addProject(project);
        this.current = this.list[0];
    }

    static getProject(uuid){
        if (this.uuidToProject.has(uuid)){
            return this.uuidToProject.get(uuid);
        }
        else{
            console.error(`Project with uuid ${uuid} not found`);
            return null;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    LocalStorageHandler.loadProjectData();
    console.log("Projects: ");
    console.log(Projects.list);
    
    HTMLHandler.loadProjectsList(Projects);
    
    document.querySelector("nav").addEventListener("click", (e)=>{
        switch (e.target.id){
            case "projects-btn":
                HTMLHandler.clearContent()
                HTMLHandler.loadProjectListToContent(Projects);
                break;
        }
    });
});