<template>
  <el-card shadow="hover">
    <template #header>
      <div class="flex justify-start cursor-pointer items-center" @click="workflowDetail">
        <i :class="workflow.icon" class="ri-xl mr-2" />
        <p :title="workflow.name">{{ truncate(workflow.name, { length: 25 }) }}</p>
      </div>
    </template>
    <div class="flex items-center justify-between">
      <i
        class="ri-xl cursor-pointer"
        v-for="item in menu"
        :title="item.name"
        :key="item.action"
        :class="item.icon"
        @click="$emit(item.action, workflow)"
      />
    </div>
  </el-card>
</template>
<script setup>
import { truncate } from 'lodash'
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  workflow: {
    type: Object,
    default: () => ({}),
  },
  showDetails: {
    type: Boolean,
    default: true,
  },
});
defineEmits(['delete', 'export', 'rename', 'execute']);
function workflowDetail() {
  router.push({ path: "detail/" + props.workflow.workflowId })
}
const menu = [
  { name: '运行', icon: 'ri-play-line', action: 'execute' },
  { name: '导出', icon: 'ri-download-cloud-2-line', action: 'export' },
  { name: '重命名', icon: 'ri-edit-box-line', action: 'rename' },
  { name: '删除', icon: 'ri-delete-bin-5-line', action: 'delete' },
];
</script>