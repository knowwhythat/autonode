<template>
  <edit-interaction-base v-bind="{ data }" @change="updateData">
    <el-select
      v-model="data.eventName"
      class="w-full mt-2"
      placeholder="Select an event"
      @change="handleSelectChange"
    >
      <el-option v-for="event in eventList" :key="event.id" :value="event.id" :label="event.name"></el-option>
    </el-select>
    <button
      class="mb-2 block w-full text-left mt-4 focus:ring-0"
      @click="showOptions = !showOptions"
    >
      <i
        class="ri-arrow-left-s-line mr-1 transition-transform align-middle inline-block -ml-1"
        :rotate="showOptions ? 270 : 180"
      />
      <span class="align-middle">Options</span>
    </button>
    <el-collapse-transition>
      <div v-if="showOptions">
        <div class="grid grid-cols-2 gap-2 mb-4">
          <el-checkbox
            v-model="params.bubbles"
            @change="updateParams({ ...params, bubbles: $event })"
          >Bubbles</el-checkbox>
          <el-checkbox
            v-model="params.cancelable"
            @change="updateParams({ ...params, cancelable: $event })"
          >Cancelable</el-checkbox>
        </div>
        <component
          :is="componentName"
          v-if="componentName"
          :params="params"
          @update="updateParams({ ...params, ...$event })"
        />
      </div>
    </el-collapse-transition>
  </edit-interaction-base>
</template>
<script>
import TriggerEventMouse from './event/TriggerEventMouse.vue';
import TriggerEventTouch from './event/TriggerEventTouch.vue';
import TriggerEventWheel from './event/TriggerEventWheel.vue';
import TriggerEventKeyboard from './event/TriggerEventKeyboard.vue';

export default {
  components: {
    TriggerEventMouse,
    TriggerEventWheel,
    TriggerEventTouch,
    TriggerEventKeyboard,
  },
};
</script>
<script setup>
/* eslint-disable */
import { ref } from 'vue';
import { eventList } from '@/utils/shared';
import EditInteractionBase from './EditInteractionBase.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const eventComponents = {
  'mouse-event': 'TriggerEventMouse',
  'focus-event': '',
  'touch-event': 'TriggerEventTouch',
  'keyboard-event': 'TriggerEventKeyboard',
  'wheel-event': 'TriggerEventWheel',
};

const componentName = ref(eventComponents[props.data.eventType]);
const params = ref(props.data.eventParams);
const showOptions = ref(false);

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
function updateParams(value) {
  params.value = value;
  updateData({ eventParams: value });
}
function handleSelectChange(value) {
  const eventType = eventList.find(({ id }) => id === value).type;
  const payload = { eventName: value, eventType };

  componentName.value = eventComponents[eventType];

  if (eventType !== props.eventType) {
    const defaultParams = { bubbles: true, cancelable: true };

    payload.eventParams = defaultParams;
    params.value = defaultParams;
  }

  updateData(payload);
}
</script>
