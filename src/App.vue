<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ChatView from "./components/chat/ChatView.vue";

const router = useRouter();

const menuItems = [
  { name: "首页", path: "/" },
  { name: "关于", path: "/about" },
  { name: "聊天记录", path: "/chat" },
  { name: "设置", path: "/settings" },
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
    <aside :class="['sidebar', { collapsed: isCollapsed }]">
      <div class="title-bar">
        <div class="title">Happy Or Sad</div>
        <button class="collapse-btn" @click="toggleSidebar">
          {{ isCollapsed ? "▶" : "◀" }}
        </button>
      </div>
      <nav v-if="!isCollapsed">
        <ul>
          <li
            v-for="(item, index) in menuItems"
            :key="index"
            @click="onMenuClick(item)"
            class="menu-item"
          >
            {{ item.name }}
          </li>
        </ul>
      </nav>
    </aside>
    <main class="chat-container">
      <router-view />
    </main>
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
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.sidebar {
  position: fixed; /* ← 固定侧边栏位置 */
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
  z-index: 1000; /* 保证在主内容上方 */
}

/* 折叠后侧边栏变窄 */
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

/* 折叠时隐藏标题文字 */
.sidebar.collapsed .title {
  display: none;
}

.collapse-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  color: #241919;
  padding: 0;
  width: 24px;
  height: 24px;
  line-height: 24px;
}

/* 折叠时隐藏菜单 */
.sidebar.collapsed nav {
  display: none;
}
.sidebar.collapsed ~ .chat-container {
  margin-left: 50px;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav ul li {
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

nav ul li:hover {
  background-color: #dbddc5;
}

.chat-container {
  margin-left: 240px; /* ← 为固定 sidebar 预留空间 */
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  transition: margin-left 0.3s ease;
}

/* 响应式布局：小屏时隐藏侧边栏 */
@media screen and (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
