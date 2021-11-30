<template>
  <block-base
    :id="componentId"
    class="element-exists"
    @edit="editBlock"
    @delete="editor.removeNodeId(`node-${block.id}`)"
  >
    <div :class="block.category.color" class="flex items-center text-sm mb-2 p-2 rounded-lg">
      <i class="ri-focus-3-line ri-lg" />
      <span>Element exists</span>
    </div>
    <p
      title="Element selector"
      class="text-overflow p-2 rounded-lg bg-box-transparent text-sm font-mono text-right mb-2"
      style="max-width: 200px"
    >{{ block.data.selector || 'Element selector' }}</p>
    <p class="text-right text-gray-600">
      <span title="Execute when element doesn't exists">&#9432;</span>
      Fallback
    </p>
    <input type="text" class="hidden trigger" disabled="true" @change="handleDataChanged" />
  </block-base>
</template>
<script setup>
import emitter from 'tiny-emitter/instance';
import BlockBase from './BlockBase.vue';
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

function editBlock() {
  emitter.emit('editor:edit-block', {
    ...block.details,
    data: block.data,
    blockId: block.id,
  });
}
function handleDataChanged() {
  const { data } = props.editor.getNodeFromId(block.id);

  block.data = data;
}
</script>
<style>
.drawflow .element-exists .outputs {
  top: 70px !important;
  transform: none !important;
}
.drawflow .element-exists .output {
  margin-bottom: 22px;
}
</style>
