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

export class TodoListMethods {
    static addTodo(todoList, todo, idx) {
        todoList.uuidToTodo.set(todo.uuid, todo);
        if (idx === undefined) {
            todoList.todos.push(todo);
        } else {
            todoList.todos.splice(idx, 0, todo);
        }
    }

    static removeTodo(todoList, todo) {
        todoList.uuidToTodo.delete(uuid);
        const index = todoList.todos.indexOf(todo);
        if (index >= 0) {
            return todoList.todos.splice(index, 1);
        }
    }

    static getTodo(todoList, uuid){
        return getObjectFromMapWithUUID(uuid, todoList.uuidToTodo);
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
}

export class ProjectMethods {
    static addTodoList(project, todoList, idx) {
        project.uuidToTodoList.set(todoList.uuid, todoList);
        if (idx === undefined) {
            project.todoLists.push(todoList);
        } else {
            project.todoLists.splice(idx, 0, todoList);
        }
    }

    static removeTodoList(project, todoList) {
        project.uuidToTodoList.delete(uuid);
        const index = project.todoLists.indexOf(todoList);
        if (index >= 0) {
            return project.todoLists.splice(index, 1);
        }
    }

    static getTodoList(project, uuid){
        return getObjectFromMapWithUUID(uuid, project.uuidToTodoList);
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
}

export class ProjectsMethods{
    static addProject(projects, project) {
        projects.uuidToProject.set(project.uuid, project);
        projects.list.push(project);
        
        console.log(`Project added: `);
        console.log(project);
    }

    static removeProject(projects, project) {
        projects.uuidToProject.delete(project.uuid);
        const index = projects.list.indexOf(project);
        if (index >= 0) {
            return projects.list.splice(index, 1);
        }
    }

    static getProject(projects, uuid){
        return getObjectFromMapWithUUID(uuid, projects.uuidToProject);
    }

    static addDefaultProject(projects){
        const project = new Project("Default", "");
        ProjectMethods.addTodoList(project, new TodoList("Tasks"));
        TodoListMethods.addTodo(project.todoLists[0], new Todo("Get milk.", "", "1/24/2025", ""));
        ProjectsMethods.addProject(projects, project);
    }
}

export class Projects {
    // it is not necessary to load all projects at once but i already started doing it this way so eh, ideally i would get the current from local storage
    constructor(){
        this.list = [];
        this.current = null;
        this.uuidToProject = new Map();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const projects = new Projects();
    let loadResult = LocalStorageHandler.loadProjectData(projects);
    if (loadResult === false){
        ProjectsMethods.addDefaultProject(projects);
    } else if (loadResult !== true){
        console.error("Error loading projects");
        return;
    }
    console.log("Projects: ");
    console.log(projects.list);
    
    HTMLHandler.loadProjectListToContent(projects);
    
    document.querySelector("nav").addEventListener("click", (e)=>{
        switch (e.target.id){
            case "projects-btn":
                HTMLHandler.clearContent()
                HTMLHandler.loadProjectListToContent(projects);
                break;
        }
    });
});