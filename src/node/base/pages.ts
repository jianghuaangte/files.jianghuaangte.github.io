import {  
    FilePageFrontmatter,  
    FolderPageFrontmatter,  
    PageFileData,  
    PageFilesInfo,  
    PageFolderDataNoChildrenData,  
} from "../../type/index.js";  
import { App, createPage, Page } from "vuepress";  
import { File, Folder, isFile } from "./files.js";  
  
/**  
 * 递归获取文件夹中所有文件的搜索索引（绝对路径）  
 */  
function getSearchIndex(folder: Folder, currentPath: string): { name: string, path: string, isFolder: boolean }[] {  
    let index: { name: string, path: string, isFolder: boolean }[] = [];  
    for (const child of folder.children) {  
        const childPath = `${currentPath}/${child.name}`.replace(/\/+/g, '/');  
        if (isFile(child)) {  
            index.push({ name: child.name, path: childPath, isFolder: false });  
        } else {  
            index.push({ name: child.name, path: childPath, isFolder: true });  
            index.push(...getSearchIndex(child as Folder, childPath));  
        }  
    }  
    return index;  
}  
  
export function createFilePage(app: App, path: string, file: File): Promise<Page> {  
    const frontmatter: FilePageFrontmatter = {  
        layout: 'File',  
        title: file.name,  
        flistData: {  
            name: file.name,  
            updateTime: file.updateTime,  
            size: file.size,  
            downloadUrl: file.downloadUrl,  
            downloadCorsAllow: file.downloadCorsAllow,  
            contentType: file.contentType,  
            content: file.content,  
        },  
    }  
    return createPage(app, { path: path, frontmatter: frontmatter })  
}  
  
export function createFolderPage(app: App, path: string, folder: Folder, globalRoot: Folder): Promise<Page> {  
    const childrenData = folder.children.map((children): PageFileData | PageFolderDataNoChildrenData => {  
        const base: PageFilesInfo = { name: children.name, size: children.size, updateTime: children.updateTime }  
        if (isFile(children)) {  
            return { ...base, downloadUrl: (children as File).downloadUrl, downloadCorsAllow: (children as File).downloadCorsAllow, contentType: (children as File).contentType }  
        }  
        return { ...base, isFolder: true }  
    })  
    const frontmatter: FolderPageFrontmatter = {  
        layout: 'Folder',  
        title: folder.title || folder.name,  
        flistData: {  
            name: folder.name,  
            size: folder.size,  
            updateTime: folder.updateTime,  
            children: childrenData,  
            isFolder: true,  
            content: folder.content,  
            // 注入全站索引，从根节点开始计算  
            searchIndex: getSearchIndex(globalRoot, "")  
        },  
    }  
    return createPage(app, { path: path, frontmatter: frontmatter })  
}  
  
function createFileTreePagesInner(app: App, path: string, folder: Folder, globalRoot: Folder): Promise<Page>[] {  
    const pagePromiseList: Promise<Page>[] = [];  
    pagePromiseList.push(createFolderPage(app, path + "/", folder, globalRoot));  
    for (let children of folder.children) {  
        if (!isFile(children)) {  
            pagePromiseList.push(...createFileTreePagesInner(app, path + "/" + children.name, children as Folder, globalRoot))  
            continue;  
        }  
        pagePromiseList.push(createFilePage(app, path + "/" + children.name + "/", children as File));  
    }  
    return pagePromiseList;  
}  
  
export function createFileTreePages(app: App, folder: Folder): Promise<Page>[] {  
    return createFileTreePagesInner(app, "", folder, folder);  
}
