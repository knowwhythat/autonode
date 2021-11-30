<template>
  <edit-interaction-base v-bind="{ data }" @change="updateData">
    <div class="flex rounded-lg bg-input px-4 items-center transition mt-2">
      <span>/</span>
      <input
        :value="data.regex"
        placeholder="Regex"
        class="w-11/12 bg-transparent p-2 focus:ring-0"
        @change="updateData({ regex: $event.target.value })"
      />
      <el-popover>
        <template #reference>
          <button>/{{ regexExp.join('') }}</button>
        </template>
        <p class="mb-2 text-gray-600 dark:text-gray-200">Expression flags</p>
        <div class="space-y-1">
          <div v-for="item in exps" :key="item.id">
            <el-checkbox
              :model-value="regexExp.includes(item.id)"
              @change="handleExpCheckbox(item.id, $event)"
            >{{ item.name }}</el-checkbox>
          </div>
        </div>
      </el-popover>
    </div>
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
import { inject, ref } from 'vue';
import EditInteractionBase from './EditInteractionBase.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const workflow = inject('workflow');
const regexExp = ref(props.data.regexExp);

const exps = [
  { id: 'g', name: 'global' },
  { id: 'i', name: 'ignore case' },
  { id: 'm', name: 'multiline' },
];

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
function handleExpCheckbox(id, value) {
  if (value) {
    regexExp.value.push(id);
  } else {
    regexExp.value.splice(regexExp.value.indexOf(id), 1);
  }

  updateData({ regexExp: regexExp.value });
}
</script>
