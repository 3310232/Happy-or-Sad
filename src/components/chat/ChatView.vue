<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div v-if="messages.length === 0" class="empty-chat">
        <div class="empty-chat-box">
          <h2>我是 Happy or Sad，很高兴认识你！</h2>
          <p class="intro">我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</p>

          <textarea
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="请在这里输入你的问题或任务..."
            rows="5"
            class="empty-input"
          ></textarea>

          <button @click="sendMessage" class="send-btn">Send</button>
        </div>
      </div>

      <div v-else>
        <div v-for="(message, index) in messages" :key="index" :class="['message-wrapper', message.sender]">
  <div :class="['message', message.sender]">
    <div :class="['response-container', { cursor: message.isActive }]">
      {{ message.text }}
    </div>
  </div>
</div>

      </div>
    </div>

    <div v-if="messages.length > 0" class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Message {
  text: string
  sender: 'user' | 'bot'
  isActive?: boolean
}

const messages = reactive<Message[]>([])
const newMessage = ref('')
let socket: WebSocket

const sendMessage = () => {
  const userMsg = newMessage.value.trim()
  if (!userMsg) return
  messages.push({ text: userMsg, sender: 'user' })
  socket?.send(userMsg)
  newMessage.value = ''
}

const messageHeader = (e: MessageEvent) => { 
  const resData = JSON.parse(e.data) as { data?: string; isEnd: boolean }

  let cleanData = resData.data
  if (resData.data) {
    // 先去除 <think> 标签
    cleanData = resData.data.replace(/<think>|<\/think>/g, '')
    // 去掉开头空格（包括空格、制表符等所有空白字符）
    cleanData = cleanData.replace(/^\s+/, '')
  }

  const idx = messages.findIndex((item) => item.isActive)

  if (!resData.isEnd) {
    if (idx === -1) {
      messages.push({ text: cleanData, sender: 'bot', isActive: true })
    } else {
      messages[idx].text += cleanData
    }
  } else {
    if (idx !== -1) messages[idx].isActive = false
  }
}

const openHeader = () => console.log('WebSocket open')
const errorHeader = () => console.log('WebSocket error')
const closeHeader = () => console.log('WebSocket close')

const initSocket = () => {
  socket = new WebSocket('ws://localhost:8080/chats/ws')
  socket.onmessage = messageHeader
  socket.onopen = openHeader
  socket.onerror = errorHeader
  socket.onclose = closeHeader
}

onMounted(() => {
  initSocket()
})
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  background-color: #ffffff;
}

.chat-messages {
  width: 100%;
  max-width: 900px;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 4px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.bot {
  justify-content: flex-start;
}

.message {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 15px;
  line-height: 1.5;
}

.message.user {
  background-color: #eff6ff;
  color: #222;
  border-top-right-radius: 4px;
}

.message.bot {
  background-color: #f5f5f5;
  color: #333;
  border-top-left-radius: 4px;
}

.chat-input {
  display: flex;
  width: 100%;
  max-width: 900px;
  padding: 16px 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 12px 18px;
  border: 1.5px solid #ddd;
  border-radius: 20px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.chat-input input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 6px var(--primary-color);
}

.chat-input button {
  margin-left: 12px;
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(138, 180, 248, 0.3);
  transition: filter 0.3s ease;
}

.chat-input button:hover {
  background-color: var(--primary-color-hover);
}

/* 空聊天状态样式 */
.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.empty-chat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 900px;
  padding: 30px 40px;
  border-radius: 16px;
  background-color: #f9f9f9;
  color: #333;
  font-size: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.empty-chat-box h2 {
  font-size: 26px;
  margin-bottom: 14px;
  font-weight: 700;
}

.intro {
  margin-bottom: 24px;
  color: #555;
  line-height: 1.5;
}

.empty-input {
  width: 100%;
  padding: 14px 18px;
  font-size: 16px;
  border: 1.5px solid #ddd;
  border-radius: 14px;
  resize: none;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.empty-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 8px var(--primary-color);
  outline: none;
}

.send-btn {
  padding: 12px 32px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(138, 180, 248, 0.4);
  transition: filter 0.3s ease;
}

.send-btn:hover {
  background-color: var(--primary-color-hover);
}

.response-container {
  font-family: monospace;
  white-space: pre-wrap;
}

@keyframes blink {
  0%, 100% {
    border-right-color: transparent;
  }
  50% {
    border-right-color: #000;
  }
}

.response-container.cursor {
  animation: blink 0.75s step-end infinite;
}
</style>
