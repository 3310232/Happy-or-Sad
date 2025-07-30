<template>
  <div class="chat-input">
    <input
      v-model="input"
      @keydown.enter="handleSend"
      type="text"
      placeholder="输入内容..."
    />
    <button @click="handleSend">发送</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const input = ref("");
const emit = defineEmits(["send"]);

function handleSend() {
  if (input.value.trim()) {
    emit("send", input.value);
    input.value = "";
  }
}
</script>

<style scoped>
.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #fff;
}
.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
.chat-input button {
  margin-left: 10px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
</style>
