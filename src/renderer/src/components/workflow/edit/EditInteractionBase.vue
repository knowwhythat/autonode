<template>
  <slot name="prepend" />
  <el-form-item label="描述">
    <el-input
      type="textarea"
      v-model="data.description"
      autoresize
      placeholder="描述"
      class="w-full"
      @change="updateData({ description: $event })"
    />
  </el-form-item>
  <el-form-item label="元素选择器" v-if="!hideSelector">
    <el-input
      v-model="data.selector"
      placeholder="Element selector"
      class="w-full"
      @change="updateData({ selector: $event })"
    />
  </el-form-item>
  <template v-if="!hideSelector">
    <el-checkbox
      v-if="!data.disableMultiple && !hideMultiple"
      class="mr-6"
      :model-value="data.multiple"
      @change="updateData({ multiple: $event })"
    >选择多个元素</el-checkbox>
    <el-checkbox
      :model-value="data.markEl"
      title="An element will not be selected after marked"
      @change="updateData({ markEl: $event })"
    >标记元素</el-checkbox>
  </template>
  <slot></slot>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  hideSelector: {
    type: Boolean,
    default: false,
  },
  hideMultiple: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:data', 'change']);

function updateData(value) {
  const payload = { ...props.data, ...value };

  emit('update:data', payload);
  emit('change', payload);
}
</script>
