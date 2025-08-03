<script setup lang="ts">
import { ref, onMounted } from "vue";

// 预设颜色列表
const presetColors: string[] = ["#556449", "#819670", "#c9ccb4", "#dbddc5", "#241919"];
const selectedColor = ref<string>(presetColors[0]);
const customColor = ref<string>("");

const currentPwd = ref<string>("");
const newPwd = ref<string>("");
const confirmPwd = ref<string>("");

/**
 * 应用主题颜色
 * @param color - 颜色代码（如 #ff6600）
 */
function applyTheme(color: string): void {
  selectedColor.value = color;
  document.documentElement.style.setProperty("--primary-color", color);
  const hoverColor = generateHoverColor(color);
  document.documentElement.style.setProperty("--primary-color-hover", hoverColor);
  localStorage.setItem("theme-color", color);
}

/**
 * 生成悬浮状态颜色（稍微加亮）
 * @param hex - 颜色的十六进制表示（如 #556449）
 * @returns 亮色（rgb格式）或原始颜色
 */
function generateHoverColor(hex: string): string {
  try {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c.split("").map((s) => s + s).join("");
    }
    const num = parseInt(c, 16);
    const r = Math.min(255, (num >> 16) + 20);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + 20);
    const b = Math.min(255, (num & 0x0000ff) + 20);
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return hex;
  }
}

/**
 * 保存设置（模拟保存）
 */
function saveSettings(): void {
  alert("设置已保存");
}

// 加载本地存储的主题颜色
onMounted(() => {
  const saved = localStorage.getItem("theme-color");
  if (saved) applyTheme(saved);
});
</script>

<template>
  <div class="settings-page">
    <h2>设置</h2>

    <!-- 主题设置 -->
    <section class="section">
      <h3>主题颜色</h3>
      <div class="color-palette">
        <div
          v-for="color in presetColors"
          :key="color"
          class="color-swatch"
          :style="{
            backgroundColor: color,
            border:
              selectedColor === color ? '2px solid #241919' : '1px solid #ccc',
          }"
          @click="applyTheme(color)"
        />
      </div>
      <input
        class="custom-color-input"
        v-model="customColor"
        placeholder="或输入自定义颜色，如 #ff6600"
        @blur="customColor && applyTheme(customColor)"
      />
    </section>

    <!-- 修改密码 -->
    <section class="section">
      <h3>修改密码</h3>
      <input type="password" v-model="currentPwd" placeholder="当前密码" />
      <input type="password" v-model="newPwd" placeholder="新密码" />
      <input type="password" v-model="confirmPwd" placeholder="确认新密码" />
    </section>

    <!-- 保存按钮 -->
    <button class="save-btn" @click="saveSettings">保存设置</button>
  </div>
</template>

<style scoped>
.settings-page {
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  color: var(--text-color, #241919);
}

h2 {
  font-size: 24px;
  margin-bottom: 24px;
}

.section {
  margin-bottom: 32px;
}

.color-palette {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 8px;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;
}

.custom-color-input,
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.save-btn {
  background-color: var(--primary-color, #556449);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: var(--primary-color-hover, #819670);
}
</style>
