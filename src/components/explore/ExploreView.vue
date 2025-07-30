<template>
  <div class="explore-page">
    <!-- 顶部标题 -->
    <h1 class="page-title">AI Community Spotlight</h1>

    <!-- 用户登录卡片 -->
    <!-- <header class="page-header">
      <div class="user-section">
        <button v-if="!user" class="login-btn" @click="login">登录</button>
        <div v-else class="user-info">
          <img :src="user.avatar" alt="avatar" class="avatar" />
          <span class="username">{{ user.name }}</span>
        </div>
      </div>
    </header> -->

    <!-- 视频播放器和缩略图的容器 -->
    <section class="video-wrapper">
      <div class="video-preview-section">
        <div class="main-video">
          <video
            controls
            :src="mainVideoSrc"
            poster="https://via.placeholder.com/640x360?text=Main+Video"
          ></video>
        </div>
        <div class="thumbnail-list">
          <div
            v-for="(thumb, index) in thumbnails"
            :key="index"
            class="thumbnail-item"
            @click="selectVideo(index)"
            :class="{ active: index === selectedIndex }"
          >
            <img :src="thumb.poster" alt="video thumbnail" />
            <div class="title">{{ thumb.title }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- tab区域 -->
    <section class="tabs-section">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="{ active: activeTab === tab }"
          class="tab-btn"
        >
          {{ tab }}
        </button>
      </div>
      <div class="tab-content">
        <div v-for="n in 12" :key="n" class="tab-item" v-if="activeTab">
          {{ activeTab }} 内容示例 {{ n }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const tabs = ["文字", "视频", "图片", "声音"];
const activeTab = ref(tabs[0]);

const thumbnails = [
  {
    title: "视频1",
    poster: "https://via.placeholder.com/120x68?text=Thumb+1",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "视频2",
    poster: "https://via.placeholder.com/120x68?text=Thumb+2",
    src: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    title: "视频3",
    poster: "https://via.placeholder.com/120x68?text=Thumb+3",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "视频4",
    poster: "https://via.placeholder.com/120x68?text=Thumb+4",
    src: "https://www.w3schools.com/html/movie.mp4",
  },
];

const selectedIndex = ref(0);
const mainVideoSrc = ref(thumbnails[0].src);

// 模拟用户登录
const user = ref(null);
function login() {
  user.value = {
    name: "用户昵称",
    avatar: "https://i.pravatar.cc/40?img=3",
  };
}
function selectVideo(index) {
  selectedIndex.value = index;
  mainVideoSrc.value = thumbnails[index].src;
}
</script>

<style scoped>
/* 页面整体背景和字体 */
.explore-page {
  padding: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f6f4f1;
  box-sizing: border-box;
}

/* 页面标题 */
.page-title {
  font-size: 32px;
  font-weight: 900;
  color: #222;
  margin: 24px auto 12px auto;
  max-width: 1280px;
  padding: 0 16px;
}

/* 视频播放器和缩略图 */
.video-wrapper {
  max-width: 1280px;
  margin: 0 auto 24px auto;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
}

.video-preview-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.main-video {
  flex: 2 1 640px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgb(0 0 0 / 0.15);
  aspect-ratio: 16 / 9;
}

.main-video video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.thumbnail-list {
  flex: 1 1 240px;
  max-height: 100%;
  overflow-y: auto;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
}

.thumbnail-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  cursor: pointer;
  border-radius: 8px;
  padding: 6px;
  transition: background-color 0.2s;
}

.thumbnail-item:hover {
  background-color: #e6f0ff;
}

.thumbnail-item.active {
  background-color: #cce4ff;
  box-shadow: 0 0 6px #4a90e2;
}

.thumbnail-item img {
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
  margin-bottom: 6px;
}

.thumbnail-item .title {
  font-size: 14px;
  text-align: center;
  color: #222;
  font-weight: 600;
}

/* tabs区域 */
.tabs-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  border-top: 1px solid #ddd;
  padding-top: 12px;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 20px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  background-color: #eee;
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
}

.tab-btn:hover {
  background-color: #ddd;
}

.tab-btn.active {
  background-color: #4a90e2;
  color: white;
}

.tab-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.tab-item {
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
  font-weight: 600;
  color: #444;
  user-select: none;
  text-align: center;
  padding: 12px;
}

/* 响应式优化 */
@media screen and (max-width: 768px) {
  .video-preview-section {
    flex-direction: column;
  }
  .main-video, .thumbnail-list {
    width: 100%;
    flex: none;
  }
}

</style>
