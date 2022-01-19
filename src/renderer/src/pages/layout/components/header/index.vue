<template>
  <div class="ym-header">
    <div class="header-left">
      <WorkflowActions />
    </div>
    <div class="header-right">
      <i class="ri-fullscreen-fill" @click="darkMode" :style="{ 'color': skinChoose.navColor }"></i>
      <el-dropdown>
        <span :style="{ 'color': skinChoose.navColor }">
          {{ userinfo && userinfo.nickname }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toProfile()">个人信息</el-dropdown-item>
            <el-dropdown-item @click="loginOut()">注销</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="header-set" @click="changeShowSet">
        <i class="ri-settings-fill" :style="{ 'color': skinChoose.navColor }"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import screenfull from "screenfull";
import WorkflowActions from "./WorkflowActions.vue";

export default {
  data() {
    return {};
  },
  components: {
    WorkflowActions
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      showSet: (state) => state.app.showSet,
      language: (state) => state.app.language,
      skinChoose: (state) => state.settings.skinChoose,
      userinfo: (state) =>
        typeof state.user.userinfo === "string"
          ? JSON.parse(state.user.userinfo)
          : state.user.userinfo,
    }),
  },
  created() { },
  methods: {
    outSide() {
      this.$store.dispatch("app/toggleSidebar", !this.sidebar);
    },
    loginOut() {
      this.$store.dispatch("user/loginOutSet");
      this.$router.replace("login");
    },
    toScreenfull() {
      screenfull.toggle();
    },
    toProfile() {
      this.$router.push("/profile");
    },
    refRoute() {
      this.$emit("refRoute");
    },
    changeShowSet() {
      this.$store.dispatch("app/setShowSet", !this.showSet);
    },
    darkMode() {
      const clsList = document.documentElement.classList;
      if (!clsList.contains('dark-mode')) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.ym-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .header-tool {
    padding-right: 20px;
  }
  .header-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }
  .header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    .header-set {
      margin-left: 20px;
    }
  }
}
</style>