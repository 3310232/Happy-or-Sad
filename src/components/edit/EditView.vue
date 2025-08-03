<template>
  <div class="editor-container">
    <div class="video-area">
      <div class="video-wrapper">
        <template v-if="videoSrc">
          <video ref="videoRef" controls :src="videoSrc" />
        </template>
        <template v-else>
          <div class="video-placeholder" @click="triggerFileInput">
            <p>点击上传视频</p>
          </div>
        </template>
        <input ref="fileInputRef" type="file" accept="video/*" @change="onFileChange" style="display: none" />
      </div>
    </div>

    <div class="controls-area">
      <div class="time-info">
        Start: {{ formatTime(startTime) }} |
        Current: {{ formatTime(currentTime) }} |
        End: {{ formatTime(duration) }}
      </div>

      <TimelineTrack
        :duration="duration"
        :currentTime="currentTime"
        :startTime="startTime"
        :endTime="endTime"
        @seek="onSeek"
        @update-selection="onUpdateSelection"
      />

      <div class="clip-controls">
        <button @click="setStartPoint" :disabled="!videoSrc">设置起始点</button>
        <button @click="setEndPoint" :disabled="!videoSrc">设置结束点</button>
        <span v-if="startTime !== null && endTime !== null">
          剪辑区间: {{ formatTime(startTime) }} ~ {{ formatTime(endTime) }}
        </span>
      </div>

      <div class="buttons">
        <button @click="cutVideo" :disabled="!videoSrc">剪切</button>
        <button @click="snapshotFrame" :disabled="!videoSrc">截帧</button>
        <button @click="annotateVideo" :disabled="!videoSrc">标注</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import TimelineTrack from './TimelineTrack.vue';

const videoRef = ref<HTMLVideoElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const videoSrc = ref<string>('');
const duration = ref<number>(0);
const currentTime = ref<number>(0);

const startTime = ref<number | null>(null);
const endTime = ref<number | null>(null);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    videoSrc.value = URL.createObjectURL(target.files[0]);
    startTime.value = null;
    endTime.value = null;
    duration.value = 0;
    currentTime.value = 0;

    // 等视频src更新后再绑定事件
    nextTick(() => {
      if (videoRef.value) {
        videoRef.value.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
        videoRef.value.addEventListener('timeupdate', onTimeUpdate);
      }
    });
  }
};

function onLoadedMetadata() {
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
    // 自动重置选区
    startTime.value = 0;
    endTime.value = duration.value;
  }
}

function onTimeUpdate() {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime;
  }
}

const onSeek = (time: number) => {
  if (videoRef.value) {
    videoRef.value.currentTime = time;
  }
  currentTime.value = time;
};

const onUpdateSelection = (start: number, end: number) => {
  startTime.value = start;
  endTime.value = end;
};

const setStartPoint = () => {
  startTime.value = currentTime.value;
  // 如果起始点大于结束点，自动调整结束点
  if (endTime.value !== null && startTime.value > endTime.value) {
    endTime.value = startTime.value;
  }
};

const setEndPoint = () => {
  endTime.value = currentTime.value;
  // 如果结束点小于起始点，自动调整起始点
  if (startTime.value !== null && endTime.value < startTime.value) {
    startTime.value = endTime.value;
  }
};

const formatTime = (seconds: number | null): string => {
  if (seconds === null || isNaN(seconds)) return '--:--';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const cutVideo = () => {
  alert(`剪辑区间: ${formatTime(startTime.value)} ~ ${formatTime(endTime.value)}`);
};

const snapshotFrame = () => alert('截帧功能');
const annotateVideo = () => alert('标注功能');
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f0f0;
}

.video-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.video-wrapper {
  width: 90%;
  max-width: 960px;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  color: #ccc;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.controls-area {
  height: 220px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-info {
  text-align: center;
  font-size: 14px;
  color: #333;
}

.clip-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 14px;
}

.clip-controls button {
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background-color: #f39c12;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clip-controls button:hover {
  background-color: #e67e22;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.buttons button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  transition: background-color 0.3s ease;
}

.buttons button:nth-child(1) {
  background-color: #3498db;
}

.buttons button:nth-child(1):hover {
  background-color: #2980b9;
}

.buttons button:nth-child(2) {
  background-color: #2ecc71;
}

.buttons button:nth-child(2):hover {
  background-color: #27ae60;
}

.buttons button:nth-child(3) {
  background-color: #9b59b6;
}

.buttons button:nth-child(3):hover {
  background-color: #8e44ad;
}
</style>
