<template>
  <div :id="componentId" class="p-4">
    <div class="flex items-center mb-2">
      <div :class="block.category.color" class="inline-block text-sm mr-4 p-2 rounded-lg">
        <i class="ri-download-line ri-lg" />
        <span>导出数据</span>
      </div>
      <div class="flex-grow"></div>
      <i class="ri-delete-bin-7-line ri-lg" @click="editor.removeNodeId(`node-${block.id}`)" />
    </div>
    <input
      v-model="block.data.name"
      class="w-full bg-input rounded-lg transition mb-2 py-2 px-4 block"
      placeholder="文件名称"
    />
  </div>
</template>
<script setup>
import { watch } from 'vue';
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

const componentId = useComponentId('block-delay');
const block = useEditorBlock(`#${componentId}`, props.editor);

watch(
  () => block.data,
  debounce((value, oldValue) => {
    if (Object.keys(oldValue).length === 0) return;

    props.editor.updateNodeDataFromId(block.id, value);
    emitter.emit('editor:data-changed', block.id);
  }, 250),
  { deep: true }
);
</script>
