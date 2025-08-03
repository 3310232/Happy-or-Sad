<template>
  <div class="about-page">
    <section class="origin">
      <h2>About "Happy or Sad"</h2>
      <p>
        The name <strong>Happy or Sad</strong> comes from a profound moment in
        the series <em>Peaky Blinders</em>.<br />
        Grace once asked Tommy: <em>“Happy or sad?”</em><br />
        Tommy replied: <strong>“Sad.”</strong><br /><br />
        This short dialogue reflects a truth about life — it's not always happy,
        and that's okay. Sometimes, sadness is the baseline of existence. Yet we
        live on, we create, we connect.
      </p>
    </section>

    <section class="community">
      <h2>Our Community</h2>
      <p>
        <strong>Happy or Sad</strong> is a space for genuine expression. Whether
        you're feeling joy, confusion, sorrow, or inspiration — you're welcome
        here. <br /><br />
        Members of our community are free to:
      </p>
      <ul>
        <li>📖 Write articles about ideas, experiences, or reflections</li>
        <li>🖼️ Share images that speak louder than words</li>
        <li>🎬 Post videos that capture emotions and stories</li>
        <li>💬 Discuss openly with respect and empathy</li>
      </ul>
      <p>
        Here, you don’t have to be perfect. You just have to be real.<br />
        We believe in vulnerability, creativity, and the courage to speak your
        truth.
      </p>
    </section>

    <section class="author">
      <h2>About the Author</h2>
      <div class="author-content">
        <div
          class="avatar-wrapper"
          @click="onPushClick"
          :class="{ pushing: isPushing }"
        >
          <img
            class="avatar"
            src="../assets/avatar.jpg"
            alt="Author Avatar"
            loading="lazy"
          />
          <button class="push-btn" @click.stop="onPushClick">Push</button>
        </div>
        <div class="author-text">
          <p>
            <strong>hs</strong> is the creator behind <em>Happy or Sad</em>. A
            graduate student at <strong>Zhejiang Sci-Tech University</strong>,
            currently in the final year of postgraduate study.
          </p>
          <p>
            He enjoys competitive games like <em>DOTA</em>, <em>CS</em>,
            <em>PUBG</em>, and <em>Hearthstone Battlegrounds</em>, suspense
            films, and follows the variety show <em>“Five Ha”</em>. Currently
            interning at a major tech company, hs focuses on front-end
            development, aspiring to become a full-stack engineer.
          </p>
          <p>
            He has published a paper titled:
            <em>
              “Edge and Semantic Collaboration Framework with Cross Coordination
              Attention for Co-saliency Detection”
            </em>
            in <strong>KBS</strong>, a top-tier journal (Zone 1).
          </p>
        </div>
      </div>
    </section>

    <section class="contact">
      <h2>Contact the Author</h2>
      <p>Email: <a href="mailto:wangqihzx@qq.com">wangqihzx@qq.com</a></p>
      <p>WeChat: <code>wqh2022c</code></p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isPushing = ref(false);

function onPushClick() {
  if (isPushing.value) return; // 防止连续点击动画叠加
  isPushing.value = true;
  // 2秒动画结束后复位状态
  setTimeout(() => {
    isPushing.value = false;
  }, 2000);
  alert("Push clicked! You can customize this action.");
}
</script>

<style scoped>
.about-page {
  max-width: 900px; /* 调整最大宽度，避免大屏幕太空 */
  margin: 40px auto;
  padding: 0 20px;
  color: #241919;
  font-family: "Helvetica Neue", sans-serif;
  line-height: 1.6;
}

h2 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #241919;
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

li {
  margin-bottom: 10px;
  font-size: 16px;
}

/* 作者部分 */
.author-content {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-top: 12px;
}

/* 头像改为正方形+圆角12px */
.avatar-wrapper {
  position: relative;
  width: 120px;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 0 3px #556449;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
}

.avatar-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px 3px #819670;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

/* Push 按钮 */
.push-btn {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  background-color: #556449;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0;
  pointer-events: none;
}

.avatar-wrapper:hover .push-btn {
  transform: translateX(-50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}

/* 点击push的动画 */
@keyframes pushBounce {
  0% {
    transform: translateX(-50%) scale(1);
  }
  30% {
    transform: translateX(-50%) scale(1.3);
  }
  60% {
    transform: translateX(-50%) scale(0.9);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

.avatar-wrapper.pushing .push-btn {
  animation: pushBounce 0.6s ease forwards;
}

/* 作者文字 */
.author-text p {
  margin-bottom: 1em;
}

/* 联系方式 */
a {
  color: #556449;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

code {
  background-color: #e7e4d8;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
