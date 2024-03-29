<template>
  <div :id="componentId" class="p-4">
    <div class="flex items-center">
      <div :class="block.category.color" class="inline-block text-sm mr-4 p-2 rounded-lg">
        <i class="ri-question-mark ri-lg" />
        <span class="font-semibold leading-none whitespace-nowrap">条件</span>
      </div>
      <div class="flex-grow"></div>
      <i class="ri-delete-bin-7-line ri-lg" @click="editor.removeNodeId(`node-${block.id}`)" />
      <i
        class="ri-add-line ri-2x"
        :disabled="block.data.conditions && block.data.conditions.length > 4"
        @click="addComparison"
      />
    </div>
    <div v-if="block.data.conditions && block.data.conditions.length !== 0" class="mt-4 space-y-2">
      <div
        v-for="(item, index) in block.data.conditions"
        :key="item.id"
        class="flex items-center group justify-end"
      >
        <i class="ri-delete-bin-7-line rx-lg" @click="deleteComparison(index)" />
        <div class="flex items-center transition bg-input rounded-lg">
          <input
            v-model="block.data.conditions[index].key"
            type="text"
            placeholder="key"
            class="p-2 flex-1 transition rounded-l-lg bg-transparent w-20"
          />
          <select
            v-model="block.data.conditions[index].type"
            :title="conditions[block.data.conditions[index]?.type] || '等于'"
            class="bg-transparent font-mono z-10 p-2 text-center transition rounded-l-lg appearance-none"
          >
            <option v-for="(name, type) in conditions" :key="type" :value="type">{{ type }}</option>
          </select>
          <div class="bg-gray-300 w-px" style="height: 30px"></div>
          <input
            v-model="block.data.conditions[index].value"
            type="text"
            placeholder="value"
            class="p-2 flex-1 transition rounded-r-lg bg-transparent w-20"
          />
        </div>
      </div>
      <p
        v-if="block.data.conditions && block.data.conditions.length !== 0"
        class="text-right text-gray-600"
      >
        <span title="Execute when all comparisons don't meet the requirement">&#9432;</span>
        Fallback
      </p>
    </div>
  </div>
</template>
<script setup>
import { watch, toRaw } from 'vue';
import emitter from 'tiny-emitter/instance';
import { debounce } from '@/utils/helper';
import { useComponentId } from '@/composable/componentId';
import { useEditorBlock } from '@/composable/editorBlock';

const props = defineProps({
  editor: {
    type: Object,
    default: () => ({}),
  },
});

const componentId = useComponentId('block-conditions');
const block = useEditorBlock(`#${componentId}`, props.editor);

const conditions = {
  '==': '等于',
  '>': '大于',
  '>=': '大于等于',
  '<': '小于',
  '<=': '小于等于',
  '()': '保含',
};

function addComparison() {
  if (block.data.conditions.length >= 5) return;

  block.data.conditions.push({ type: '==', value: '' });

  if (block.data.conditions.length === 1) props.editor.addNodeOutput(block.id);

  props.editor.addNodeOutput(block.id);
}
function deleteComparison(index) {
  block.data.conditions.splice(index, 1);

  props.editor.removeNodeOutput(block.id, `output_${index + 1}`);
  if (block.data.conditions.length === 0)
    props.editor.removeNodeOutput(block.id, `output_1`);
}

watch(
  () => block.data.conditions,
  debounce((newValue, oldValue) => {
    props.editor.updateNodeDataFromId(block.id, {
      conditions: toRaw(newValue),
    });

    props.editor.updateConnectionNodes(`node-${block.id}`);

    if (oldValue) {
      emitter.emit('editor:data-changed', block.id);
    }
  }, 250),
  { deep: true }
);
</script>
<style>
.drawflow .drawflow-node.conditions .outputs {
  top: 82px !important;
  transform: none !important;
}
.drawflow .drawflow-node.conditions .output {
  margin-bottom: 32px;
}
.drawflow .drawflow-node.conditions .output:nth-last-child(2) {
  margin-bottom: 20px;
}
</style>
