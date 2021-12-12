<template>
  <el-table :data="logs" style="width: 100%">
    <el-table-column prop="currentBlock.name" label="节点名称" />
    <el-table-column prop="duration" label="耗时" :formatter="formatDuration" />
    <el-table-column prop="status" label="状态">
      <template #default="scope">
        <el-tag effect="dark" type="danger" v-if="scope.row.isFailed">失败</el-tag>
        <el-tag effect="dark" type="info" v-else-if="scope.row.isPaused">暂停</el-tag>
        <el-tag effect="dark" type="success" v-else="scope.row.isDestroyed">成功</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const props = defineProps({
  logs: {
    type: Array,
    default: () => ([]),
  }
});

function formatDuration(row, column) {
  const duration = row.duration / 1000
  const minutes = parseInt((duration / 60) % 60, 10);
  const seconds = parseInt(duration % 60, 10);

  const getText = (num, suffix) => (num > 0 ? `${num}${suffix}` : '');

  return `${getText(minutes, '分钟')} ${seconds}秒`;
}
</script>