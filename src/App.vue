<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppHeader from "./views/AppHeader.vue";
import exploreIcon from "./assets/explore.svg";
import aboutIcon from "./assets/about.svg";
import talkIcon from "./assets/talk.svg";
import settingIcon from "./assets/setting.svg";
import expandIcon from "./assets/expand.svg";
import collapseIcon from "./assets/collapse.svg";
import editIcon from "./assets/edit.svg";

const savedColor = localStorage.getItem("theme-color");
if (savedColor) {
  document.documentElement.style.setProperty("--primary-color", savedColor);
}

const router = useRouter();
const route = useRoute();

function isActive(item) {
  return route.path === item.path;
}

const menuItems = [
  { name: "explore", path: "/", icon: exploreIcon },
  { name: "create", path: "/chat", icon: talkIcon },
  { name: "editing", path: "/edit", icon: editIcon },
  { name: "setting", path: "/settings", icon: settingIcon },
  { name: "about", path: "/about", icon: aboutIcon },
];

const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function onMenuClick(item) {
  router.push(item.path);
}
</script>

<template>
  <div class="app">
    <!-- 侧边栏 -->
    <aside :class="['sidebar', { collapsed: isCollapsed }]">
      <div class="title-bar">
        <div class="title">Happy or Sad</div>
        <div class="collapse-icon" @click="toggleSidebar">
          <component
            :is="isCollapsed ? expandIcon : collapseIcon"
            class="menu-icon"
          />
        </div>
      </div>
      <nav>
        <ul>
          <li
            v-for="(item, index) in menuItems"
            :key="index"
            @click="onMenuClick(item)"
            :class="['menu-item', { active: isActive(item) }]"
          >
            <component :is="item.icon" class="menu-icon" />
            <span class="menu-text">{{ item.name }}</span>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 主内容区域 -->
    <div class="main-area">
      <AppHeader />
      <main class="container">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #556449;
  --primary-color-hover: #819670;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
}

.app {
  display: flex;
  height: 100%;
  width: 100%;
}

/* === 侧边栏 === */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background-color: #f1efec;
  color: #241919;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 10;
}

.sidebar.collapsed {
  width: 50px;
  padding: 20px 8px;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  user-select: none;
}

.title {
  font-size: 24px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .title {
  display: none;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: var(--primary-color-hover);
}
.menu-item.active {
  background-color: var(--primary-color);
  color: white;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 10px 0;
}

.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: currentColor;
}

.menu-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .menu-text {
  display: none;
}

.collapse-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #241919;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.collapse-icon:hover {
  background-color: #e0e0e0;
}

/* === 主区域 === */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  width: 100%;
}

.sidebar.collapsed ~ .main-area {
  margin-left: 50px;
}

.container {
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
