<template>
  <edit-interaction-base v-model:data="data">
    <el-form-item label="表单类型">
      <el-select v-model="data.type" class="block w-full" @change="updateData({ type: $event })">
        <el-option v-for="form in forms" :key="form.id" :value="form.id" :label="form.name"></el-option>
      </el-select>
    </el-form-item>
    <el-checkbox v-model="data.getValue" @change="updateData({ getValue: $event })">获取数据</el-checkbox>
    <template v-if="data.getValue">
      <el-checkbox v-model="data.saveData" @change="updateData({ saveData: $event })">保存数据</el-checkbox>
      <div class="flex items-center">
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
    </template>
    <template v-else>
      <el-form-item label="是否选中" v-if="data.type === 'checkbox' || data.type === 'radio'">
        <el-checkbox v-model="data.selected" @change="updateData({ selected: $event })">Selected</el-checkbox>
      </el-form-item>
      <el-form-item label="填充内容" v-if="data.type === 'text-field' || data.type === 'select'">
        <el-input
          type="textarea"
          v-model="data.value"
          placeholder="值"
          class="w-full"
          @change="updateData({ value: $event })"
        />
      </el-form-item>
    </template>
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

const forms = [
  { id: 'text-field', name: 'Text field' },
  { id: 'select', name: 'Select' },
  { id: 'checkbox', name: 'Checkbox' },
  { id: 'radio', name: 'Radio' },
];
function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
</script>
