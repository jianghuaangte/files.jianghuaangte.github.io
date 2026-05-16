<script setup lang="ts">  
import {usePageFrontmatter, useRoute} from 'vuepress/client';  
import {FolderPageFrontmatter} from "../../type/index.js";  
import FilesPageMain from "../components/FilesPageMain.vue";  
import FButtonLink from "../components/FButtonLink.vue";  
import FileTypeIcon from "../components/FileTypeIcon.vue";  
import {dateFormat} from "../js/dateFormat.js";  
import {fileSizeFormat} from "../js/fileSizeFormat.js";  
import {computed, ref, watch} from "vue"; // 确保导入了 watch  
import ArrowDown from "../imgs/ui/ArrowDown.vue";  
  
const frontmatter = usePageFrontmatter<FolderPageFrontmatter>();  
const children = computed(()=>frontmatter.value.flistData?.children || []);  
const searchIndex = computed(() => frontmatter.value.flistData?.searchIndex || []);  
const route = useRoute();  
const searchQuery = ref("");  
  
// 新增：监听路由路径变化，进入新目录时清空搜索关键字  
watch(() => route.path, () => {  
  searchQuery.value = "";  
});  
  
// 全局搜索结果过滤  
const searchResults = computed(() => {  
  if (!searchQuery.value.trim()) return [];  
  const q = searchQuery.value.toLowerCase();  
  return searchIndex.value.filter(item => item.name.toLowerCase().includes(q));  
});  
  
// 排序逻辑  
const sortType = ref<"name-asc"|"name-desc"|"size-asc"|"size-desc"|"item-asc"|"item-desc">();  
const showChildren = computed(()=>{  
  let list = [...children.value];  
  if(sortType.value==="name-asc") list.sort((a,b)=> (a.isFolder === b.isFolder) ? a.name.localeCompare(b.name) : (a.isFolder ? -1 : 1));  
  if(sortType.value==="name-desc") list.sort((a,b)=> (a.isFolder === b.isFolder) ? b.name.localeCompare(a.name) : (a.isFolder ? 1 : -1));  
  if(sortType.value==="size-asc") list.sort((a,b)=> (a.isFolder === b.isFolder) ? (a.size || 0) - (b.size || 0) : (a.isFolder ? -1 : 1));  
  if(sortType.value==="size-desc") list.sort((a,b)=> (a.isFolder === b.isFolder) ? (b.size || 0) - (a.size || 0) : (a.isFolder ? 1 : -1));  
  if(sortType.value==="item-asc") list.sort((a,b)=> (a.isFolder === b.isFolder) ? (a.updateTime || 0) - (b.updateTime || 0) : (a.isFolder ? -1 : 1));  
  if(sortType.value==="item-desc") list.sort((a,b)=> (a.isFolder === b.isFolder) ? (b.updateTime || 0) - (a.updateTime || 0) : (a.isFolder ? 1 : -1));  
  return list;  
});  
</script>  
  
