<template>
  <div>
    <div class="flex items-center mb-6 space-x-4">
      <el-input v-model="state.query" placeholder="Search..." clearable :prefix-icon="Search" />
      <div class="flex">
        <el-button
          type="primary"
          @click="state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'"
        >
          <i class="ri-sort-asc" v-if="state.sortOrder === 'asc'"></i>
          <i class="ri-sort-desc" v-else></i>
        </el-button>
        <el-select v-model="state.sortBy" placeholder="排序">
          <el-option v-for="item in sorts" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-upload action="#" auto-upload :before-upload="beforeUpload">
        <el-button type="primary">
          上传工作流
          <i class="ri-upload-line"></i>
        </el-button>
      </el-upload>
      <el-button type="primary" @click="state.dialogWorkFlowVisible = true">
        新建工作流
        <i class="ri-add-box-line"></i>
      </el-button>
    </div>
    <div class="grid gap-4 grid-cols-4">
      <WorkflowCard
        v-for="workflow in workflows"
        :workflow="workflow"
        :key="workflow.workflowId"
        @export="exportWorkflow"
        @delete="deleteWorkflow"
        @rename="renameWorkflow"
        @execute="executeWorkflow"
      />
    </div>
    <el-dialog v-model="state.dialogWorkFlowVisible" title="新建工作流" :append-to-body="true">
      <el-form :model="dataForm" ref="form" :rules="rules">
        <el-form-item label="工作流名称" :label-width="100">
          <el-input v-model="dataForm.name" prop="name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogWorkFlowVisible = false">取消</el-button>
          <el-button type="primary" @click="saveWorkFlow">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { shallowReactive, computed } from 'vue';
import { useStore } from 'vuex';
import { nanoid } from 'nanoid';
import { Search } from '@element-plus/icons'
import WorkflowCard from '@/components/workflow/WorkflowCard.vue'
import { exportWorkflow } from '@/utils/helper';

const store = useStore();

const sorts = [
  { name: '名称', id: 'name' },
  { name: '创建时间', id: 'createdAt' },
];
const state = shallowReactive({
  query: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  dialogWorkFlowVisible: false,
});

const workflows = computed(() => store.getters.getWorkflows(state.query, state.sortBy, state.sortOrder));

function executeWorkflow(workflow) {

}

function beforeUpload(file) {
  const reader = new FileReader();
  reader.onload = ({ target }) => {
    try {
      const workflow = JSON.parse(target.result);
      workflow.workflowId = nanoid(32)
      store.dispatch('workflow/saveWorkFlow', workflow)
    } catch (error) {
      this.$message.error("导入失败，请检查文件是否正确");
    }
  };
  reader.readAsText(file);
  return false
}
</script>
<script>
export default {
  data() {
    return {
      dataForm: {
        workflowId: null,
        name: null,
        icon: 'ri-window-line',
        drawflow: null,
      },
      rules: {
        name: [{ required: true, message: '请输入工作流名称', trigger: 'blur', },
        ]
      },
    }
  },
  methods: {
    saveWorkFlow() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
        } else {
          return false
        }
      })
      if (!this.dataForm.workflowId) {
        this.dataForm.workflowId = nanoid(32)
        this.$store.dispatch('workflow/saveWorkFlow', this.dataForm)
        this.state.dialogWorkFlowVisible = false
        // this.$router.push("detail/" + this.dataForm.workflowId)
      } else {
        this.$store.dispatch('workflow/updateWorkFlow', this.dataForm)
        this.state.dialogWorkFlowVisible = false
      }
      this.resetDataForm()
    },
    renameWorkflow(workflow) {
      this.dataForm = workflow
      this.state.dialogWorkFlowVisible = true
    },
    deleteWorkflow(workflow) {
      this.$confirm("确定要删除:" + workflow.name, "删除工作流", { type: 'warning' }).then(() => {
        this.$store.dispatch('workflow/delWorkFlow', workflow)
      }).catch(() => { })
    },
    resetDataForm() {
      this.dataForm = {
        workflowId: null,
        name: null,
        icon: 'ri-window-line',
        drawflow: null,
      }
    }
  }
}
</script>