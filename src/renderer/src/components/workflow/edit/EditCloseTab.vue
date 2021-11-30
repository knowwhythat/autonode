<template>
  <div class="mb-2 mt-4">
    <div class="mb-2">
      <el-checkbox
        v-model="data.activeTab"
        @change="updateData({ activeTab: $event })"
      >Close active tab</el-checkbox>
    </div>
    <el-input
      v-if="!data.activeTab"
      v-model="data.url"
      placeholder="http://example.com/*"
      @change="updateData({ url: $event })"
    >
      <template #prepend>
        <a
          href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns"
          target="_blank"
          rel="noopener"
          title="规则说明"
        >
          <i class="ri-information-fill"></i>
        </a>
      </template>
    </el-input>
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

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
</script>
