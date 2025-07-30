<template>
  <div :class="['chat-message', isUser ? 'user' : 'ai']">
    <div class="bubble">{{ message }}</div>
  </div>
</template>

<script setup>
defineProps({
  message: String,
  isUser: Boolean,
});
</script>

<style scoped>
.chat-message {
  display: flex;
  margin-bottom: 10px;
}
.user {
  justify-content: flex-end;
}
.ai {
  justify-content: flex-start;
}
.bubble {
  padding: 10px 14px;
  border-radius: 8px;
  max-width: 60%;
  line-height: 1.4;
  background-color: #e1e1e1;
}
.user .bubble {
  background-color: #007bff;
  color: white;
}
</style>