<template>  
  <FilesPageMain>  
    <template #default>  
      <!-- 搜索框 -->  
      <div class="search-box">  
        <input v-model="searchQuery" placeholder="搜索全站文件..." class="search-input" />  
      </div>  
  
      <div class="files sort-start">  
        <!-- 搜索模式 -->  
        <template v-if="searchQuery">  
          <div class="th"><span>搜索结果 ({{ searchResults.length }})</span></div>  
          <FButtonLink   
            class="td"   
            v-for="res in searchResults"   
            :key="res.path"   
            :to="res.path + '/'"  
          >  
            <div class="t-name">  
              <FileTypeIcon class="file-icon" :class="{folder: res.isFolder}" :isFolder="res.isFolder" :fileName="res.name" />  
              <span class="file-name">{{res.name}}</span>  
              <small class="path-hint">{{ res.path }}</small>  
            </div>  
          </FButtonLink>  
        </template>  
  
        <!-- 正常列表模式 -->  
        <template v-else-if="showChildren.length > 0">  
          <div class="th">  
            <div class="thc t-name" @click="sortType=sortType=='name-asc'?'name-desc':sortType=='name-desc'?undefined:'name-asc'"><span>名称</span><ArrowDown class="sort-icon" :class="{asc:sortType=='name-asc',desc:sortType=='name-desc'}"></ArrowDown></div>  
            <div class="thc t-size" @click="sortType=sortType=='size-asc'?'size-desc':sortType=='size-desc'?undefined:'size-asc'"><ArrowDown class="sort-icon" :class="{asc:sortType=='size-asc',desc:sortType=='size-desc'}"></ArrowDown><span>大小</span></div>  
            <div class="thc t-up-item" @click="sortType=sortType=='item-asc'?'item-desc':sortType=='item-desc'?undefined:'item-asc'"><ArrowDown class="sort-icon" :class="{asc:sortType=='item-asc',desc:sortType=='item-desc'}"></ArrowDown><span>更新时间</span></div>  
          </div>  
          <TransitionGroup name="list" :key="route.path">  
            <FButtonLink class="td" v-for="file of showChildren" :key="file.name" :to="`./${encodeURI(file.name).replaceAll(',','_').replaceAll('+','_')}/`">  
              <div class="t-name">  
                <FileTypeIcon class="file-icon" :class="{folder:file.isFolder}" :isFolder="!!file.isFolder" :fileName="file.name" />  
                <span class="file-name" :title="file.name">{{file.name}}</span>  
              </div>  
              <div class="t-size">{{fileSizeFormat(file.size)}}</div>  
              <div class="t-up-item">{{dateFormat(file.updateTime)}}</div>  
            </FButtonLink>  
          </TransitionGroup>  
        </template>  
      </div>  
    </template>  
  </FilesPageMain>  
</template>  
  
<style scoped>  
.search-box { margin-bottom: 1rem; padding: 0 0.4rem; }  
.search-input { width: 98%; padding: 0.6rem; border: 1px solid var(--main-border-c); border-radius: 4px; background: var(--mian-box-bgc); color: var(--f-color-0); outline: none; }  
.search-input:focus { border-color: var(--t-color-1); }  
.path-hint { opacity: 0.4; margin-left: 10px; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }  
.list-move, .list-enter-active, .list-leave-active { transition: none; }  
.sort-start .list-move { transition: transform 0.25s ease; }  
.sort-icon { width: 1em; height: 1em; opacity: 0; transform: translateY(0.1em) rotate(0deg); color: var(--f-color-1); transition: opacity 0.25s ease,transform 0.25s ease; }  
.thc { cursor: pointer; }  
.thc:hover .sort-icon { opacity: 0.5; }  
.thc .sort-icon.asc { transform: translateY(0.1rem) rotate(-135deg); opacity: 1; }  
.thc .sort-icon.desc { transform: translateY(0.1rem) rotate(45deg); opacity: 1; }  
.th .t-name, .th .t-size, .th .t-up-item { font-weight: bold; color: var(--f-color-1); align-items: center; display: flex; gap: 0.4rem; }  
.td { display: flex; align-items: center; gap: 0.6rem; }  
.t-name { flex: 1; display: flex; align-items: center; gap: 0.5rem; overflow: hidden; }  
.file-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }  
.file-icon { font-size: 1.5rem; flex-shrink: 0; color: var(--file-icon-c); }  
.file-icon.folder { color: var(--folder-icon-c); }  
.t-size { text-align: right; min-width: 5rem; }  
.t-up-item { display: none; flex: 0.3; text-align: right; min-width: 10rem; }  
.files { display: flex; flex-direction: column; gap: 0.25rem; }  
.th { padding: 0 0.4rem 0.4rem 0.4rem; display: flex; justify-content: flex-end; align-items: center; }  
@media (min-width: 768px) { .t-up-item { display: block; } .th .t-up-item { display: flex; } }  
</style>
