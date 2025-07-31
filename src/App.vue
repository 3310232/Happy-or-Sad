<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import exploreIcon from "./assets/explore.svg";
import aboutIcon from "./assets/about.svg";
import talkIcon from "./assets/talk.svg";
import settingIcon from "./assets/setting.svg";
import expandIcon from "./assets/expand.svg";
import collapseIcon from "./assets/collapse.svg";
import editIcon from "./assets/edit.svg";

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
const showDialog = ref(false);
const isLoginMode = ref(true);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function onMenuClick(item) {
  router.push(item.path);
}

function signIn() {
  isLoginMode.value = true;
  showDialog.value = true;
}

function toggleMode() {
  isLoginMode.value = !isLoginMode.value;
}

function submit() {
  alert(isLoginMode.value ? "Login Submitted" : "Register Submitted");
  showDialog.value = false;
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
      <header class="topbar">
        <div class="topbar-title"></div>
        <button class="sign-in-btn" @click="signIn">Sign In</button>
      </header>

      <main class="container">
        <router-view />
      </main>
    </div>

    <!-- 登录/注册浮窗 -->
    <div
      v-if="showDialog"
      class="dialog-backdrop"
      @click.self="showDialog = false"
    >
      <div class="dialog">
        <h2>{{ isLoginMode ? "Sign In" : "Register" }}</h2>
        <form @submit.prevent="submit">
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <input
            v-if="!isLoginMode"
            type="password"
            placeholder="Confirm Password"
            required
          />
          <button type="submit">
            {{ isLoginMode ? "Sign In" : "Register" }}
          </button>
        </form>
        <div class="toggle-link" @click="toggleMode">
          {{
            isLoginMode ? "No account? Register" : "Have an account? Sign in"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
  z-index: 1000;
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
  background-color: #dbddc5;
}
.menu-item.active {
  background-color: #c9ccb4;
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

/* Sticky 顶部栏 */
.topbar {
  position: sticky;
  top: 0;
  z-index: 999;
  height: 60px;
  background-color: #f6f4f1;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.sign-in-btn {
  background-color: #556449;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.sign-in-btn:hover {
  background-color: #819670;
}

.container {
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
}

/* === 登录注册浮窗 === */
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(36, 25, 25, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px 28px;
  width: 320px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.dialog h2 {
  margin-bottom: 20px;
  color: #241919;
}

.dialog input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.dialog button {
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  background-color: #556449;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.dialog button:hover {
  background-color: #819670;
}

.toggle-link {
  margin-top: 10px;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
}
</style>
