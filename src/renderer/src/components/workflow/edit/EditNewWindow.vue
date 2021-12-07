<template>
  <div class="mb-2 mt-4 space-y-2">
    <el-input
      v-model="data.description"
      type="textarea"
      class="w-full"
      placeholder="描述"
      @change="updateData({ description: $event })"
    />
    <el-switch
      v-model="data.forceNew"
      active-text="强制打开新的"
      inactive-text="复用已打开的"
      @change="updateData({ forceNew: $event })"
    ></el-switch>
    <el-select
      class="w-full"
      v-model="data.headless"
      placeholder="浏览器模式"
      @change="updateData({ headless: $event })"
    >
      <el-option v-for="item in headType" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select
      class="w-full"
      v-model="data.browser"
      placeholder="浏览器"
      @change="updateData({ browser: $event })"
    >
      <el-option
        v-for="item in browserType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input
      v-if="data.browser === 2"
      v-model="data.executablePath"
      placeholder="系统浏览器安装地址"
      @change="updateData({ executablePath: $event })"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const headType = [{ value: false, label: '有界面' }, { value: true, label: '无界面' }]
const browserType = [{ value: 1, label: '内置浏览器' }, { value: 2, label: '系统浏览器' }]

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}

</script>
