import { Projects, Project, TodoList, Todo } from "./index.js";
import { ProjectsMethods, ProjectMethods, TodoListMethods } from "./index.js";

import { LocalStorageHandler } from "./local-storage-handler.js";
import editTodoIMG from "./media/angle-right.svg";
import submitTodoIMG from "./media/check.svg";
import cancelTodoIMG from "./media/cross.svg";
import addTodoIMG from "./media/multiple.svg";
import unfilledCircleIMG from "./media/circle-dashed.svg";
import filledCircleIMG from "./media/circle.svg";

// DAMN YOU JAVASCRIPT *SHAKES FIST*, shouldve just used sql but :shrug:
export class HTMLHandler {
    // need to be able to move elements around, delete them, edit them, all whilst said elements are saved correctly...
    // easiest way would be give each dom element a uuid and just find that specific element via data-id but thats annoying
    /*
    static loadProjectsList = ()=>{
        let main = document.querySelector("main");
        main.innerHTML = "";
        
        document.addEventListener("click", (event)=>{
            const projects = LocalStorageHandler.getProjects();
            const project = projects.currentProject;
            if (event.target.classList.contains("project")) {
                this.createProject(project);
            }
        });
        
    }
    */

    static getTodoFromTodoElement(todoElement){
        try {
            let todo;

            const projectElement = todoElement.closest(".project");
            const projectUUID = projectElement.dataset.uuid;
            const project = ProjectsMethods.getProject(projectUUID);
            console.log("Project of todo: ", project);
            if (!(project.hasOwnProperty("uuid"))){
                throw new Error("Project not found");
            }
    
            const todoListElement = todoElement.closest(".todo-list");
            const todoListUUID = todoListElement.dataset.uuid;
            const todoList = ProjectMethods.getTodoList(project, todoListUUID);
            console.log("todoList of todo: ", todoList);
            if (!(todoList instanceof TodoList)){
                throw new Error("TodoList not found");
            }
            
            const todoUUID = todoElement.dataset.uuid;
            todo = TodoListMethods.getTodo(todoList, todoUUID);
            console.log("todo: ", todo);
            if (!(todo instanceof Todo)){
                throw new Error("Todo not found");
            }

            return todo;
        } catch (error) {
            console.error(error);
        }
    }

    static getTodoListFromTodoElement(todoElement){
        try {
            let todoList;

            const projectElement = todoElement.closest(".project");
            const projectUUID = projectElement.dataset.uuid;
            const project = ProjectsMethods.getProject(projectUUID);
            console.log("Project of todo: ", project);
            if (!(project.hasOwnProperty("uuid"))){
                throw new Error("Project not found");
            }
    
            const todoListElement = todoElement.closest(".todo-list");
            const todoListUUID = todoListElement.dataset.uuid;
            todoList = ProjectMethods.getTodoList(project, todoListUUID);
            console.log("todoList of todo: ", todoList);
            if (!(todoList instanceof TodoList)){
                throw new Error("TodoList not found");
            }

            return todoList;
            
        } catch (error) {
            console.error(error);
        }
    }

    static getTodoListFromTodoListElement(todoListElement){
        try {
            let todoList;

            const projectElement = todoListElement.closest(".project");
            const projectUUID = projectElement.dataset.uuid;
            const project = ProjectsMethods.getProject(projectUUID);
            console.log("Project of todo: ", project);
            if (!(project.hasOwnProperty("uuid"))){
                throw new Error("Project not found");
            }

            const todoListUUID = todoListElement.dataset.uuid;
            todoList = ProjectMethods.getTodoList(project, todoListUUID);
            console.log("todoList of todo: ", todoList);
            if (!(todoList instanceof TodoList)){
                throw new Error("TodoList not found");
            }

            return todoList;

        } catch (error) {
            console.error(error);
        }
    }

    static clearContent = ()=>{
        document.querySelector(".content").innerHTML = "";
    }

    // creates html element for todo
    static createTodoElement = (todo)=>{
        const todoElement = document.createElement("div");
        todoElement.classList.add("todo");
        todoElement.dataset.uuid = todo.uuid;

        todoElement.innerHTML = `
        <header class="todo-title">Empty Todo</header>
        <main class="todo-desc"></main>
        <div class="todo-due-date"></div>
        <div class="todo-priority"></div>
        <div class="todo-checked"></div>
        `;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        todoElement.append(buttonContainer);

        const deleteButton = this.createDeleteButton();
        buttonContainer.append(deleteButton);

        const editButton = this.createEditButton();
        buttonContainer.append(editButton);

        return todoElement;
    }

