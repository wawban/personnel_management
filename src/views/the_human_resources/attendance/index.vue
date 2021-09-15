<template>
  <div class="attendance">
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
            <el-form-item label="考勤组名称：" prop="bcmc">
              <!-- style="width: 220px" -->
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
            <!-- <el-form-item label="创建日期：" prop="date" label-width="72px">
              <el-date-picker
                style="width: 220px"
                v-model="conditions.date"
                type="daterange"
                range-separator="-"
                :start-placeholder="startPlaceholder"
                :clearable="false"
                value-format="yyyy-MM-dd"
                :end-placeholder="endPlaceholder"
              >
              </el-date-picker>
            </el-form-item> -->
          </div>
        </el-form>
        <!-- 操作按钮 -->
        <div>
          <el-button @click="func_add" size="small">新增</el-button>
          <el-button @click="get_institutions" size="small" type="primary"
            >查询</el-button
          >
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
          <!-- :header-cell-style="{ background: '#409EFF', color: '#fff' }" -->
          <!-- <el-table-column prop="name" label="日期" width="180"> -->
          <el-table-column prop="name" label="考勤组名称"> </el-table-column>
          <el-table-column prop="name" label="人数"> </el-table-column>
          <el-table-column prop="name" label="类型"> </el-table-column>
          <el-table-column prop="name" label="考勤时间"> </el-table-column>
          <el-table-column prop="name" label="负责人"> </el-table-column>
          <el-table-column prop="name" label="更新时间"> </el-table-column>
          <el-table-column xxx="name" label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                >编辑</el-button
              > -->
              <el-button
                @click="the_editor(scope.row)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="the_remove(scope.row)"
                >删除</el-button
              >
            </template>
            <!-- <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >查看</el-button
                >
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column> -->
          </el-table-column>
        </el-table>
        <div class="paging">
          <!-- <el-pagination background layout="prev, pager, next" :total="1000">
          </el-pagination> -->
          <!-- layout="total, sizes, prev, pager, next, jumper" -->
          <!-- :current-page="currentPage4" -->
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
            <p class="the_title"><i></i> 基础信息</p>
            <div class="inpu_cross">
              <el-form-item label="考勤组名称:" prop="xxx">
                <el-input v-model="ruleForm.xxx"></el-input>
              </el-form-item>
              <el-form-item label="考勤组负责人:" prop="xxx">
                <el-input v-model="ruleForm.xxx"></el-input>
              </el-form-item>
            </div>
            <div class="inpu_cross">
              <el-form-item label="参与考勤的部门和人员:" prop="xxx">
                <span class="cascader_on">
                  <el-input v-model="ruleForm.xxx" :disabled="true"></el-input>
                  <i @click="kaoqwfunc(1)" class="el-icon-search"></i>
                </span>
              </el-form-item>
              <el-form-item label="无需考勤的部门和人员:" prop="xxx">
                <span class="cascader_on">
                  <el-input v-model="ruleForm.xxx" :disabled="true"></el-input>
                  <i @click="kaoqwfunc(2)" class="el-icon-search"></i>
                </span>
              </el-form-item>
            </div>
            <div class="inpu_cross fleft_cross">
              <el-form-item label="考勤组时区:">
                <el-input v-model="itme" :disabled="true"></el-input>
              </el-form-item>
              <span class="squ"
                >该时区当前时间&nbsp;&nbsp;&nbsp;{{ getMonday() }}</span
              >
            </div>
            <p class="the_title"><i></i> 考勤班次</p>
            <el-form-item
              class="fdsvdscas"
              label="考勤类型:"
              prop="dx"
              label-width="76px"
            >
              <el-radio-group @change="funcdxs" v-model="ruleForm.dx">
                <el-radio label="1">固定班制</el-radio>
                <el-radio label="2">排班制</el-radio>
                <el-radio label="3">自由班制</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="texgscssc">{{ texter }}</div>
            <!-- -------------------------------------------------------------------------- -->
            <div class="csaxaxa" v-if="ruleForm.dx == '1'">
              <div style="padding-left: 6px">班次设置：</div>
              <div class="yansheqian">
                三班制: 09:00 - 11:30, 13:30 - 17:30, 19:30 - 20:00
              </div>
              <div class="feiqiang">详情</div>
              <div class="feiqiang" @click="bumengxz = true">更改</div>
            </div>
            <el-table
              v-if="ruleForm.dx == '1'"
              @selection-change="xdszzxxq"
              ref="yteucbhdbcjcbk"
              :data="bcdata"
              tooltip-effect="dark"
              style="width: 100%"
              border
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="name" label="工作日"></el-table-column>
              <el-table-column
                prop="bc"
                width="320"
                label="班次"
              ></el-table-column>
              <el-table-column xxx="name" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small">详情</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="youggaide(scope.row)"
                    >更改</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- ---------------------------------------------------------------------- -->
            <div v-if="ruleForm.dx == '3'">
              <el-form-item label="打卡时间设置:" prop="sj" label-width="106px">
                <el-time-picker
                  is-range
                  v-model="ruleForm.sj"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                >
                </el-time-picker>
              </el-form-item>

              <el-form-item label="工作日设置:" prop="xxs" label-width="106px">
                <el-checkbox-group v-model="ruleForm.xxs">
                  <el-checkbox label="周一"></el-checkbox>
                  <el-checkbox label="周二"></el-checkbox>
                  <el-checkbox label="周三"></el-checkbox>
                  <el-checkbox label="周四"></el-checkbox>
                  <el-checkbox label="周五"></el-checkbox>
                  <el-checkbox label="周六"></el-checkbox>
                  <el-checkbox label="周日"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="缺卡设置:" prop="saw" label-width="106px">
                <el-checkbox v-model="ruleForm.saw"
                  >工作日不打卡记为缺卡</el-checkbox
                >
              </el-form-item>
            </div>
            <!-- --------------------------------------------------------------------------------------- -->
            <div v-if="ruleForm.dx == '1' || ruleForm.dx == '3'">
              排休设置：按照《{{ itme }}》自动排休&nbsp;&nbsp;&nbsp;<el-button
                type="text"
                size="small"
                >查看排休日历</el-button
              >
            </div>
            <!-- ================================== -->
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 人员选择弹框 -->
      <el-dialog
        :title="kq_text + '人员选择'"
        :visible.sync="user_add"
        width="730px"
      >
        <div>
          部门：<el-cascader
            :options="options"
            :props="props"
            collapse-tags
            clearable
            @change="handleChange"
          ></el-cascader>
        </div>
        <div class="cascader_choose">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div class="biaoti">
            <div>姓名</div>
            <div>岗位</div>
            <div>部门</div>
          </div>
          <el-checkbox-group v-model="multipleSelection" class="xzyuans">
            <!-- @change="handleCheckedCitiesChange" -->
            <div v-for="(item, index) in choose_data" :key="index">
              <el-checkbox :label="item.id">
                <div class="dxuan">
                  <div>{{ item.realName }}</div>
                  <div>{{ item.jobName }}</div>
                  <div>{{ item.deptName }}</div>
                </div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="user_add = false">取 消</el-button>
          <el-button type="primary" @click="user_add = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 班次选择弹框 -->
      <el-dialog
        title="班次选择"
        :visible.sync="bumengxz"
        width="730px"
        :close-on-click-modal="false"
      >
        <div class="rdudsxvuhgsci">
          <div class="scsdsxx">
            班次：<el-input
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
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="name" label="班次名称"></el-table-column>
          <el-table-column prop="xxx" label="考勤时间"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bumengxz = false">取 消</el-button>
          <el-button type="primary" @click="xuanhaole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { dept_list, dept_id } from "@/api/human";
