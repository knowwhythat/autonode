<template>
  <edit-interaction-base v-bind="{ data }" @change="updateData">
    <el-form-item label="属性名称">
      <el-input
        v-model="data.attributeName"
        placeholder="Attribute name"
        class="w-full"
        @change="updateData({ attributeName: $event })"
      />
    </el-form-item>
    <el-checkbox
      v-model="data.saveData"
      class="mt-3"
      @change="updateData({ saveData: $event })"
    >Save data</el-checkbox>
    <div v-if="data.saveData" class="flex items-center mt-1">
      <el-select
        v-model="data.dataColumn"
        placeholder="Data column"
        class="mr-2 flex-1"
        @change="updateData({ dataColumn: $event })"
      >
        <el-option
          v-for="column in workflow.data.value.dataColumns"
          :key="column.name"
          :value="column.name"
          :label="column.name"
        ></el-option>
      </el-select>
      <el-button icon title="Data columns" @click="workflow.showDataColumnsModal(true)">
        <i class="ri-key-2-line" />
      </el-button>
    </div>
  </edit-interaction-base>
</template>
<script setup>
import { inject } from 'vue';
import EditInteractionBase from './EditInteractionBase.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const workflow = inject('workflow');

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
</script>
