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

    static loadProjectData = ()=>{
        let result = null;
        try {
            if (reset === true){
                throw new Error("reset is true");
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
            result = true;
        } catch (error) {
            switch (error.message){
                case "Projects does not exist, creating default project":
                case "reset is true":
                    console.log(error);
                    result = false;
                    break;
                case "Error getting projects":
                case "Could not parse projects":
                    console.error(error);
                    result = null;
                    break;
                default:
                    result = null;
            }
        }
        return result;
    }
}
