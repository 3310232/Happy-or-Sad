<template>
  <div class="timeline-track" ref="timelineRef" @click="onTrackClick">
    <!-- 缩略图轨道 -->
    <div class="thumbnail-track" ref="thumbTrack">
      <div
        v-for="(thumb, idx) in thumbnails"
        :key="idx"
        class="thumbnail"
        :style="{ left: thumb.left, backgroundImage: `url(${thumb.url})` }"
      ></div>
    </div>

    <!-- 刻度 -->
    <div
      class="tick"
      v-for="(tick, index) in ticks"
      :key="index"
      :style="{ left: tick.left }"
    >
      {{ tick.timeLabel }}
    </div>

    <!-- 剪辑选区 -->
    <div
      v-if="startTime !== null && endTime !== null"
      class="selection"
      :style="selectionStyle"
      @mousedown.stop="onDragStart"
    ></div>

    <!-- 播放滑块 -->
    <div class="scrubber" :style="{ left: scrubberLeft }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps<{
  duration: number;
  currentTime: number;
  startTime: number | null;
  endTime: number | null;
}>();

const emit = defineEmits<{
  (e: 'seek', time: number): void;
  (e: 'update-selection', start: number, end: number): void;
}>();

const timelineRef = ref<HTMLElement | null>(null);
const thumbTrack = ref<HTMLElement | null>(null);

const scrubberLeft = computed(() => {
  if (!props.duration) return '0%';
  const percent = (props.currentTime / props.duration) * 100;
  return `${percent.toFixed(2)}%`;
});

const ticks = ref<{ left: string; timeLabel: string }[]>([]);

watch(
  () => props.duration,
  (newDur) => {
    if (!newDur || newDur === 0) {
      ticks.value = [];
      return;
    }
    const tickCount = 11;
    const interval = newDur / (tickCount - 1);
    ticks.value = Array.from({ length: tickCount }, (_, i) => ({
      left: `${(i / (tickCount - 1)) * 100}%`,
      timeLabel: formatTime(i * interval)
    }));
  },
  { immediate: true }
);

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const onTrackClick = (e: MouseEvent) => {
  if (!timelineRef.value || !props.duration) return;
  const rect = timelineRef.value.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const newTime = percent * props.duration;
  emit('seek', newTime);
};

const selectionStyle = computed(() => {
  if (props.startTime === null || props.endTime === null || !props.duration) return {};
  const left = (props.startTime / props.duration) * 100;
  const width = ((props.endTime - props.startTime) / props.duration) * 100;
  return { left: `${left}%`, width: `${width}%` };
});

// 拖拽剪辑选区逻辑
let isDragging = false;
let dragStartX = 0;
let initialLeftPx = 0;
let initialWidthPx = 0;

const onDragStart = (e: MouseEvent) => {
  if (!timelineRef.value) return;
  isDragging = true;
  dragStartX = e.clientX;

  const rect = timelineRef.value.getBoundingClientRect();
  initialLeftPx = (props.startTime! / props.duration) * rect.width;
  initialWidthPx = ((props.endTime! - props.startTime!) / props.duration) * rect.width;

  document.addEventListener('mousemove', onDragging);
  document.addEventListener('mouseup', onDragEnd);
};

const onDragging = (e: MouseEvent) => {
  if (!isDragging || !timelineRef.value || !props.duration) return;
  const rect = timelineRef.value.getBoundingClientRect();
  let deltaX = e.clientX - dragStartX;
  let newLeft = initialLeftPx + deltaX;

  // 限制拖动范围，保持宽度不变
  newLeft = Math.max(0, Math.min(newLeft, rect.width - initialWidthPx));

  const newStart = (newLeft / rect.width) * props.duration;
  const newEnd = ((newLeft + initialWidthPx) / rect.width) * props.duration;

  emit('update-selection', newStart, newEnd);
};

const onDragEnd = () => {
  isDragging = false;
  document.removeEventListener('mousemove', onDragging);
  document.removeEventListener('mouseup', onDragEnd);
};

// 简单生成缩略图（这里模拟，真实项目要通过canvas或ffmpeg生成）
const thumbnails = ref<{ left: string; url: string }[]>([]);

watch(
  () => props.duration,
  (newDur) => {
    thumbnails.value = [];
    if (!newDur || newDur === 0) return;

    const thumbCount = 10;
    for (let i = 0; i < thumbCount; i++) {
      // 这里用同一张示例图，实际可改为视频帧截图URL
      thumbnails.value.push({
        left: `${(i / (thumbCount - 1)) * 100}%`,
        url: 'https://via.placeholder.com/60x34?text=Frame' + (i + 1)
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.timeline-track {
  position: relative;
  width: 100%;
  height: 60px;
  background-color: #eaeaea;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  padding-top: 24px;
}

/* 缩略图轨道 */
.thumbnail-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 100%;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  background: #ddd;
}

.thumbnail {
  position: absolute;
  top: 0;
  width: 10%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-right: 1px solid #fff;
}

.tick {
  position: absolute;
  top: 30px;
  transform: translateX(-50%);
  font-size: 12px;
  color: #333;
  user-select: none;
}

.tick::after {
  content: '|';
  display: block;
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 2px;
}

.scrubber {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #409eff;
  transition: left 0.1s linear;
  z-index: 10;
}

.selection {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: rgba(255, 165, 0, 0.5);
  cursor: grab;
  z-index: 5;
  border-radius: 4px;
}
</style>
