<template>
  <el-input
    type="textarea"
    v-model="data.description"
    autoresize
    placeholder="Description"
    class="w-full mb-2"
    @change="updateData({ description: $event })"
  />
  <el-select
    v-model="data.type"
    placeholder="Trigger workflow"
    class="w-full"
    @change="handleSelectChange"
  >
    <el-option v-for="trigger in triggers" :key="trigger.id" :value="trigger.id">{{ trigger.name }}</el-option>
  </el-select>
  <el-collapse-transition name="out-in">
    <div v-if="data.type === 'interval'" class="flex items-center mt-1">
      <el-input
        v-model="data.interval"
        type="number"
        class="w-full mr-2"
        title="Interval (minutes)"
        placeholder="5-120"
        min="10"
        max="120"
        @change="
          updateIntervalInput($event, { key: 'interval', min: 10, max: 120 })
        "
      />
      <el-input
        v-model="data.delay"
        type="number"
        class="w-full"
        label="Delay (minutes)"
        min="0"
        max="20"
        placeholder="0-20"
        @change="updateIntervalInput($event, { key: 'delay', min: 0, max: 20 })"
      />
    </div>
    <div v-else-if="data.type === 'date'" class="mt-2">
      <el-input
        v-model="data.date"
        :max="maxDate"
        :min="minDate"
        class="w-full"
        type="date"
        placeholder="Date"
        @change="updateDate({ date: $event })"
      />
      <el-input
        v-model="data.time"
        type="time"
        class="w-full mt-2"
        placeholder="Time"
        @change="updateData({ time: $event || '00:00' })"
      />
    </div>
    <div v-else-if="data.type === 'visit-web'" class="mt-2">
      <el-input
        v-model="data.url"
        placeholder="URL or Regex"
        class="w-full"
        @change="updateData({ url: $event })"
      />
      <el-checkbox
        v-model="data.isUrlRegex"
        class="mt-1"
        @change="updateData({ isUrlRegex: $event })"
      >Use regex</el-checkbox>
    </div>
    <div v-else-if="data.type === 'keyboard-shortcut'" class="mt-2">
      <div class="flex items-center mb-2">
        <el-input v-model="recordKeys.keys" readonly class="flex-1 mr-2" placeholder="Shortcut" />
        <el-button title="Record shortcut" icon @click="toggleRecordKeys">
          <i :class="recordKeys.isRecording ? 'ri-stop-line' : 'ri-record-circle-line'" />
        </el-button>
      </div>
      <el-checkbox
        v-model="data.activeInInput"
        class="mb-1"
        title="Execute shortcut even in an input element"
        @change="updateData({ activeInInput: $event })"
      >Active while in input</el-checkbox>
      <p
        class="mt-4 leading-tight text-gray-600 dark:text-gray-200"
      >Note: keyboard shortcut only executed when you're on a webpage</p>
    </div>
  </el-collapse-transition>
</template>
<script setup>
import { shallowReactive, onUnmounted } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const triggers = [
  { id: 'manual', name: 'Manually' },
  { id: 'interval', name: 'Interval' },
  { id: 'date', name: 'On specific date' },
  { id: 'visit-web', name: 'When visit a website' },
  { id: 'keyboard-shortcut', name: 'Keyboard shortcut' },
];
const maxDate = dayjs().add(30, 'day').format('YYYY-MM-DD');
const minDate = dayjs().format('YYYY-MM-DD');
const allowedKeys = {
  '+': 'plus',
  Delete: 'del',
  Insert: 'ins',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowRight: 'right',
  Escape: 'escape',
  Enter: 'enter',
};

const recordKeys = shallowReactive({
  isRecording: false,
  keys: props.data.shortcut,
});

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
function handleKeydownEvent(event) {
  event.preventDefault();
  event.stopPropagation();

  if (event.repeat) return;

  const keys = [];
  const { ctrlKey, altKey, metaKey, shiftKey, key } = event;

  if (ctrlKey || metaKey) keys.push('mod');
  if (altKey) keys.push('alt');
  if (shiftKey) keys.push('shift');

  const isValidKey = !!allowedKeys[key] || /^[a-z0-9,./;'[\]\-=`]$/i.test(key);

  if (isValidKey) {
    keys.push(allowedKeys[key] || key.toLowerCase());

    recordKeys.keys = keys.join('+');
    updateData({ shortcut: recordKeys.keys });
  }
}
function toggleRecordKeys() {
  if (recordKeys.isRecording) {
    window.removeEventListener('keydown', handleKeydownEvent);
  } else {
    window.addEventListener('keydown', handleKeydownEvent);
  }

  recordKeys.isRecording = !recordKeys.isRecording;
}
function handleSelectChange(type) {
  if (recordKeys.isRecording) {
    window.removeEventListener('keydown', handleKeydownEvent);
    recordKeys.isRecording = false;
  }

  updateData({ type });
}
function updateIntervalInput(value, { key, min, max }) {
  let num = +value;

  if (num < min) num = min;
  else if (num > max) num = max;

  updateData({ [key]: num });
}
function updateDate(value) {
  if (!value) return;

  let date = value?.date ?? minDate;

  if (dayjs(minDate).isAfter(date)) date = minDate;
  else if (dayjs(maxDate).isBefore(date)) date = maxDate;

  updateData({ date });
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydownEvent);
});
</script>
