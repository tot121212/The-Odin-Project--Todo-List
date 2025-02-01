import { Projects, ProjectsMethods, ProjectMethods, TodoListMethods } from "./index.js";
import editTodoIMG from "./media/angle-right.svg";
import submitTodoIMG from "./media/check.svg";
import cancelTodoIMG from "./media/cross.svg";


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
    static clearContent = ()=>{
        document.querySelector(".content").innerHTML = "";
    }

    // creates html element for todo
    static createTodoElement = (todo)=>{
        const todoElement = document.createElement("div");
        todoElement.classList.add("todo");
        todoElement.dataset.uuid = todo.uuid;

        todoElement.innerHTML = `
        <header class="todo-title"></header>
        <main class="todo-desc"></main>
        <div class="todo-due-date"></div>
        `;

        return todoElement;
    }

    static addEditButtonToTodoElement = (todoElement)=>{
        todoElement.innerHTML += `
        <button class="grabbable logo todo-edit-button" type="button"><object data="${editTodoIMG}" type="image/svg+xml" alt="Edit Todo"></object></button>
        `;
    }

    static addCancelButtonToTodoElement = (todoElement)=>{
        todoElement.innerHTML += `
        <button class="grabbable logo todo-cancel-button" type="button"> <img src="${cancelTodoIMG}" alt="Cancel"> </button>
        `;
    }

    static addSubmitButtonToTodoElement = (todoElement)=>{
        todoElement.innerHTML += `
        <button class="grabbable logo todo-submit-button" type="submit"> <img src="${submitTodoIMG}" alt="Submit"> </button>
        `;
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
            this.addEditButtonToTodoElement(todoElement);
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
        const todoElement = e.target.closest(".todo");

        const projectUUID = todoElement.closest(".project").dataset.uuid;
        const project = ProjectsMethods.getProject(projectUUID);

        const todoListUUID = todoElement.closest(".todo-list").dataset.uuid;
        const todoList = ProjectMethods.getTodoList(project, todoListUUID);

        const todoUUID = todoElement.dataset.uuid;
        const todo = TodoListMethods.getTodo(todoList, todoUUID);

        // update modal element with todo information
    }

    static projectElementListenForClicks = (projectElement)=>{
        projectElement.addEventListener("click", (e)=>{
            if (e.target.classList.contains("todo-edit-button")){
                this.onEditTodoClicked(e);
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
                // couldve done a map of the project keys but too late, this is where im staring to learn more and more that planning is super important
                for (const project of Projects.list){
                    if (e.target.dataset.uuid === project.uuid){
                        this.clearContent();
                        this.loadProjectToContent(project);
                        break;
                    }
                }
            }
        });
    }

    // want to restructure everything like this bc i didnt realize you can make classes within classes in js like this until now...

    // do we want to replace the modal itself or the data within......
    // bc when we delete elements it removes the listener it is useful to do it that way but less performant but that doesnt really matter right now
    // therefore, we are going to replace the entire modal
    static Modal = class {
        static create = (type) => {
            const modal = document.createElement("div");
            modal.classList.add("modal");
            
            switch (type){
                case "todo":
                    const todoEditForm = document.createElement("form");
                    todoEditForm.classList.add("todo-edit-modal");
                    todoEditForm.dataset.uuid = todo.uuid;
                    
                    todoEditForm.innerHTML = `
                    <header class="todo-title"></header>
                    <main class="todo-desc"></main>
                    <div class="todo-due-date"></div>
                    `;

                    this.addCancelButtonToTodoElement(todoEditForm);
                    this.addSubmitButtonToTodoElement(todoEditForm);

                    modal.append(todoEditForm);

                    todoEditForm.addEventListener("click", (e)=>{
                        if (e.target.classList.contains("todo-cancel-button")){
                            modal.innerHTML = "";
                            // or hide it
                        }
                    });
                    todoEditForm.addEventListener("submit", (e)=>{
                        if (e.target.classList.contains("todo-submit-button")){
                            e.preventDefault();
                            // get data from form
                            const formData = new FormData(e.target);
                            //get todo with uuid
                            const todoUUID = e.target.dataset.id;
                            const todoListUUID = e.target.closest(".todo-list").dataset.id;
                            const projectUUID = e.target.closest(".project").dataset.id;
                            // const todo = 
                            // update todo data
                            // for (const [k,v] in formData.entries()){
                            //     if (k in todo){
                            //         return true;
                            //     }
                            // }
                            // save with storage handler, currently would just be saving the entire project
                            // add listener to new todo
                            // close modal
                            // update todo element on page
                        }
                    });

                    break;
            }

            return modal;
        }
    }
}