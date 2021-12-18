<template>
  <div class="flex mb-4">
    <el-input
      v-model.lowercase="state.query"
      autofocus
      placeholder="Search or add column"
      class="mr-2 flex-1"
      @keyup.enter="addColumn"
      @keyup.esc="$emit('close')"
    />
    <el-button type="primary" @click="addColumn">Add</el-button>
  </div>
  <ul class="space-y-2 overflow-y-auto scroll py-1" style="max-height: calc(100vh - 10rem)">
    <li v-for="(column, index) in columns" :key="column.name" class="flex items-center space-x-2">
      <el-input v-model="columns[index].name" disabled class="flex-1" placeholder="Column name" />
      <el-select v-model="columns[index].type" class="flex-1" placeholder="Data type">
        <el-option v-for="type in dataTypes" :key="type.id" :value="type.id" :label="type.name"></el-option>
      </el-select>
      <button @click="state.columns.splice(index, 1)">
        <i class="ri-delete-bin-7-line ri-2x text-red-600" />
      </button>
    </li>
  </ul>
</template>
<script setup>
import { computed, onMounted, watch, reactive } from 'vue';
import { debounce } from '@/utils/helper';

const props = defineProps({
  workflow: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update', 'close']);

const dataTypes = [
  { id: 'string', name: 'Text' },
  { id: 'integer', name: 'Number' },
  { id: 'boolean', name: 'Boolean' },
];

const state = reactive({
  query: '',
  columns: [],
});
const columns = computed(() =>
  state.columns.filter(({ name }) => name.includes(state.query))
);

function addColumn() {
  const isColumnExists = state.columns.some(({ name }) => name === state.query);

  if (isColumnExists || state.query.trim() === '') return;

  state.columns.push({ name: state.query, type: 'string' });
  state.query = '';
}

watch(
  () => state.columns,
  debounce((newValue) => {
    emit('update', { dataColumns: newValue });
  }, 250),
  { deep: true }
);

onMounted(() => {
  const tempColumns = props.workflow.dataColumns;

  state.columns = Array.isArray(tempColumns)
    ? tempColumns
    : Object.values(tempColumns);
});
</script>
