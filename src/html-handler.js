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
        
        const todoListNameElement = document.createElement("header");
        todoListNameElement.classList.add("todo-list-name");
        todoListNameElement.textContent = todoList.name;
        todoListElement.append(todoListNameElement);

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

    static createProject = (project) => {
        const projectElement = this.createProjectElement(project);

        this.createTodoLists(project.todoLists, projectElement);
        this.updateTodoLists(project.todoLists, projectElement);

        document.querySelector(".content").appendChild(projectElement);
    }

    static destroyExistingProject = () => {
        const existingProject = document.querySelector("div.project");
        if (existingProject) { existingProject.remove(); }
    }
}