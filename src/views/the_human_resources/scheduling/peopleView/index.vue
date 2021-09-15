><template>
  <div class="peopleView">
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
      <!-- 表体 -->
      <div class="table_max">
        <table border="1">
          <tbody class="table_max_top">
            <tr>
              <td>日期</td>
              <td v-for="(item, index) in tableData" :key="index">
                {{ item.name }}
              </td>
              <!-- <td v-for="item in 30" :key="item">
                <div>{{ item }}</div>
                <div>日</div>
              </td> -->
            </tr>
          </tbody>
          <tbody class="table_max_bottom">
            <tr v-for="(item, index) in tableData" :key="index">
              <td>
                <div>{{ sjuer[index] }}</div>
                <div>日</div>
              </td>
              <td
                :class="'coloer' + tableData[ie].typelist[index].type"
                v-for="(e, ie) in tableData"
                :key="ie"
              >
                {{ tableData[ie].typelist[index].key }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sjuer: [], //测试数据2
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
    this.zsju();
  },
  methods: {
    // 造数据
    zsju() {
      for (var t = 0; t < 30; t++) {
        this.sjuer.push(t + 1);
      }
      for (var i = 0; i < 22; i++) {
        this.tableData.push({ name: "小白白", typelist: [] });
        for (var j = 0; j < 30; j++) {
          if (j == 1) {
            this.tableData[i].typelist.push({
              name: "小白1号",
              type: 1,
              key: "早班",
            });
          } else if (j <= 8) {
            this.tableData[i].typelist.push({
              name: "小白白",
              type: 1,
              key: "早班",
            });
          } else if (j <= 16) {
            this.tableData[i].typelist.push({
              name: "小白白",
              type: 2,
              key: "白班",
            });
          } else if (j <= 24) {
            this.tableData[i].typelist.push({
              name: "小白白",
              type: 3,
              key: "夜班",
            });
          } else {
            this.tableData[i].typelist.push({
              name: "小白白",
              type: 0,
              key: "休息",
            });
          }
        }
      }
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
@import "./peopleView.scss";
</style>