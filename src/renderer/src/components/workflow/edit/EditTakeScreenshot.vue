<template>
  <el-form :model="data" label-position="top">
    <el-form-item label="是否整屏">
      <el-select
        v-model="data.fullPage"
        class="block w-full"
        @change="updateData({ fullPage: $event })"
      >
        <el-option :value="true" label="是"></el-option>
        <el-option :value="false" label="否"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="元素选择器" v-if="!data.fullPage">
      <el-input
        v-model="data.selector"
        placeholder="Element selector"
        class="w-full"
        @change="updateData({ selector: $event })"
      />
    </el-form-item>
    <el-checkbox v-model="data.saveData" @change="updateData({ saveData: $event })">保存数据</el-checkbox>
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
    <el-form-item v-if="!data.saveData" label="文件名称">
      <div class="flex items-center">
        <el-input
          v-model="data.fileName"
          placeholder="文件名称"
          class="mr-2"
          title="File name"
          @change="updateData({ fileName: $event })"
        />
        <el-select v-model="data.ext" placeholder="Type" @change="updateData({ ext: $event })">
          <el-option value="png">PNG</el-option>
          <el-option value="jpeg">JPEG</el-option>
        </el-select>
      </div>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { inject } from 'vue';
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
