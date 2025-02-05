import { Projects, Project, TodoList, Todo } from "./index.js";
import { ProjectsMethods } from "./index.js";

export class LocalStorageHandler {
    // we do a little recursion fr
    // static nestedMapToObject(map){
    //     const object = {};
    //     for (const [key,value] of map){
    //         object[key]  = value instanceof Map ? this.nestedMapToObject(value) : value;
    //     }
    //     return object;
    // }

    // static objectToNestedMap(object){
    //     if (object !== null && typeof object === "object"){
    //         const map = new Map();
    //         for (const [key, value] of Object.entries(object)){
    //             map.set(key, this.objectToNestedMap(value));
    //         }
    //         return map;
    //     }
    //     return object;
    // }

    static resetDatabase = ()=>{
        localStorage.removeItem("projects");
        window.location.reload();
    }

    static saveProjectData = ()=>{
        const saveDataObj = {
            "list" : Projects.list,
            "current" : Projects.current,
        }
        console.log("Save Data before Jsonificaiton", saveDataObj)

        const jsonifiedProjects = JSON.stringify(saveDataObj);
        localStorage.setItem("projects", jsonifiedProjects);
        console.log("Jsonified Save Data:", jsonifiedProjects);
    }

    static loadProjectData = ()=>{
        let result = null;

        try {
            const jsonifiedProjects = localStorage.getItem("projects");
            if (jsonifiedProjects === null){
                throw new Error("Projects does not exist, creating default project");
            }
    
            const parsedProjects = JSON.parse(jsonifiedProjects);
            if (!parsedProjects || typeof parsedProjects !== "object"){
                throw new Error("Could not parse projects");
            }
            console.log("UnJsonified Load Data:", parsedProjects);
            
            // const mappedProjects = this.objectToNestedMap(parsedProjects);

            // const revivedProjects = this.reviveObject(mappedProjects);
            const revivedProjects = this.reviveObjectRecursively(parsedProjects);

            Projects.list = revivedProjects.list ?? [];
            Projects.current = revivedProjects.current ?? null;
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
        
        console.log("Projects:");
        console.log("List:",Projects.list);
        console.log("Current:",Projects.current);
        console.log("UUIDToProjectMap:",Projects.uuidToProject);
    }
    
    static reviveObjectRecursively(obj) {
        if (obj && typeof obj === "object") {
            if ("_class" in obj) {
                const ClassRef = globalThis[obj._class];
    
                if (typeof ClassRef === "function") {
                    Object.setPrototypeOf(obj, ClassRef.prototype);
                } else {
                    throw new Error("Class not found: " + obj._class);
                }
            }
    
            for (const key in obj) {
                if (typeof obj[key] === "object") {
                    obj[key] = this.reviveObject(obj[key]);
                }
            }
        }
        return obj;
    }
    
}
