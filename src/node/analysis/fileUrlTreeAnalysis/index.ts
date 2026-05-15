import {addFileToFileTree, Folder} from "../../base/files.js";
import {Analysis} from "../../base/AllAnalysis.js";

export type FileUrlTree = {  
    [path:string]:string | {url:string, size?:number, updateTime?:number}  
}

export function fileUrlTreeAnalysis(config:FileUrlTree):Analysis{  
    return async ()=>{  
        const fileTree:Folder = {children:[],name:"fileUrlTreeAnalysisRoot"};  
        for(let path in config){  
            const value = config[path];  
              
            let url: string;  
            let size: number | undefined;  
            let updateTime: number | undefined;  
              
            if(typeof value === 'string'){  
                url = value;  
            } else {  
                url = value.url;  
                size = value.size;  
                updateTime = value.updateTime;  
            }  
              
            if(path.startsWith("/")){  
                path = path.substring(1);  
            }  
            if(path.endsWith("/")){  
                path = path.substring(0,path.length-1);  
            }  
            if(!path){  
                throw new Error("fileUrlTreeAnalysis 路径不能为空");  
            }  
            const pathArray = path.split("/");  
            const fileName = pathArray.pop() as string;  
            addFileToFileTree(fileTree,pathArray,{  
                name:fileName,  
                downloadUrl:url,  
                downloadCorsAllow: "allow",  
                size: size,  
                updateTime: updateTime,  // 添加 updateTime 字段  
            });  
        }  
        return fileTree;  
    }  
}