<template>
  <div class="auth-modal" v-if="visible">
    <div class="modal-mask" @click="onClose" />
    <div class="modal-content">
      <h2 class="modal-title">{{ isRegister ? "Sign Up" : "Sign In" }}</h2>
      <input v-model="username" placeholder="Username" class="input" />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="input"
      />
      <input
        v-if="isRegister"
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="input"
      />
      <button class="submit-btn" @click="onSubmit">
        {{ isRegister ? "Register" : "Login" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  isRegister: Boolean,
});
const emit = defineEmits(["close", "submit"]);

const username = ref("");
const password = ref("");
const confirmPassword = ref("");

function onClose() {
  emit("close");
}

function onSubmit() {
  if (!username.value || !password.value)
    return alert("Please fill all fields");
  if (props.isRegister && password.value !== confirmPassword.value) {
    return alert("Passwords do not match");
  }
  emit("submit", {
    username: username.value,
    password: password.value,
  });
}
</script>

<style scoped>
.auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
}
.modal-mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
}
.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f1efec;
  padding: 30px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.modal-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #241919;
  text-align: center;
}
.input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #556449;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #819670;
}
</style>