    static createCheckedCircleElement = ()=>{
        const object = document.createElement("object");
        object.data = filledCircleIMG;
        object.type = "image/svg+xml";
        object.alt = "Checked";

        const div = document.createElement("div");
        div.append(object);
        div.classList.add("logo");
        return div;
    }

    static createUncheckedCircleElement = ()=>{
        const object = document.createElement("object");
        object.data = unfilledCircleIMG;
        object.type = "image/svg+xml";
        object.alt = "Unchecked";

        const div = document.createElement("div");
        div.append(object);
        div.classList.add("logo");
        return div;
    }

    // updates todoElement with todo data
    static updateTodoElement = (todo, todoElement)=>{
        const todoTitleElement = todoElement.querySelector(".todo-title");
        todoTitleElement.textContent = todo.title;
        
        const todoDescElement = todoElement.querySelector(".todo-desc");
        todoDescElement.textContent = todo.description;

        const todoDueDateElement = todoElement.querySelector(".todo-due-date");
        todoDueDateElement.textContent = todo.dueDate;

        const todoPriority = todoElement.querySelector(".todo-priority");
        todoPriority.textContent = todo.priority;

        const todoChecked = todoElement.querySelector(".todo-checked");
        todoChecked.innerHTML = "";
        const circleElement = todo.checked ? HTMLHandler.createCheckedCircleElement() : HTMLHandler.createUncheckedCircleElement();
        todoChecked.append(circleElement);
    }

    static createEditButton = ()=>{
        const button = document.createElement("button");
        button.classList.add("grabbable");
        button.classList.add("logo");
        button.classList.add("edit-button");
        button.type = "button";

        const object = document.createElement("object");
        object.data = editTodoIMG;
        object.type = "image/svg+xml";
        object.alt = "Edit";
        button.append(object);

        return button;
    }

    static createCancelButton = ()=>{
        const button = document.createElement("button");
        button.classList.add("grabbable");
        button.classList.add("logo");
        button.classList.add("cancel-button");
        button.type = "button";

        const object = document.createElement("object");
        object.data = cancelTodoIMG;
        object.type = "image/svg+xml";
        object.alt = "Cancel";
        button.append(object);

        return button;
    }
    
    static createDeleteButton = ()=>{
        const button = document.createElement("button");
        button.classList.add("grabbable");
        button.classList.add("logo");
        button.classList.add("delete-button");
        button.type = "button";

        const object = document.createElement("object");
        object.data = cancelTodoIMG;
        object.type = "image/svg+xml";
        object.alt = "Delete";
        button.append(object);

        return button;
    }

    static createSubmitButton = ()=>{
        const button = document.createElement("button");
        button.classList.add("grabbable");
        button.classList.add("logo");
        button.classList.add("submit-button");
        button.type = "submit";

        const object = document.createElement("object");
        object.data = submitTodoIMG;
        object.type = "image/svg+xml";
        object.alt = "Submit";
        button.append(object);

        return button;
    }

    static createAddButton = ()=>{
        const button = document.createElement("button");
        button.classList.add("grabbable");
        button.classList.add("logo");
        button.classList.add("add-button");
        button.type = "button";

        const object = document.createElement("object");
        object.data = addTodoIMG;
        object.type = "image/svg+xml";
        object.alt = "Add";
        button.append(object);

        return button;
    }

    static onAddTodoToTodoList = (e)=>{
        const todoListElement = e.target.closest(".todo-list");
        const todoList = HTMLHandler.getTodoListFromTodoListElement(todoListElement);

        const todo = new Todo("Empty Todo", "", "0/00/0000", "Normal");
        TodoListMethods.addTodo(todoList, todo);
        
        const todoElement = this.createTodoElement(todo);
        todoListElement.append(todoElement);

        LocalStorageHandler.saveProjectData();
    }

