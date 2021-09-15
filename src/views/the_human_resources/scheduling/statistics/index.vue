<template>
  <div class="statistics">
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
          <el-button size="small">导出数据</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table_item">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#aaa', color: '#fff' }"
        >
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="name" label="总班数"> </el-table-column>
          <el-table-column prop="name" label="早班"> </el-table-column>
          <el-table-column prop="name" label="晚班"> </el-table-column>
          <el-table-column prop="name" label="白班"> </el-table-column>
          <el-table-column prop="name" label="休息"> </el-table-column>
        </el-table>
        <div class="paging">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="10"
            layout="total, sizes, prev, pager, next"
            :total="400"
          >
          </el-pagination>
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
      startPlaceholder: "", //条件默认开始时间
      endPlaceholder: "", //条件默认结束时间
      //   展示数据
      tableData: [
        { name: "xxxx", xxx: "123" },
        { name: "xxxx", xxx: "123" },
        { name: "xxxx", xxx: "123" },
      ],
    };
  },
  mounted() {
    this.endPlaceholder = this.getMonday();
    this.startPlaceholder = this.getMonday(30);
  },
  methods: {
    // 分页更改页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页更改页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
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
@import "./statistics.scss";
</style>