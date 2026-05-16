<script setup lang="ts">  
import { ref, onMounted } from 'vue';  
  
const isDark = ref(false);  
  
onMounted(() => {  
  const savedTheme = localStorage.getItem('theme');  
  if (savedTheme === 'dark') {  
    isDark.value = true;  
    document.documentElement.setAttribute('data-theme', 'dark');  
  } else if (savedTheme === 'light') {  
    isDark.value = false;  
    document.documentElement.setAttribute('data-theme', 'light');  
  } else {  
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;  
    isDark.value = prefersDark;  
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');  
  }  
});  
  
function toggleTheme() {  
  isDark.value = !isDark.value;  
  const theme = isDark.value ? 'dark' : 'light';  
  document.documentElement.setAttribute('data-theme', theme);  
  localStorage.setItem('theme', theme);  
}  
</script>  
  
<template>  
  <button @click="toggleTheme" class="theme-toggle" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">  
    <span v-if="isDark">☀️</span>  
    <span v-else>🌙</span>  
  </button>  
</template>  
  
<style scoped>  
.theme-toggle {  
  background: var(--mian-box-bgc);  
  border: 1px solid var(--main-border-c);  
  border-radius: 0.4rem;  
  padding: 0.4rem 0.8rem;  
  cursor: pointer;  
  font-size: 1.2rem;  
  transition: all 0.25s;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  
  
.theme-toggle:hover {  
  background: var(--main-hover-bg);  
}  
</style>
