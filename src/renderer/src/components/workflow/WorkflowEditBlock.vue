<template>
  <div class="px-4 overflow-auto scroll pb-1">
    <div class="flex items-center sticky top-0 z-20 bg-white border-b border-gray-100 mb-1">
      <button class="mr-2 align-middle" @click="$emit('close')">
        <i class="ri-arrow-left-line ri-2x" />
      </button>
      <p class="font-semibold inline-block align-middle">{{ data.label || data.name }}</p>
    </div>
    <component :is="data.editComponent" v-if="blockData" v-model:data="blockData" />
  </div>
</template>
<script>
import { computed } from 'vue';

const editComponents = import.meta.globEager('./edit/*.vue')

const components = Object.keys(editComponents).reduce((acc, key) => {
  const name = key.replace(/(.*\/)*([^.]+).*/gi, '$2')
  const componentObj = editComponents[key]?.default ?? {};
  acc[name] = componentObj;
  return acc;
}, {});

export default {
  components,
};
</script>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['close', 'update']);

const blockData = computed({
  get() {
    return props.data.data || {};
  },
  set(value) {
    emit('update', value);
  },
});
</script>
