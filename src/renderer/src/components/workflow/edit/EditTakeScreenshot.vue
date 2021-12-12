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
    <el-form-item label="文件名称">
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
    <el-form-item label="图片质量">
      <div class="bg-box-transparent px-4 mb-4 py-2 rounded-lg flex items-center">
        <input
          :value="data.quality"
          title="Image quality"
          class="focus:outline-none flex-1"
          type="range"
          min="0"
          max="100"
          @change="updateQuality"
        />
        <span class="w-12 text-right">{{ data.quality }}%</span>
      </div>
    </el-form-item>
  </el-form>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
function updateQuality({ target }) {
  let quality = +target.value;

  if (quality <= 0) quality = 0;
  if (quality >= 100) quality = 100;

  updateData({ quality });
}
</script>
