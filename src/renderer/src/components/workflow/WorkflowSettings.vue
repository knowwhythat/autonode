<template>
  <p class="font-semibold mb-2">On workflow error</p>
  <div class="space-x-4">
    <el-radio
      v-for="item in onError"
      :key="item.id"
      v-model="workflow.settings.onError"
      :label="item.id"
      class="mr-4"
      @change="updateWorkflow({ onError: $event })"
    >{{ item.name }}</el-radio>
  </div>
</template>
<script setup>
const props = defineProps({
  workflow: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update']);

const onError = [
  { id: 'keep-running', name: 'Keep workflow running' },
  { id: 'stop-workflow', name: 'Stop workflow' },
];

function updateWorkflow(data) {
  emit('update', {
    settings: { ...props.workflow.settings, ...data },
  });
}
</script>
