<template>
  <div class="mb-2 space-y-2">
    <el-form :model="data" label-position="top">
      <el-form-item label="描述">
        <el-input
          v-model="data.description"
          type="textarea"
          class="w-full"
          placeholder="描述"
          @change="updateData({ description: $event })"
        />
      </el-form-item>
      <el-form-item label="是否强制打开">
        <el-switch
          v-model="data.forceNew"
          active-text="强制打开新的"
          inactive-text="复用已打开的"
          @change="updateData({ forceNew: $event })"
        ></el-switch>
      </el-form-item>
      <el-form-item label="浏览器模式">
        <el-select
          class="w-full"
          v-model="data.headless"
          placeholder="浏览器模式"
          @change="updateData({ headless: $event })"
        >
          <el-option
            v-for="item in headType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否使用内置浏览器">
        <el-select
          class="w-full"
          v-model="data.browser"
          placeholder="浏览器"
          @change="updateData({ browser: $event })"
        >
          <el-option
            v-for="item in systemType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="浏览器类型">
        <el-select
          class="w-full"
          v-model="data.browserType"
          @change="updateData({ browserType: $event })"
        >
          <el-option
            v-for="item in browerType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="浏览器安装地址" v-if="data.browser === 2">
        <el-input
          v-model="data.executablePath"
          placeholder="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
          @change="updateData({ executablePath: $event })"
        />
      </el-form-item>
      <el-form-item label="是否使用代理">
        <el-select
          class="w-full"
          v-model="data.useProxy"
          @change="updateData({ useProxy: $event })"
        >
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="代理地址" v-if="data.useProxy">
        <el-input v-model="data.proxyUrl" placeholder @change="updateData({ proxyUrl: $event })" />
      </el-form-item>
      <el-form-item label="代理用户名" v-if="data.useProxy">
        <el-input
          v-model="data.proxyUserName"
          placeholder
          @change="updateData({ proxyUserName: $event })"
        />
      </el-form-item>
      <el-form-item label="代理密码" v-if="data.useProxy">
        <el-input
          v-model="data.proxyPassword"
          placeholder
          @change="updateData({ proxyPassword: $event })"
        />
      </el-form-item>
    </el-form>
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
const systemType = [{ value: 1, label: '内置浏览器' }, { value: 2, label: '系统浏览器' }]
const browerType = [
  { value: 'chrome', label: '谷歌浏览器' },
  { value: 'edge', label: 'Microsoft Edge' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'webkit', label: 'webkit' }
]

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}

</script>
