import { Projects } from "./index.js";

let reset = true;

export class LocalStorageHandler {
    // gets projects object from local or makes new
    static loadProjectData = ()=>{
        const init = ()=>{
            Projects.init();
            localStorage.setItem("projects", JSON.stringify({
                "list" : Projects.list,
                "nameToProjectMap" : Projects.nameToProjectMap,
                "current" : Projects.current
            }));
        };

        try {
            if (reset === true){
                throw new Error("Reset");
            }
            const rawData = localStorage.getItem("projects");
            if (!rawData || typeof rawData !== "string"){
                throw new Error("rawData does not exist");
            }
    
            const projectsData = JSON.parse(rawData);
            if (!projectsData || typeof projectsData !== "object"){
                throw new Error("Could not parse");
            }

            Projects.list = projectsData.list || [];
            Projects.nameToProjectMap = projectsData.nameToProjectMap || new Map(),
            Projects.current = projectsData.current || null;

        } catch (error) {
            init();
        }
    }
}
