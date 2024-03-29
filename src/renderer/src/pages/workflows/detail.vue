<template>
  <div class="flex h-full">
    <div class="w-80 bg-white py-2 relative border-l border-gray-100 flex flex-col">
      <workflow-edit-block
        v-if="state.isEditBlock"
        :data="state.blockData"
        @update="updateBlockData"
        @close="(state.isEditBlock = false), (state.blockData = {})"
      />
      <workflow-details-card v-else :workflow="workflow" @update="updateWorkflow" />
    </div>
    <div class="flex-1 relative overflow-auto">
      <div class="absolute w-full flex items-center z-10 left-0 top-0">
        <WorkflowActions
          :workflow="workflow"
          :data-changed="state.isDataChanged"
          @save="saveWorkflow"
          @log="showLogDetail"
          @export="exportWorkflow"
          @execute="executeWorkflow"
          @update="updateWorkflow"
          @showDataColumns="state.showDataColumnsModal = true"
          @showGlobalData="state.showGlobalDataModal = true"
          @showSettings="state.showSettings = true"
          @rename="renameWorkflow"
          @delete="deleteWorkflow"
        ></WorkflowActions>
      </div>

      <keep-alive>
        <workflow-builder
          class="workflow-designer"
          :data="workflow?.drawflow"
          @load="editor = $event"
          @deleteBlock="deleteBlock"
        />
      </keep-alive>
    </div>
    <el-dialog v-model="state.showDataColumnsModal" title="变量池">
      <workflow-data-columns
        v-bind="{ workflow }"
        @update="updateWorkflow"
        @close="state.showDataColumnsModal = false"
      />
    </el-dialog>
    <el-dialog v-model="state.showSettings" title="设置">
      <workflow-settings v-bind="{ workflow }" @update="updateWorkflow" />
    </el-dialog>
    <el-dialog v-model="state.showGlobalDataModal" title="全局数据">
      <workflow-global-data v-bind="{ workflow }" @update="updateWorkflow" />
    </el-dialog>
    <el-drawer v-model="state.showLog" size="100%" title="执行日志">
      <ExecutionLogs :workflowId="workflowId" />
    </el-drawer>
  </div>
</template>
<script setup>
import {
  computed,
  reactive,
  shallowRef,
  nextTick,
  provide,
  onMounted,
  onUnmounted,
} from 'vue';
import { useStore } from 'vuex';
import emitter from 'tiny-emitter/instance';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { debounce } from 'lodash';
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder.vue';
import WorkflowActions from '@/components/workflow/WorkflowActions.vue';
import WorkflowDetailsCard from '@/components/workflow/WorkflowDetailCard.vue';
import WorkflowEditBlock from '@/components/workflow/WorkflowEditBlock.vue';
import WorkflowDataColumns from '@/components/workflow/WorkflowDataColumns.vue';
import WorkflowSettings from '@/components/workflow/WorkflowSettings.vue';
import WorkflowGlobalData from '@/components/workflow/WorkflowGlobalData.vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import { exportWorkflow } from '@/utils/helper'
import ExecutionLogs from '../logs/index.vue';

const store = useStore();
const route = useRoute();

const workflowId = route.params.id;
const editor = shallowRef(null);
const state = reactive({
  blockData: {},
  isEditBlock: false,
  showSettings: false,
  isDataChanged: false,
  showDataColumnsModal: false,
  showGlobalDataModal: false,
  showLog: false
});

const workflow = computed(() => store.getters.getWorkflow(workflowId));

provide('workflow', {
  data: workflow,
  updateWorkflow,
  /* eslint-disable-next-line */
  showDataColumnsModal: (show = true) => (state.showDataColumnsModal = show),
});

function saveWorkflow() {
  const data = editor.value.export();
  updateWorkflow({ drawflow: JSON.stringify(data) }).then(() => {
    state.isDataChanged = false;
  });
}

function showLogDetail() {
  state.showLog = true
}

const updateBlockData = debounce((data) => {
  state.blockData.data = data;
  state.isDataChanged = true;
  editor.value.updateNodeDataFromId(state.blockData.blockId, data);

  const inputEl = document.querySelector(
    `#node-${state.blockData.blockId} input.trigger`
  );

  if (inputEl) inputEl.dispatchEvent(new Event('change'));
}, 150);
function executeWorkflow() {
  if (editor.value.getNodesFromName('trigger').length === 0) {
    ElMessage({
      message: '必须有个Trigger作为工作流的开始',
      type: 'warning',
    })
    return;
  }
  const payload = {
    ...workflow.value,
    drawflow: editor.value.export(),
    isTesting: state.isDataChanged,
  };
  if (workflow.value.executing) {
    ElMessageBox.confirm(`"${workflow.value.name}"正在运行中，确定要重新运行?`, '执行', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      store.dispatch('workflow/executeWorkflow', payload)
    }).catch(() => {
    })
  } else {
    store.dispatch('workflow/executeWorkflow', payload)
  }
}
function updateWorkflow(data) {
  return store.dispatch('workflow/updateWorkFlow', Object.assign({}, workflow.value, data))
}
function renameWorkflow() {
  ElMessageBox.prompt('输入工作流名称', '重命名', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: workflow.value.name,
  }).then(({ value }) => {
    updateWorkflow({ name: value })
  }).catch(() => { })
}
function deleteWorkflow() {
  ElMessageBox.confirm(`确定要删除 "${workflow.value.name}"?`, '删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.dispatch('app/closeCurrentTab', { fullPath: route.fullPath, type: 'current' })
    nextTick(() => {
      store.dispatch('workflow/delWorkFlow', workflow.value)
    })
  }).catch(() => {
  })
}
function deleteBlock(id) {
  if (state.isEditBlock && state.blockData.blockId === id) {
    state.isEditBlock = false;
    state.blockData = {};
  }

  state.isDataChanged = true;
}
function editBlock(data) {
  state.isEditBlock = true;
  state.blockData = data;
}
function handleEditorDataChanged() {
  state.isDataChanged = true;
}

onBeforeRouteLeave(() => {
  if (!state.isDataChanged) return;
  const answer = window.confirm(
    '当前编辑的内容未保存，确定退出?'
  );
  if (!answer) return false;
});
onMounted(() => {
  window.onbeforeunload = () => {
    if (state.isDataChanged) {
      return '当前编辑的内容可能无法保存.';
    }
  };
  emitter.on('editor:edit-block', editBlock);
  emitter.on('editor:data-changed', handleEditorDataChanged);
});
onUnmounted(() => {
  window.onbeforeunload = null;
  emitter.off('editor:edit-block', editBlock);
  emitter.off('editor:data-changed', handleEditorDataChanged);
});
</script>
