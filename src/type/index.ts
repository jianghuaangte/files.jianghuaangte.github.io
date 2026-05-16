import {PageFrontmatter} from "vuepress";  
  
export type DownloadCorsAllow = "allow" | "loose" | "strict" | "verystrict";  
  
export interface PageFilesInfo{  
    name:string,  
    updateTime?:number,  
    size?:number,  
    isFolder?:boolean,  
    content?:string  
}  
  
export interface PageFileData  extends PageFilesInfo{  
    downloadUrl:string,  
    downloadCorsAllow:DownloadCorsAllow,  
    contentType?:string  
}  
  
export interface PageFolderDataNoChildrenData extends PageFilesInfo{  
    isFolder:true  
}  
  
export interface PageFolderData extends PageFolderDataNoChildrenData{  
    children:Array<PageFileData|PageFolderDataNoChildrenData>,  
    // 全站搜索索引：包含名称、绝对路径和类型标记  
    searchIndex?: Array<{ name: string, path: string, isFolder: boolean }>  
}  
  
export interface FilesPageFrontmatter extends PageFrontmatter{  
    layout: 'Folder' | 'File',  
    title?:string,  
    flistData:PageFolderData|PageFileData  
}  
  
export interface FolderPageFrontmatter extends FilesPageFrontmatter{  
    layout: 'Folder',  
    flistData: PageFolderData,  
}  
  
export interface FilePageFrontmatter extends FilesPageFrontmatter{  
    layout: 'File',  
    flistData: PageFileData  
}