export default {
  data() {
    return {
      // 班次表格数据
      bcdata: [
        { name: "周一", bc: "两班制: 09:00 - 11:30; 13:30 - 17:30;" },
        { name: "周二", bc: "两班制: 09:00 - 11:30; 13:30 - 17:30;" },
        { name: "周三", bc: "两班制: 09:00 - 11:30; 13:30 - 17:30;" },
        { name: "周四", bc: "两班制: 09:00 - 11:30; 13:30 - 17:30;" },
        { name: "周五", bc: "两班制: 09:00 - 11:30; 13:30 - 17:30;" },
        { name: "周六", bc: "两班制: 09:00 - 11:30; 13:30 - 17:30;" },
        { name: "周日", bc: "两班制: 09:00 - 11:30; 13:30 - 17:30;" },
      ],
      vdvsvsvsca: [], //班次选中的数据
      qxjixsz: [], //选中的星期
      texter: "考勤组内每位人员的上下班时间一致", //考勤类型展示文字
      itme: "GMT +08:00 中国标准时间",
      kq_text: "",
      text_wenz: "", //弹框标题
      getids: [], //所选部门ID
      checkAll: false, //全选样式
      isIndeterminate: true, //全选样式
      multipleSelection: [], //选择的用户
      choose_data: [], //选择部门获取的用户
      user_add: false, //人员选择开关
      bumengxz: false, //班次选择开关
      // 用户选择规则
      props: {
        // multiple: true,
        value: "id",
        label: "name",
        children: "childList",
      },
      options: [], //机构数据
      // 查询条件
      conditions: {
        bcmc: "", //班次名称
        date: [], //创建日期
      },
      startPlaceholder: "", //条件默认开始时间
      endPlaceholder: "", //条件默认结束时间
      //   展示数据
      tableData: [
        { name: "xxxx", xxx: "1231" },
        { name: "xxxx", xxx: "1232" },
        { name: "xxxx", xxx: "1233" },
        { name: "xxxx", xxx: "1234" },
        { name: "xxxx", xxx: "1235" },
      ],
      dialogVisible: false, //弹框开关
      //   增改数据
      ruleForm: {
        xx: "1",
        dx: "1",
        sj: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        xxs: ["周一"],
        saw: true,
      },
    };
  },
  mounted() {
    this.getMonday();
    this.endPlaceholder = this.getMonday();
    this.startPlaceholder = this.getMonday(30);
    this.get_institutions();
  },
  methods: {
        // 点击删除
    the_remove(e){
      console.log(e);
        this.$confirm('确认删除'+e.xxx, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 打开更改星期
    youggaide(E) {
      this.bumengxz = true;
    },
    // 选中的星期
    xdszzxxq(val) {
      this.qxjixsz = val;
    },
    // 班次选择确认
    xuanhaole() {
      if (this.vdvsvsvsca.length !== 1) {
        return this.$message({
          message: "请选中一个班次",
          type: "warning",
        });
      } else {
        this.bumengxz = false;
      }
    },
    // 选中的班次
    handleSelectionChange(val) {
      this.vdvsvsvsca = val;
    },
    // 考勤类型选择
    funcdxs(e) {
      if (e == 1) {
        this.texter = "考勤组内每位人员的上下班时间一致";
      } else if (e == 2) {
        this.texter = "自定义设置每人的班次，请在保存考勤组设置后再进行排班";
      } else if (e == 3) {
        this.texter = "不设置班次，随时打卡";
      }
    },
    // 选人开关
    kaoqwfunc(i) {
      if (i == 1) {
        this.kq_text = "参与考勤";
      } else {
        this.kq_text = "无需考勤";
      }
      this.user_add = true;
    },
    // 人员全选全部选
    handleCheckAllChange(val) {
      if (val) {
        var newArr = this.multipleSelection.concat(this.getids);
        newArr = newArr.sort();
        this.multipleSelection = Array.from(new Set(newArr));
      } else {
        this.getids.map((e) => {
          if (this.multipleSelection.indexOf(e) != -1) {
            this.multipleSelection.splice(this.multipleSelection.indexOf(e), 1);
          }
        });
      }
      this.isIndeterminate = false;
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
      // new Date().getTime() - 24 * 60 * 60 * 1000;
      //   let now = new Date();
      //   alert(this.$dayjs(now).format("YYYY-MM-DD"));
      //   alert(
      //     // this.$dayjs(new Date(now.getTime() - 24 * 60 * 60 * 1000)).format("YYYY年MM月")
      //     this.$dayjs(new Date(now.getTime() - 24 * 60 * 60 * 1000)).format(
      //       "YYYY-MM-DD"
      //     )
      //   );
      //   "yyyy-MM-dd HH:mm"
      // dayjs(currentDate).format("YYYY年MM月");

      //   createTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      //   let nowTime = now.getTime();
      //   let day = now.getDay();
      //   let longTime = 24 * 60 * 60 * 1000;
      //   let n = longTime * 7 * (dates || 0);
      //   let dd = "";
      //   if (type == "s") {
      //     dd = nowTime - (day - 1) * longTime + n;
      //   }
      //   if (type == "e") {
      //     dd = nowTime + (7 - day) * longTime + n;
      //   }
      //   dd = new Date(dd);
      //   let y = dd.getFullYear();
      //   let m = dd.getMonth() + 1;
      //   let d = dd.getDate();
      //   m = m < 10 ? "0" + m : m;
      //   d = d < 10 ? "0" + d : d;
      //   let day2 = y + "-" + m + "-" + d;
      //   return day2;
    },
    // 点击编辑按钮
    the_editor(e) {
      console.log(e);
      this.text_wenz = "编辑";
      this.dialogVisible = true;
    },
    // 分页更改页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页更改页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 新增
    func_add() {
      this.text_wenz = "新增";
      this.dialogVisible = true;
      this.$refs.yteucbhdbcjcbk.clearSelection();
      for (var i = 0; i < this.bcdata.length; i++) {
        if (i <= 4) {
          this.$refs.yteucbhdbcjcbk.toggleRowSelection(this.bcdata[i]);
        }
      }
    },
    // 获取机构
    get_institutions() {
      dept_list().then((res) => {
        if (res.data.code == 0) {
          this.options = res.data.data;
        }
      });
    },
    // 选中部门获取人员
    handleChange(e, res) {
      dept_id({ data: e[e.length - 1] })
        .then((res) => {
          if (res.data.code == 0) {
            this.isIndeterminate = true;
            if (res.data.data.length != 0) {
              this.choose_data = res.data.data;
              this.getids = this.choose_data.map((req) => {
                return req.id;
              });
            } else {
              this.choose_data = [];
              this.getids = [];
            }
          }
        })
        .catch((e) => {
          this.choose_data = [];
          this.getids = [];
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./attendance.scss";
</style>