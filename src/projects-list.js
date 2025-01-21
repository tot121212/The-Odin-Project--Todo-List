import { HTMLHandler } from "./html-handler.js";
import { Projects } from "./index.js";

HTMLHandler.loadProjectList = ()=>{
    HTMLHandler.clearContent();

    const projectContainer = document.createElement("div");
    projectContainer.classList.add("projects-container");
    document.querySelector(".content").append(projectContainer);

    const projectList = Projects.list;
    for (const project of projectList){
        const projectElement = HTMLHandler.createProjectElement(project);
        projectContainer.appendChild(projectElement);
    }

    projectContainer.addEventListener("click", (e)=>{
        if (e.target.classList.contains("project")){
            const projectNameElement = e.target.querySelector(".project-name");
            if (!projectNameElement) {
                throw new Error("Project name element not found");
            }
            for (const project of Projects.list){
                if (projectNameElement.textContent === project.name){
                    HTMLHandler.clearContent();
                    HTMLHandler.createProject(project);
                    return;
                }
            }
        }
    });
}