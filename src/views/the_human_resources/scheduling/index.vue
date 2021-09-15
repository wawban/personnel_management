<template>
  <div class="scheduling">
    <div class="box">
      <div class="top_biaot">
        <p>{{ bt_name }}</p>
        <div>
          <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
            <el-radio-button label="1">班次视图</el-radio-button>
            <el-radio-button label="2">人员视图</el-radio-button>
            <el-radio-button label="3">排班统计</el-radio-button>
            <el-radio-button label="4">班次调换</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="rqi">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bt_name: this.$route.query.text, //标题
      tabPosition: "4", //标签页切换
    };
  },
  watch: {
    //   监听标签页跳转
    tabPosition(val, oldVal) {
      if (val == 1) {
        this.go("/scheduling/classView");
      } else if (val == 2) {
        this.go("/scheduling/peopleView");
      } else if (val == 3) {
        this.go("/scheduling/statistics");
      } else if (val == 4) {
        this.go("/scheduling/exchange");
      }
    },
  },
  mounted() {
    this.go("/scheduling/exchange");
  },
  methods: {
    // 标签页跳转
    go(e) {
      this.$router.push({
        path: e,
        query: {
          text: this.bt_name,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./scss/scheduling.scss";
</style>
 