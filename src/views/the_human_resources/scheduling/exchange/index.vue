<template>
  <div class="exchange">
    <div class="box">
      <!-- 表头 -->
      <div class="the_query">
        <!-- 条件框 -->
        <el-form
          :model="conditions"
          class="conditions_form"
          ref="searchForm"
          size="small"
          label-width="70px"
        >
          <div class="form_item">
            <el-form-item label="员工姓名" prop="bcmc">
              <el-input v-model="conditions.bcmc" placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>
          <div class="form_item">
            <el-form-item label="日期" prop="date">
              <el-date-picker
                style="width: 240px"
                v-model="conditions.date"
                type="daterange"
                range-separator="-"
                :clearable="false"
                :start-placeholder="startPlaceholder"
                :end-placeholder="endPlaceholder"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <!-- 操作按钮1 -->
          <el-button size="small" type="primary" style="margin-left: 20px"
            >查询</el-button
          >
          <el-button @click="clearSearch" size="small">重置</el-button>
        </el-form>
        <!-- 操作按钮2 -->
        <div>
          <el-button type="primary" size="small">立即排班</el-button>
          <!-- <el-button type="primary" plain size="small">重新生成</el-button> -->
          <el-button size="small">重新生成</el-button>
          <el-button size="small">导出数据</el-button>
        </div>
      </div>
      <!-- 主体 -->
      <div class="exchange_zt">
        <div v-for="(item, index) in 4" :key="index">
          <div :class="'zt_top' + ' ' + (index % 2 == 0 ? '' : 'coloer1')">
            <div>2021-09-{{ item }}</div>
            <div>星期{{ item }}</div>
          </div>
          <div class="zt_right">
            <div class="coloera">
              <div class="biaotidem1 tybt">夜班</div>
              <div class="texterw">
                <div>李四</div>
                <div>李四</div>
                <div>李四</div>
                <div>李四</div>
                <div>李四</div>
              </div>
            </div>
            <div class="coloerb">
              <div class="biaotidem2 tybt">休息</div>
              <div class="texterw">
                <div>李四</div>
                <div>李四</div>
                <div>李四</div>
              </div>
            </div>
            <div class="coloerc">
              <div class="biaotidem3 tybt">白班</div>
              <div class="texterw">
                <div>李四</div>
                <div>李四</div>
                <div>李四</div>
              </div>
            </div>
            <div class="coloerd">
              <div class="biaotidem4 tybt">早班</div>
              <div class="texterw">
                <div>李四</div>
                <div>李四</div>
                <div>李四</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询条件
      conditions: {
        bcmc: "", //排班计划名称
        date: [], //创建日期
      },
      //   展示数据
      tableData: [],
      startPlaceholder: "", //条件默认开始时间
      endPlaceholder: "", //条件默认结束时间
    };
  },
  mounted() {
    this.endPlaceholder = this.getMonday();
    this.startPlaceholder = this.getMonday(30);
  },
  methods: {
    //  清空搜索条件
    clearSearch() {
      this.$refs["searchForm"].resetFields();
    },
    // 时间方法
    getMonday(e) {
      let now = new Date();
      if (e) {
        return this.$dayjs(
          new Date(now.getTime() - e * 24 * 60 * 60 * 1000)
        ).format("YYYY-MM-DD");
      } else {
        return this.$dayjs(now).format("YYYY-MM-DD");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./exchange.scss";
</style>