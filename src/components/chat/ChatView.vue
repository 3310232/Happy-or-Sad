<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div v-if="messages.length === 0" class="empty-chat">
        <div class="empty-chat-box">
          <h2>我是 Happy or Sad，很高兴认识你！</h2>
          <p class="intro">我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</p>

          <textarea
            v-model="newMessage"
            placeholder="请在这里输入你的问题或任务..."
            rows="5"
            class="empty-input"
          ></textarea>

          <button @click="sendMessage" class="send-btn">Send</button>
        </div>
      </div>

      <div v-else>
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
          <div :class="['response-container', { cursor: message.isActive }]">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- 有消息后底部输入栏 -->
    <div v-if="messages.length > 0" class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 定义消息类型
interface Message {
  text: string
  sender: 'user' | 'bot'
  isActive?: boolean
}

// 响应式消息列表
const messages = reactive<Message[]>([])

// 输入框绑定值
const newMessage = ref('')

// WebSocket 实例
let socket: WebSocket

// 发送消息
const sendMessage = () => {
  const userMsg = newMessage.value.trim()
  if (!userMsg) return

  // 推送用户消息
  messages.push({ text: userMsg, sender: 'user' })

  // 发送给 WebSocket 服务端
  socket?.send(userMsg)

  // 清空输入框
  newMessage.value = ''
}

// WebSocket 消息处理函数
const messageHeader = (e: MessageEvent) => {
  const resData = JSON.parse(e.data) as {
    data: string
    isEnd: boolean
  }

  const idx = messages.findIndex((item) => item.isActive)

  if (!resData.isEnd) {
    if (idx === -1) {
      // 首次响应
      messages.push({
        text: resData.data,
        sender: 'bot',
        isActive: true,
      })
    } else {
      messages[idx].text += resData.data
    }
  } else {
    if (idx !== -1) {
      messages[idx].isActive = false
    }
  }
}

// WebSocket 生命周期钩子
const openHeader = () => {
  console.log('WebSocket open')
}
const errorHeader = () => {
  console.log('WebSocket error')
}
const closeHeader = () => {
  console.log('WebSocket close')
}

// 初始化 WebSocket
const initSocket = () => {
  socket = new WebSocket('ws://localhost:8080/chats/ws')
  socket.onmessage = messageHeader
  socket.onopen = openHeader
  socket.onerror = errorHeader
  socket.onclose = closeHeader
}

// 初始化时连接 socket
onMounted(() => {
  initSocket()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  padding: 0 10px;
  background-color: #e9e9e980;
  backdrop-filter: blur(8px);
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
  /* 新增滚动条样式更美观 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
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

.message {
  padding: 12px 18px;
  border-radius: 20px;
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.07);
  transition: background-color 0.2s ease;
}

.message.user {
  background-color: #a0d995;
  color: #1f2d1f;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message.bot {
  background-color: #fff;
  color: #333;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.chat-input {
  display: flex;
  width: 100%;
  max-width: 900px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.1);
}

.chat-input input {
  flex: 1;
  padding: 14px 20px;
  border: 1.8px solid #ccc;
  border-radius: 24px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.chat-input input:focus {
  border-color: var(--primary-color, #3498db);
  box-shadow: 0 0 8px var(--primary-color, #3498db);
}

.chat-input button {
  margin-left: 16px;
  padding: 14px 28px;
  background-color: var(--primary-color, #3498db);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 14px rgb(52 152 219 / 0.4);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.chat-input button:hover {
  background-color: var(--primary-color-hover, #2980b9);
  box-shadow: 0 6px 20px rgb(41 128 185 / 0.6);
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
  background-color: rgba(255 255 255 / 0.9);
  color: #333;
  font-size: 18px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.1);
}

.empty-chat-box h2 {
  font-size: 28px;
  margin-bottom: 14px;
  font-weight: 700;
}

.intro {
  margin-bottom: 28px;
  color: #555;
  line-height: 1.5;
}

.empty-input {
  width: 100%;
  padding: 14px 18px;
  font-size: 17px;
  border: 1.8px solid #ccc;
  border-radius: 16px;
  resize: none;
  margin-bottom: 28px;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.empty-input:focus {
  border-color: var(--primary-color, #3498db);
  box-shadow: 0 0 10px var(--primary-color, #3498db);
  outline: none;
}

.send-btn {
  padding: 14px 40px;
  background-color: var(--primary-color, #3498db);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 15px rgb(52 152 219 / 0.5);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.send-btn:hover {
  background-color: var(--primary-color-hover, #2980b9);
  box-shadow: 0 7px 22px rgb(41 128 185 / 0.7);
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
