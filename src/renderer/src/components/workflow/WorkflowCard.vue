<template>
  <el-card shadow="hover" class="transition duration-500 hover:-translate-y-1 hover:scale-105">
    <template #header>
      <div class="cursor-pointer" @click="workflowDetail">
        <div class="flex justify-start items-center">
          <i :class="workflow.icon" class="ri-xl mr-2" />
          <p :title="workflow.name">{{ truncate(workflow.name, { length: 25 }) }}</p>
        </div>
        <p
          class="text-gray-600 dark:text-gray-200 leading-tight text-overflow mt-2"
        >{{ formatDate() }}</p>
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
import { useRouter } from 'vue-router'
import dayjs from '@/utils/dayjs'

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
const formatDate = () => dayjs(props.workflow.createdAt).fromNow();
const menu = [
  { name: '运行', icon: 'ri-play-line', action: 'execute' },
  { name: '导出', icon: 'ri-download-cloud-2-line', action: 'export' },
  { name: '重命名', icon: 'ri-edit-box-line', action: 'rename' },
  { name: '删除', icon: 'ri-delete-bin-5-line', action: 'delete' },
];
</script>