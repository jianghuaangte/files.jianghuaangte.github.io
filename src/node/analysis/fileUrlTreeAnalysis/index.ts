import {addFileToFileTree, Folder} from "../../base/files.js";
import {Analysis} from "../../base/AllAnalysis.js";

export type FileUrlTree = {
    [path:string]:string | {url:string, size?:number} 
}

export function fileUrlTreeAnalysis(config:FileUrlTree):Analysis{  
    return async ()=>{  
        const fileTree:Folder = {children:[],name:"fileUrlTreeAnalysisRoot"};  
        for(let path in config){  
            const value = config[path];  
              
            // 解析 url 和 size  
            let url: string;  
            let size: number | undefined;  
              
            if(typeof value === 'string'){  
                url = value;  
            } else {  
                url = value.url;  
                size = value.size;  
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
                size: size,  // 添加 size 字段  
            });  
        }  
        return fileTree;  
    }  
}