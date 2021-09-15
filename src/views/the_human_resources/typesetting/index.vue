
<template>
  <div class="typesetting">
    <div class="box">
      <!-- 表头 -->
      <div class="the_query">
        <!-- 条件框 -->
        <el-form
          :model="conditions"
          class="conditions_form"
          ref="searchForm"
          size="small"
          label-width="110px"
        >
          <div class="form_item">
            <el-form-item label="排班计划名称：" prop="bcmc">
              <el-input v-model="conditions.bcmc" placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>
          <div class="form_item">
            <el-form-item label="创建日期：" prop="date">
              <el-date-picker
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
        </el-form>
        <!-- 操作按钮 -->
        <div>
          <el-button @click="func_add" size="small">新增</el-button>
          <el-button size="small" type="primary">查询</el-button>
          <el-button @click="clearSearch" size="small">重置</el-button>
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
          <el-table-column prop="name" label="排班计划名称"> </el-table-column>
          <el-table-column prop="name" label="类型"> </el-table-column>
          <el-table-column prop="name" label="周期"> </el-table-column>
          <el-table-column prop="name" label="创建人"> </el-table-column>
          <el-table-column prop="name" label="创建时间"> </el-table-column>
          <el-table-column xxx="name" label="操作">
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-star-off"
                size="mini"
                @click="go"
                >排班</el-button
              >
              <el-button
                @click="the_editor(scope.row)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="the_remove(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
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
      <!-- 增改框 -->
      <el-dialog :title="text_wenz" :visible.sync="dialogVisible" width="800px">
        <div class="add_box">
          <el-form label-width="160px">
            <el-form-item label="计划名称:" prop="xx">
              <el-input v-model="ruleForm.xx"></el-input>
            </el-form-item>
            <div class="inpu_cross">
              <el-form-item label="计划有效期:" prop="dx">
                <el-radio-group @change="funcdxs" v-model="ruleForm.dx">
                  <el-radio label="1">永久有效</el-radio>
                  <el-radio label="2">固定期限</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="有效时间:" prop="xxs">
                <el-date-picker
                  v-model="ruleForm.xxs"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="funcdwewz">
              <el-form-item label="参与考勤组:" prop="dx">
                <el-select
                  v-model="ruleForm.dx"
                  multiple
                  collapse-tags
                  style="width: 490px"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in tableData"
                    :key="index"
                    :label="item.name"
                    :value="item.xxx"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-button @click="chakanxianql" size="small" type="text"
                >查看考勤组详情</el-button
              >
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 考勤组详情 -->

      <el-dialog
        title="选择考勤组"
        :visible.sync="kaoqdez"
        width="800px"
        :close-on-click-modal="false"
      >
        <div class="rdudsxvuhgsci">
          <div class="scsdsxx">
            考勤组名：<el-input
              style="width: 160px"
              placeholder="请输入内容"
            ></el-input>
            <el-button class="btenanniu" size="small" type="primary"
              >查询</el-button
            >
          </div>
        </div>
        <el-table
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="420"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="考勤组名称"></el-table-column>
          <el-table-column prop="xxx" label="人数"></el-table-column>
          <el-table-column prop="xxx" label="类型"></el-table-column>
          <el-table-column prop="xxx" label="考勤时间"></el-table-column>
          <el-table-column prop="xxx" label="负责人"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="kaoqdez = false">取 消</el-button>
          <!-- <el-button type="primary" @click="xuanhaole">确 定</el-button> -->
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vdvsvsvsca: [], //考勤组选中的数据
      kaoqdez: false, //考勤组详情弹框
      //   增改数据
      ruleForm: {
        xx: "1",
        dx: "1",
        xxs: [],
        saw: true,
      },
      //   展示数据
      tableData: [
        { name: "xxxx", xxx: "1231" },
        { name: "xxxx", xxx: "1232" },
        { name: "xxxx", xxx: "1233" },
        { name: "xxxx", xxx: "1234" },
        { name: "xxxx", xxx: "1235" },
      ],
      // 查询条件
      conditions: {
        bcmc: "", //排班计划名称
        date: [], //创建日期
      },
      dialogVisible: false, //弹框开关
      text_wenz: "", //弹框标题
      startPlaceholder: "", //条件默认开始时间
      endPlaceholder: "", //条件默认结束时间
    };
  },
  mounted() {
    this.endPlaceholder = this.getMonday();
    this.startPlaceholder = this.getMonday(30);
  },
  methods: {
    // 排班跳转
    go() {
      this.$router.push({
        path: "/scheduling",
        query: {
          text: "时间BIOS就是偶数层",
        },
      });
    },
    // 选中的考勤组
    handleSelectionChange(val) {
      this.vdvsvsvsca = val;
    },
    // 查看考勤组详情
    chakanxianql() {
      this.kaoqdez = true;
    },
    // 点击删除
    the_remove(e) {
      console.log(e);
      this.$confirm("确认删除" + e.xxx, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 新增
    func_add() {
      this.text_wenz = "新增";
      this.dialogVisible = true;
    },
    // 点击编辑按钮
    the_editor(e) {
      console.log(e);
      this.text_wenz = "编辑";
      this.dialogVisible = true;
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
    //  清空搜索条件
    clearSearch() {
      this.$refs["searchForm"].resetFields();
    },
    // 分页更改页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页更改页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 计划有效期选择
    funcdxs(e) {
      if (e == 1) {
      } else if (e == 2) {
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./typesetting.scss";
</style>