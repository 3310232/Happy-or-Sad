<script setup lang="ts">
import { ref } from "vue";
import { login } from '../api/userApi';

const showDialog = ref(false);
const isLoginMode = ref(true);

const username = ref("hs");
const password = ref("123456");
const confirmPwd = ref("");
const errorMsg = ref("");

function resetForm() {
  username.value = "";
  password.value = "";
  confirmPwd.value = "";
  errorMsg.value = "";
}

function signIn() {
  isLoginMode.value = true;
  showDialog.value = true;
}

function toggleMode() {
  isLoginMode.value = !isLoginMode.value;
  resetForm();
}

function closeDialog() {
  showDialog.value = false;
  resetForm();
}



async function submit() {
  errorMsg.value = "";

  const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username.value)) {
    errorMsg.value = "用户名只能包含中文、英文或数字";
    return;
  }

  if (password.value.length < 6 || password.value.length > 15) {
    errorMsg.value = "密码需为 6~15 位字符";
    return;
  }

  if (!isLoginMode.value && confirmPwd.value !== password.value) {
    errorMsg.value = "两次输入的密码不一致";
    return;
  }

  try {
    const result = await login(username.value, password.value);
    console.log("登录成功:", result);

    // 假设后端返回了 token
    localStorage.setItem('token', JSON.stringify(result?.token));

    closeDialog();

    // 登录成功后的跳转或状态处理
  } catch (error:any) {
    console.error("登录失败:", error);
    errorMsg.value = error.message || "登录失败，请检查用户名和密码";
  }
}

</script>

<template>
  <header class="topbar">
    <div class="topbar-title"></div>
    <button class="sign-in-btn" @click="signIn">Sign In</button>

    <div v-if="showDialog" class="dialog-backdrop" @click.self="closeDialog">
      <div class="dialog">
        <h2>{{ isLoginMode ? "Sign In" : "Register" }}</h2>
        <form @submit.prevent="submit">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            required
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
          <input
            v-if="!isLoginMode"
            v-model="confirmPwd"
            type="password"
            placeholder="Confirm Password"
            required
          />
          <!-- 提示预留空间，避免跳动 -->
          <div class="error-msg">{{ errorMsg || "\u00A0" }}</div>
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
  </header>
</template>

<style scoped>
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
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.sign-in-btn:hover {
  background-color: var(--primary-color-hover);
}

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
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.dialog button:hover {
  background-color: var(--primary-color-hover);
}

.toggle-link {
  margin-top: 10px;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
}

.error-msg {
  min-height: 20px;
  font-size: 13px;
  color: #c0392b;
  margin-top: 4px;
  text-align: left;
}


</style>
