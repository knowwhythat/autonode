<template>
  <edit-interaction-base v-model:data="state">
    <el-form-item label="表单类型">
      <el-select v-model="state.type" class="block w-full" placeholder="Form type">
        <el-option v-for="form in forms" :key="form.id" :value="form.id" :label="form.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否选中" v-if="state.type === 'checkbox' || state.type === 'radio'">
      <el-checkbox v-model="state.selected">Selected</el-checkbox>
    </el-form-item>
    <el-form-item label="填充内容" v-if="state.type === 'text-field' || state.type === 'select'">
      <el-input type="textarea" v-model="state.value" placeholder="Value" class="w-full" />
    </el-form-item>
  </edit-interaction-base>
</template>
<script setup>
import { ref, watch } from 'vue';
import { debounce } from '@/utils/helper';
import EditInteractionBase from './EditInteractionBase.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const forms = [
  { id: 'text-field', name: 'Text field' },
  { id: 'select', name: 'Select' },
  { id: 'checkbox', name: 'Checkbox' },
  { id: 'radio', name: 'Radio' },
];

const state = ref(props.data);

watch(
  state,
  debounce((value) => {
    emit('update:data', value);
  }, 250),
  { deep: true }
);
</script>
