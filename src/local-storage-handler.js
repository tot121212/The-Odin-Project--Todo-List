import { Projects, ProjectsMethods } from "./index.js";

export class LocalStorageHandler {
    // we do a little recursion fr
    static nestedMapToObject(map){
        const object = {};
        for (const [key,value] of map){
            object[key]  = value instanceof Map ? this.mapToJson(value) : value;
        }
        return object;
    }

    static objectToNestedMap(object){
        if (object !== null && typeof object === "object"){
            const map = new Map();
            for (const [key, value] of Object.entries(object)){
                map.set(key, this.objectToNestedMap(value));
            }
            return map;
        }
        return object;
    }

    static resetDatabase = ()=>{
        localStorage.removeItem("projects");
        window.location.reload();
    }

    static saveProjectData = ()=>{
        const save_data_obj = {
            "list" : Projects.list,
            "current" : Projects.current,
        }
        console.log("Save Data before Jsonificaiton", save_data_obj)

        const jsonified_projects = JSON.stringify(save_data_obj);
        localStorage.setItem("projects", jsonified_projects);
        console.log("Jsonified Save Data:", jsonified_projects);
    }

    static loadProjectData = ()=>{
        let result = null;

        try {
            const jsonified_projects = localStorage.getItem("projects");
            if (jsonified_projects === null){
                throw new Error("Projects does not exist, creating default project");
            }
    
            const projectsData = JSON.parse(jsonified_projects);
            if (!projectsData || typeof projectsData !== "object"){
                throw new Error("Could not parse projects");
            }
            console.log("UnJsonified Load Data:", projectsData);
            
            Projects.list = projectsData.list ?? [];
            Projects.current = projectsData.current ?? null;
            ProjectsMethods.rebuildAllMaps();
            result = true;

        } catch (error) {
            console.warn(error.message);
            switch (error.message){
                case "Projects does not exist, creating default project":
                    console.log(error.message);
                    result = false;
                    break;
                case "Could not parse projects":
                    console.error(error.message);
                    result = null;
                    break;
                default:
                    result = null;
            }
        }

        if (result === false){
            ProjectsMethods.addDefaultProject();
            ProjectsMethods.addDefaultProject();
            this.saveProjectData();
        } else if (result !== true){
            console.error("Error loading projects");
            return;
        }
        
        console.log("Projects: ");
        console.log(Projects.list);
        console.log(Projects.current);
        console.log(Projects.uuidToProject);
    }
}
