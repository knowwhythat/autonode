<template>
  <edit-interaction-base v-bind="{ data }" @change="updateData">
    <div v-if="!data.scrollIntoView" class="flex items-center mt-3 space-x-2">
      <el-input
        v-model="data.scrollX"
        type="number"
        title="Scroll horizontal"
        @change="updateData({ scrollX: +$event })"
      />
      <el-input
        v-model="data.scrollY"
        type="number"
        title="Scroll vertical"
        @change="updateData({ scrollY: +$event })"
      />
    </div>
    <div class="mt-3 space-y-2">
      <el-checkbox
        class="w-full"
        v-model="data.scrollIntoView"
        @change="updateData({ scrollIntoView: $event })"
      >Scroll into view</el-checkbox>
      <el-checkbox v-model="data.smooth" @change="updateData({ smooth: $event })">Smooth scroll</el-checkbox>
      <template v-if="!data.scrollIntoView">
        <el-checkbox
          v-model="data.incX"
          @change="updateData({ incX: $event })"
        >Increment horizontal scroll</el-checkbox>
        <el-checkbox
          v-model="data.incY"
          @change="updateData({ incY: $event })"
        >Increment vertical scroll</el-checkbox>
      </template>
    </div>
  </edit-interaction-base>
</template>
<script setup>
import EditInteractionBase from './EditInteractionBase.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
</script>
