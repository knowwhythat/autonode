<template>
  <div>
    <el-table
      :data="logs"
      :default-sort="{ prop: 'startTime', order: 'descending' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="工作流名称">
        <template #default="scope">
          <div class="flex items-center cursor-pointer" @click="showDetail(scope.row)">
            <i :class="scope.row.icon" class="ri-2x" />
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="执行时间" :formatter="formatTime" sortable />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status === 'success'">成功</el-tag>
          <el-tag effect="dark" type="warning" v-else-if="scope.row.status === 'executing'">执行中</el-tag>
          <el-tag effect="dark" type="info" v-else-if="scope.row.status === 'pause'">暂停</el-tag>
          <el-tag effect="dark" type="danger" v-else="scope.row.status === 'fail'">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="耗时" :formatter="formatDuration" />
    </el-table>
    <el-dialog v-model="dialogDetailVisible" :title="selectItem.name">
      <DetailLog :logs="selectItem.logs" />
    </el-dialog>
  </div>
</template>

<script setup>
import DetailLog from './detail.vue';
import dayjs from '@/utils/dayjs'
import { ref, computed } from 'vue'
import { useStore } from 'vuex';

const props = defineProps({
  workflowId: {
    type: String,
    default: () => (''),
  }
});


const selectItem = ref({})
const dialogDetailVisible = ref(false)

const store = useStore();
const logs = computed(() => (
  props.workflowId ?
    (store.state.workflow.logs[props.workflowId] || [])
    : Object.values(store.state.workflow.logs)).reduce((a, b) => a.concat(b), [])
)

function formatTime(row, column) {
  return dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss')
}

function showDetail(row) {
  selectItem.value = row
  dialogDetailVisible.value = true
}


function formatDuration(row, column) {
  const duration = row.duration / 1000
  const minutes = parseInt((duration / 60) % 60, 10);
  const seconds = parseInt(duration % 60, 10);

  const getText = (num, suffix) => (num > 0 ? `${num}${suffix}` : '');

  return `${getText(minutes, '分钟')} ${seconds}秒`;
}
</script>