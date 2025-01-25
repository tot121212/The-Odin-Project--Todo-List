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

const getObjectFromMapWithUUID = (uuid, map)=>{
    try {
        if (!map.has(uuid)){
            throw new Error(`Map does not have UUID`);
        }
        const object = map.get(uuid);
        if (typeof object !== "object"){
            throw new Error(`Object not found in map`);
        }
        //console.log(`Object of: map, uuid, found: `);
        //console.log(map);
        //console.log(uuid);
        console.log(object);
        return object;
    }
    catch (e){
        console.log(e.message);
        return null;
    }
}

// multiple of these will exist, creatable by user, you can drag todos between them to transfer them around,
class TodoList {
    constructor(name) {
        this.uuid = uuidv4();
        this.name = name;
        this.todos = [];
        this.uuidToTodo = new Map();
    }

    addTodo(todo, idx) {
        this.uuidToTodo.set(todo.uuid, todo);
        if (idx === undefined) {
            this.todos.push(todo);
        } else {
            this.todos.splice(idx, 0, todo);
        }
    }

    removeTodo(todo) {
        this.uuidToTodo.delete(uuid);
        const index = this.todos.indexOf(todo);
        if (index >= 0) {
            return this.todos.splice(index, 1);
        }
    }

    getTodo(uuid){
        return getObjectFromMapWithUUID(uuid, this.uuidToTodo);
    }
}

// grid of todoLists which will be displayed
class Project {
    constructor(name, desc) {
        this.uuid = uuidv4();
        this.name = name;
        this.description = desc;
        this.todoLists = [];
        this.uuidToTodoList = new Map();
    }

    addTodoList(todoList, idx) {
        this.uuidToTodoList.set(todoList.uuid, todoList);
        if (idx === undefined) {
            this.todoLists.push(todoList);
        } else {
            this.todoLists.splice(idx, 0, todoList);
        }
    }

    removeTodoList(todoList) {
        this.uuidToTodoList.delete(uuid);
        const index = this.todoLists.indexOf(todoList);
        if (index >= 0) {
            return this.todoLists.splice(index, 1);
        }
    }

    getTodoList(uuid){
        return getObjectFromMapWithUUID(uuid, this.uuidToTodoList);
    }
}

export class Projects {
    // it is not necessary to load all projects at once but i already started doing it this way so eh, ideally i would get the current from local storage
    static init(){
        console.log("Initializing Projects");
        this.list = [];
        this.current = null;
        this.uuidToProject = new Map();
        this.addDefaultProject();
    }

    static addProject(project) {
        this.uuidToProject.set(project.uuid, project);
        this.list.push(project);
        
        console.log(`Project added: `);
        console.log(project);
    }

    static removeProject(project) {
        this.uuidToProject.delete(project.uuid);
        const index = this.list.indexOf(project);
        if (index >= 0) {
            return this.list.splice(index, 1);
        }
    }

    static getProject(uuid){
        return getObjectFromMapWithUUID(uuid, this.uuidToProject);
    }

    static addDefaultProject(){
        const project = new Project("Default", "");
        project.addTodoList(new TodoList("Tasks"));
        project.todoLists[0].addTodo(new Todo("Get milk.", "", "1/24/2025", ""));
        this.addProject(project);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    LocalStorageHandler.loadProjectData();
    console.log("Projects: ");
    console.log(Projects.list);
    
    HTMLHandler.loadProjectListToContent();
    
    document.querySelector("nav").addEventListener("click", (e)=>{
        switch (e.target.id){
            case "projects-btn":
                HTMLHandler.clearContent()
                HTMLHandler.loadProjectListToContent();
                break;
        }
    });
});