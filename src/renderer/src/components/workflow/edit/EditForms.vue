<template>
  <edit-interaction-base v-model:data="state">
    <el-select v-model="state.type" class="block w-full mt-4 mb-3" placeholder="Form type">
      <el-option v-for="form in forms" :key="form.id" :value="form.id" :label="form.name"></el-option>
    </el-select>
    <el-checkbox
      v-if="state.type === 'checkbox' || state.type === 'radio'"
      v-model="state.selected"
    >Selected</el-checkbox>
    <el-input
      type="textarea"
      v-if="state.type === 'text-field' || state.type === 'select'"
      v-model="state.value"
      placeholder="Value"
      class="w-full"
    />
    <el-input
      v-if="state.type === 'text-field'"
      v-model="state.delay"
      title="Typing delay (millisecond)(0 to disable)"
      placeholder="Delay"
      class="w-full mt-2"
      min="0"
      type="number"
    />
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
