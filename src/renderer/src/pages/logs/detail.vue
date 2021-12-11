<template>
  <el-table :data="logs" style="width: 100%">
    <el-table-column prop="currentBlock.name" label="节点名称" />
    <el-table-column prop="startedTimestamp" label="开始时间" :formatter="formatTime" />
    <el-table-column prop="isDestroyed" label="状态" />
  </el-table>
</template>

<script setup>
import dayjs from '@/utils/dayjs'
const props = defineProps({
  logs: {
    type: Array,
    default: () => ([]),
  }
});

function formatTime(row, column) {
  return dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss')
}
</script>