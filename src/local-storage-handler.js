import { Projects } from "./index.js";

let reset = true;

export class LocalStorageHandler {
    static saveProjectData = ()=>{
        localStorage.setItem("projects", JSON.stringify({
            "list" : Projects.list,
            "current" : Projects.current,
            "uuidToProject": Projects.uuidToProject
        }));
    }

    static loadDefaultProject = ()=>{
        Projects.init();
        this.saveProjectData();
    }

    static loadProjectData = ()=>{
        try {
            if (reset === true){
                throw new Error("reset === true");
            }
            const rawData = localStorage.getItem("projects");
            if (typeof rawData === "undefined"){
                throw new Error("Projects does not exist, creating default project");
            }
            if (!rawData || typeof rawData !== "string"){
                throw new Error("Error getting projects");
            }
    
            const projectsData = JSON.parse(rawData);
            if (!projectsData || typeof projectsData !== "object"){
                throw new Error("Could not parse projects");
            }

            Projects.list = projectsData.list || [];
            Projects.current = projectsData.current || null;
            Projects.uuidToProject = projectsData.uuidToProject || new Map();

        } catch (error) {
            switch (error.message){
                case "Projects does not exist, creating default project":
                case "reset === true":
                    console.log(error);
                    this.loadDefaultProject();
                    break;
                case "Error getting projects":
                case "Could not parse projects":
                    console.error(error);
                    break;
            }
        }
    }
}
