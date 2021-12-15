<template>
  <div class="mb-2 mt-4">
    <el-form :model="data" label-position="top">
      <el-form-item label="描述">
        <el-input
          type="textarea"
          v-model="data.description"
          autoresize
          placeholder="Description"
          class="w-full"
          @change="updateData({ description: $event })"
        />
      </el-form-item>
      <el-form-item label="超时时间">
        <el-input
          type="number"
          v-model="data.timeout"
          class="w-full"
          placeholder="Timeout"
          title="Javascript code execution timeout"
          @change="updateData({ timeout: +$event })"
        />
      </el-form-item>
      <el-form-item label="代码">
        <prism-editor
          v-if="!showCodeModal"
          v-model="data.code"
          :highlight="highlighter('javascript')"
          readonly
          class="max-h-80"
          @click="showCodeModal = true"
        />
      </el-form-item>
    </el-form>

    <el-dialog v-model="showCodeModal" width="80%" title="Javascript代码">
      <prism-editor
        v-model="data.code"
        @change="updateData({ code: $event.target._value })"
        class="py-4"
        :highlight="highlighter('javascript')"
        line-numbers
        style="height: calc(100vh - 18rem)"
      />
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { PrismEditor } from 'vue-prism-editor';
import { highlighter } from '@/utils/prism';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const showCodeModal = ref(false);

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}

</script>
<style scoped>
code {
  @apply bg-gray-900 text-sm text-white p-1 rounded-md;
}
</style>
