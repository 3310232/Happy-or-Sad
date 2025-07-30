<template>
    <div class="chat-container">
        <div class="chat-messages">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
                <div :class="['response-container', { cursor: message.isActive }]">
                    {{ message.text }}
                </div>
            </div>
        </div>
        <div class="chat-input">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
            <button @click="sendMessage">Send</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
const messages = reactive([])
const newMessage = ref('')
const sendMessage = () => {
    let userMsg = newMessage.value
    if (userMsg.trim() === '') {
        return
    }
    messages.push({ text: userMsg, sender: 'user' })
    socket.send(userMsg)

}
onMounted(() => {
    initSocket()
})

const socket = new WebSocket('http://127.0.0.1:8080/test')
const messageHeader = (e) => {

    const resData = JSON.parse(e.data)
    let idx = messages.findIndex(item => item.isActive === true)

    if (!resData.isEnd) {
        if (idx === -1) {
            // 首次响应，创建新消息，并附加当前 data
            messages.push({ text: resData.data, sender: 'bot', isActive: true })
        } else {
            // 追加到现有消息
            messages[idx].text += resData.data
        }
    } else {
        if (idx !== -1) {
            messages[idx].isActive = false
        }
        newMessage.value = ''
    }
}

const openHeader = () => {
    console.log('open')
}
const errorHeader = () => {
    console.log('error')
}
const closeHeader = () => {
    console.log('close')
}
const initSocket = () => {
    socket.onmessage = messageHeader
    socket.onopen = openHeader
    socket.onerror = errorHeader
    socket.onclose = closeHeader
}
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 0 10px;
    background-color: #ffffff;
}

.chat-messages {
    width: 100%;
    max-width: 700px;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message {
    padding: 8px 12px;
    border-radius: 5px;
    max-width: 70%;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.message.user {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
}

.message.bot {
    background-color: #f1f1f1;
    color: black;
    align-self: flex-start;
}

.chat-input {
    display: flex;
    width: 100%;
    max-width: 700px;
    padding: 20px;
    box-sizing: border-box;
    background-color: white;
}

.chat-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.chat-input button {
    margin-left: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.chat-input button:hover {
    background-color: #0056b3;
}

.response-container {
    font-family: monospace;
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