><template>
  <div class="classView">
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
              <td>姓名</td>
              <td v-for="item in 30" :key="item">
                <div>{{ item }}</div>
                <div>日</div>
              </td>
            </tr>
          </tbody>
          <tbody class="table_max_bottom">
            <tr v-for="(item, index) in tableData" :key="index">
              <td>{{ item.name }}</td>
              <td
                :class="
                  e.type == 0
                    ? 'coloer0'
                    : e.type == 1
                    ? 'coloer1'
                    : e.type == 2
                    ? 'coloer2'
                    : e.type == 3
                    ? 'coloer3'
                    : e.type == 4
                    ? 'coloer4'
                    : ''
                "
                v-for="(e, i) in item.typelist"
                :key="i"
              >
                {{ e.key }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <table style="margin: 0 auto;" width="700" border="0" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr v-if="d.psms!=1">
                        <td height="30" style="text-align: center;" colspan="2">
                            <img src="/vehins/prints/assets/cma-min.jpg" height="30">
                        </td>
                        <td class="hader" colspan="13">机动车安全技术检验表(仪器设备检验部分)</td>
                    </tr>
                    <tr v-else>
                        <td class="haders" colspan="15">机动车安全技术检验表(仪器设备检验部分)</td>
                    </tr>
                    <tr height="15" v-if="d.psms!=1">
                        <td style="text-align:center;" colspan="2">{{d.zzrdbh||pd_bsj}}</td>
                        <td style="text-align:right;" colspan="13">资质认定有效期至：{{d.zzrdyxq||pd_bsj}}</td>
                    </tr>
                </tbody> -->
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
    this.zsju();
  },
  methods: {
    zsju() {
      for (var i = 0; i < 22; i++) {
        this.tableData.push({ name: "小白白", typelist: [] });
        for (var j = 0; j < 30; j++) {
          if (j <= 8) {
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
@import "./classView.scss";
</style>