    // list element that contains todos
    static createTodoListElement = (todoList) => {
        const todoListElement = document.createElement("div");
        todoListElement.classList.add("todo-list");
        todoListElement.dataset.uuid = todoList.uuid;
        
        const todoListHeader = document.createElement("header");
        todoListElement.append(todoListHeader);

        const todoListNameElement = document.createElement("div");
        todoListNameElement.classList.add("todo-list-name");
        todoListHeader.append(todoListNameElement);

        const addTodoButton = this.createAddButton();
        todoListHeader.append(addTodoButton);
        addTodoButton.addEventListener("click", HTMLHandler.onAddTodoToTodoList);

        todoList.todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            todoListElement.append(todoElement);
        });

        return todoListElement;
    }

    // update name of todoListElement with info from todo
    static updateTodoListElement = (todoList, todoListElement) => {
        const todoListNameElement = todoListElement.querySelector(".todo-list-name");
        todoListNameElement.textContent = todoList.name;

        todoListElement.querySelectorAll(".todo").forEach(
            (todoElement, index) => {
                this.updateTodoElement(todoList.todos[index], todoElement);
        });
    }

    // container for the lists themselves
    static createTodoListsElement = (todoLists) => {
        const todoListsElement = document.createElement("div");
        todoListsElement.classList.add("todo-lists");
        
        todoLists.forEach(todoList => {
            const todoListElement = this.createTodoListElement(todoList);
            todoListsElement.append(todoListElement);
        });

        return todoListsElement;
    }

    static updateTodoListsElement = (todoLists, todoListsElement) => {
        todoListsElement.querySelectorAll(".todo-list").forEach(
            (todoListElement, index) => {
                this.updateTodoListElement(todoLists[index], todoListElement);
        });
    }

    static createProjectElement = (project)=>{
        const projectElement = document.createElement("div");
        projectElement.classList.add("project");
        projectElement.dataset.uuid = project.uuid;

        const projectNameElement =  document.createElement("header");
        projectNameElement.classList.add("project-name");
        projectNameElement.textContent = project.name;
        projectElement.append(projectNameElement);

        const projectDescElement = document.createElement("main");
        projectDescElement.classList.add("project-desc");
        projectDescElement.textContent = project.description;
        projectElement.append(projectDescElement);

        return projectElement;
    }

    static updateProjectElement = (project, projectElement)=>{
        projectElement.querySelector(".project-name").textContent = project.name;
    }

    static destroyExistingProject = () => {
        const existingProject = document.querySelector(".project");
        if (existingProject) { existingProject.remove(); }
    }

    static projectElementListenForClicks = (projectElement)=>{
        projectElement.addEventListener("click", (e)=>{
            if (e.target.classList.contains("edit-button")){
                const newModal = this.Modal.createFromEvent(e);
                document.body.append(newModal);
            }
            if (e.target.classList.contains("delete-button")){
                console.log("Todo Delete Button Pressed");
                const todoElement = e.target.closest(".todo");
                console.log("Todo Element:", todoElement);
                const todo = HTMLHandler.getTodoFromTodoElement(todoElement);
                if (!(todo instanceof Todo)){
                    throw new Error("Todo not found");
                }
                // delete todo
                // go into todolist of todo and call remove todo func
                const todoList = HTMLHandler.getTodoListFromTodoElement(todoElement);
                if (!(todoList instanceof TodoList)){
                    throw new Error("Todolist not found");
                }
                TodoListMethods.removeTodo(todoList, todo);

                LocalStorageHandler.saveProjectData();
                // remove todo element from page
                todoElement.remove();
            }
        });
    }

    static loadProjectToContent = (project)=>{
        const projectElement = this.createProjectElement(project);
        const todoListsElement = this.createTodoListsElement(project.todoLists, projectElement);
        projectElement.append(todoListsElement);

        this.updateProjectElement(project, projectElement);
        this.updateTodoListsElement(project.todoLists, projectElement.querySelector(".todo-lists"));

        document.querySelector(".content").append(projectElement);

        this.projectElementListenForClicks(projectElement);
    }

    static loadProjectListToContent = ()=>{
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("projects-container");
        document.querySelector(".content").append(projectContainer);

        for (const project of Projects.list){
            const projectElement = this.createProjectElement(project);
            projectElement.classList.add("grabbable", "grabbable-blue-border");
            projectContainer.append(projectElement);
        }
    
        projectContainer.addEventListener("click", (e)=>{
            if (e.target.classList.contains("project")){
                let project = Projects.uuidToProject.get(e.target.dataset.uuid);
                // couldve done a map of the project keys but too late, this is where im staring to learn more and more that planning is super important
                if (project){
                    this.clearContent();
                    this.loadProjectToContent(project);
                }
            }
        });
    }

    // want to restructure everything like this bc i didnt realize you can make classes within classes in js like this until now...

    // do we want to replace the modal itself or the data within......
    // bc when we delete elements it removes the listener it is useful to do it that way but less performant but that doesnt really matter right now
    // therefore, we are going to replace the entire modal
    static Modal = class {
        static clearModal = (modal)=>{
            modal.remove()
        }
        
        static createFromEvent = (e) => {
            // need to add modal element on start page
            const modal = document.createElement("div");
            modal.classList.add("modal");
            console.log("Event Target:");
            console.log(e.target);
            switch (true){
                case (e.target.classList.contains("edit-button")):
                    console.log("Todo Edit Button Pressed");
                    //get todo with uuid
                    const todoElement = e.target.closest(".todo");
                    console.log("Todo Element:", todoElement);
                    const todo = HTMLHandler.getTodoFromTodoElement(todoElement);
                    console.log(todo);
                    if (!todo){
                        throw new Error("Todo not found");
                    }

                    const todoEditForm = document.createElement("form");
                    todoEditForm.classList.add("todo-edit-modal");
                    todoEditForm.dataset.uuid = todo.uuid;
                    
                    todoEditForm.innerHTML = `
                    <label for="title">Title: 
                        <input type="text" class="todo-title" name="title" value="${todo.title}">
                    </label>
                    
                    <label>Description: 
                        <input type="text" class="todo-desc" name="description" value="${todo.description}">
                    </label>
                    
                    <label>Date: 
                        <input type="date" class="todo-due-date" name="dueDate" value="${todo.dueDate}">
                    </label>
                    
                    <label>Priority: 
                        <input type="text" class="todo-priority" name="priority" value="${todo.priority}">
                    </label>
                    
                    <label>Finished:
                        <input type="checkbox" class="todo-checked" name="checked" ${todo.checked ? "checked" : ""}}>
                    </label>
                    `;

                    const buttonContainer = document.createElement("div");
                    buttonContainer.classList.add("button-container");
                    todoEditForm.append(buttonContainer);

                    const cancelButton = HTMLHandler.createCancelButton();
                    buttonContainer.append(cancelButton);
                    
                    const submitButton = HTMLHandler.createSubmitButton();
                    buttonContainer.append(submitButton);
                    
                    modal.append(todoEditForm);
                    console.log(modal);
                    
                    todoEditForm.addEventListener("click", (e)=>{
                        if (e.target.classList.contains("cancel-button")){
                            this.clearModal(modal);
                        }
                    });

                    // Add listener for the submit of changing the todo information
                    todoEditForm.addEventListener("submit", async (e)=>{
                        e.preventDefault();

                        if (e.submitter && e.submitter.classList.contains("submit-button")){

                            console.log("Submit Button Pressed");
                            
                            const formData = new FormData(todoEditForm);
                            const formEntries = formData.entries();

                            console.log("Form Entries:", formEntries);
                            // Verify form data and change todo directly
                            let finishedIsChecked = false;
                            while (true){
                                let nxt = formEntries.next();
                                console.log("Next:", nxt);
                                if (nxt.done) break;
                                let [k,v] = nxt.value;
                                if (todo.hasOwnProperty(k)){
                                    switch (k){
                                        case "title":
                                        case "description":
                                        case "dueDate":
                                        case "priority":
                                            if (typeof v !== "string") {
                                                throw new Error(`${k} must be a string`);
                                            }
                                            todo[k] = v;
                                            break;
                                        case "checked":
                                            if (typeof v !== "string") {
                                                throw new Error(`${k} must be a string`);
                                            }
                                            if (v === "on"){
                                                todo[k] = true;
                                                finishedIsChecked = true;
                                            }
                                            break;
                                        default:
                                            throw new Error("Property is not modifiable");
                                    }
                                } else {
                                    throw new Error("Invalid property");
                                }
                                if (!finishedIsChecked){
                                    // case for if unchecked because FormData doesnt get unchecked forms for some dumb reason...
                                    todo.checked = false;
                                }
                            }

                            // save with storage handler, currently would just be saving the entire project
                            LocalStorageHandler.saveProjectData();

                            const todoElement = document.querySelector(`.todo[data-uuid="${todo.uuid}"]`);
                            if (!(todoElement instanceof Element)) {
                                throw new Error("Todo element not found on page");
                            }
                            
                            HTMLHandler.updateTodoElement(todo, todoElement);
                        }
                    });
                    break;
            }
            return modal;
        }
    }
}