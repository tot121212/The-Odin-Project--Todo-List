import { Projects } from "./index.js";


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
                HTMLHandler.createProject(project);
            }
        });
        
    }
    */
    static clearContent = ()=>{
        document.querySelector(".content").innerHTML = "";
    }

    // creates html element for todo
    static createTodoElement = (todo)=>{
        const todoElement = document.createElement("div");
        todoElement.classList.add("todo");
        // uuid will never change so we dont use in update to avoid any future mistakes
        todoElement.dataset.uuid = todo.uuid;
        
        const todoTitleElement = document.createElement("header");
        todoTitleElement.classList.add("todo-title");
        todoElement.append(todoTitleElement);

        const todoDescElement = document.createElement("main");
        todoDescElement.classList.add("todo-desc");
        todoElement.append(todoDescElement);

        const todoDueDateElement = document.createElement("footer");
        todoDueDateElement.classList.add("todo-due-date");
        todoElement.append(todoDueDateElement);

        const todoEditButton = document.createElement("button");
        todoEditButton.classList.add("edit-todo");
        todoEditButton.textContent = "Edit";
        todoElement.append(todoEditButton);

        return todoElement;
    }

    // updates todoElement with todo data
    static updateTodoElement = (todo, todoElement)=>{
        const todoTitleElement = todoElement.querySelector(".todo-title");
        todoTitleElement.textContent = todo.title;
        
        const todoDescElement = todoElement.querySelector(".todo-desc");
        todoDescElement.textContent = todo.description;

        const todoDueDateElement = todoElement.querySelector(".todo-due-date");
        todoDueDateElement.textContent = todo.dueDate;
    }

    // list element that contains todos
    static createTodoListElement = (todoList) => {
        const todoListElement = document.createElement("div");
        todoListElement.classList.add("todo-list");
        todoListElement.dataset.uuid = todoList.uuid;
        
        const todoListNameElement = document.createElement("header");
        todoListNameElement.classList.add("todo-list-name");
        todoListElement.append(todoListNameElement);

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

    static onEditTodoClicked = (e)=>{
        const projectUUID = todoElement.closest(".project").dataset.uuid;
        const project = Projects.getProject(projectUUID);

        const todoListUUID = todoElement.closest(".todo-list").dataset.uuid;
        const todoList = project.getTodoList(todoListUUID);

        const todoUUID = todoElement.dataset.uuid;
        const todo = todoList.getTodo(todoUUID);

        // display the edit 
    }

    static projectListenForClicks = (projectElement)=>{
        projectElement.addEventListener("click", (e)=>{
            const todoElement = e.target.closest(".todo");
            if (e.target.classList.contains("edit-todo")){
                this.onEditTodoClicked(e, );
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

        this.projectListenForClicks(projectElement);
    }

    static loadProjectListToContent = ()=>{
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("projects-container");
        document.querySelector(".content").append(projectContainer);
    
        const projectList = Projects.list;
        for (const project of projectList){
            const projectElement = this.createProjectElement(project);
            projectContainer.append(projectElement);
        }
    
        projectContainer.addEventListener("click", (e)=>{
            if (e.target.classList.contains("project")){
                // couldve done a map of the project keys but too late, this is where im staring to learn more and more that planning is super important
                for (const project of Projects.list){
                    if (e.target.dataset.uuid === project.uuid){
                        this.clearContent();
                        HTMLHandler.loadProjectToContent(project);
                        break;
                    }
                }
            }
        });
    }
}

/*
export class ModalHandler {
    static createModal = (modalType, modalContent) => {
        const modal = document.createElement("div");
        modal.classList.add("modal");

        const modalContentElement = document.createElement("div");
        modalContentElement.classList.add("modal-content");
        modalContentElement.textContent = modalContent;
        modal.append(modalContentElement);

        const modalCloseButton = document.createElement("button");
        modalCloseButton.classList.add("modal-close");
        modalCloseButton.textContent = "Close";
        modal.append(modalCloseButton);

        return modal;
    }

    static showModal = (modal) => {
        document.querySelector(".content").append(modal);
    }

    static closeModal = (modal) => {
        modal.remove();
    }

    static listenForModalClose = (modal) => {
        modal.querySelector(".modal-close").addEventListener("click", (e) => {
            this.closeModal(modal);
        });
    }
}
*/