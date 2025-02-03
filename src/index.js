import "./css-reset.css";
import "./template.css";

import { v4 as uuidv4 } from 'uuid';
import { LocalStorageHandler } from "./local-storage-handler.js";
import { HTMLHandler } from "./html-handler.js";

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
        return object;
    }
    catch (e){
        console.log(e.message);
        return null;
    }
}

export class Todo {
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
export class TodoList {
    constructor(name) {
        this.uuid = uuidv4();
        this.name = name;
        this.todos = [];
        this.uuidToTodo = new Map();
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

    static rebuildTodosMap = (todoList)=>{
        todoList.uuidToTodo = new Map();
        todoList.todos.forEach(todo => {
            todoList.uuidToTodo.set(todo.uuid, todo);
        });
    }
}

// grid of todoLists which will be displayed
export class Project {
    constructor(name, desc) {
        this.uuid = uuidv4();
        this.name = name;
        this.description = desc;
        this.todoLists = [];
        this.uuidToTodoList = new Map();
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
    
    static rebuildTodoListsMap = (project)=>{
        project.uuidToTodoList = new Map();
        project.todoLists.forEach(todoList => {
            project.uuidToTodoList.set(todoList.uuid, todoList);
        });
    }
}

export class Projects {
    // it is not necessary to load all projects at once but i already started doing it this way so eh, ideally i would get the current from local storage
    static list = [];
    static current = null; // could just store this as a uuid of a list project
    static uuidToProject = new Map();
}

export class ProjectsMethods{
    // add project to projects
    static addProject(project) {
        Projects.uuidToProject.set(project.uuid, project);
        Projects.list.push(project);
        
        console.log(`Project added: `);
        console.log(project);
    }

    static removeProject(project) {
        Projects.uuidToProject.delete(project.uuid);
        const index = Projects.list.indexOf(project);
        if (index >= 0) {
            return Projects.list.splice(index, 1);
        }
    }

    static getProject(uuid){
        return getObjectFromMapWithUUID(uuid, Projects.uuidToProject);
    }

    static addDefaultProject(){
        const project = new Project("Default", "");
        ProjectMethods.addTodoList(project, new TodoList("Tasks"));
        TodoListMethods.addTodo(project.todoLists[0], new Todo("Get milk.", "", "2025-01-31", "High"));
        ProjectsMethods.addProject(project);
    }

    static rebuildProjectsMap = ()=>{
        Projects.uuidToProject = new Map();
        Projects.list.forEach(project => {
            Projects.uuidToProject.set(project.uuid, project);
        });
    }

    static rebuildAllMaps = ()=>{
        ProjectsMethods.rebuildProjectsMap();
        for (const project of Projects.list){
            ProjectMethods.rebuildTodoListsMap(project);
            for (const todoList of project.todoLists){
                TodoListMethods.rebuildTodosMap(todoList);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    LocalStorageHandler.loadProjectData();
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
