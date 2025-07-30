<template>
  <div class="chat-view">
    <div class="messages" ref="msgRef">
      <ChatMessage
        v-for="(msg, index) in messages"
        :key="index"
        :message="msg.text"
        :isUser="msg.isUser"
      />
    </div>
    <ChatInput @send="handleSend" />
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";

const messages = ref([{ text: "你好，我是 AI 助手。", isUser: false }]);

const msgRef = ref(null);

function handleSend(text) {
  messages.value.push({ text, isUser: true });
  setTimeout(() => {
    messages.value.push({ text: "收到：" + text, isUser: false });
    nextTick(() => {
      msgRef.value.scrollTop = msgRef.value.scrollHeight;
    });
  }, 500);
}
</script>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fefefe;
}
</style>
