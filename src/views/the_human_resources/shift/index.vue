<template>
  <div class="shift">
    <div class="box">
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
            <el-form-item
              label="班次名称/创建人："
              prop="bcmc"
              label-width="130px"
            >
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
          <div class="form_item" style="margin-left: 20px">
            <el-checkbox v-model="danqinzk">只查看我创建的班次</el-checkbox>
          </div>
          <!--  -->
        </el-form>
        <!-- 操作按钮 -->
        <div>
          <el-button @click="func_add" size="small">新增</el-button>
          <el-button @click="getlist(1)" size="small" type="primary"
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
          <el-table-column
            prop="shiftName"
            label="班次名称"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="sj"
            label="考勤时间"
            min-width="160"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="createBy"
            label="创建人"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column xxx="name" label="操作" width="260">
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-search"
                size="mini"
                @click="the_xqxx(scope.row)"
                >详情</el-button
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
            :page-size="conditions.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totals"
            :current-page.sync="conditions.page"
          >
          </el-pagination>

          <!-- conditions: {
        date: [], //创建日期
        createBy: "", //当前登录人姓名
        createTime: "", //创建日期开始
        endTime: "", //创建日期结束
        page: 1,
        pageSize: 10,
        searchContent: "", //班次名称、创建人姓名
      }, -->
        </div>
      </div>
      <!-- 增改框 -->
      <el-dialog :title="text_wenz" :visible.sync="dialogVisible" width="800px">
        <div class="add_box">
          <el-form
            label-width="90px"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
          >
            <div class="inpu_cross">
              <el-form-item label="班次名称:" prop="shiftName">
                <el-input
                  :disabled="bdsfkbj"
                  v-model="ruleForm.shiftName"
                ></el-input>
              </el-form-item>
              <el-form-item
                style="margin-left: 180px"
                label="班次标记:"
                prop="signType"
              >
                <colorPicker v-model="ruleForm.signType" />
              </el-form-item>
            </div>
            <!-- ----------------------------------------- -->
            <div class="xianxka">
              <el-tabs
                v-model="ruleForm.commutingType"
                @tab-click="handleClick"
              >
                <el-tab-pane label="一次上下班" :name="1">
                  <div class="xxkli">
                    <div class="dxuank">
                      <p>考勤方式:</p>
                      <el-radio
                        v-model="ruleForm.attendanceType"
                        :label="1"
                        :disabled="bdsfkbj"
                        >固定时间考勤</el-radio
                      >
                      <el-radio
                        v-model="ruleForm.attendanceType"
                        :label="2"
                        :disabled="bdsfkbj"
                        >弹性考勤</el-radio
                      >
                    </div>
                    <div class="sjiaxuanz">
                      <!-- <div class="gzsjian">工作时长：7小时0分钟</div> -->
                      <div class="itmesjian">
                        <div class="sjianmok">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="上班时间:"
                              prop="shiftCommuteList[0].workStartTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                :disabled="bdsfkbj"
                                style="width: 120px"
                                v-model="
                                  ruleForm.shiftCommuteList[0].workStartTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].lateTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].lateTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].absenteeismTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].absenteeismTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].punchAdvanceTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0]
                                      .punchAdvanceTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="shiftCommuteList[0].workEndTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[0].workEndTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].leaveEarlyTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].leaveEarlyTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].notClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].notClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].postponeClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0]
                                      .postponeClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <!-- ---------------------------------------------------------- -->
                <el-tab-pane label="二次上下班" :name="2">
                  <div class="xxkli" v-if="ruleForm.commutingType == 2">
                    <div class="dxuank">
                      <p>考勤方式:</p>
                      <el-radio v-model="ruleForm.attendanceType" :label="1"
                        >固定时间考勤</el-radio
                      >
                      <el-radio
                        v-model="ruleForm.attendanceType"
                        :label="2"
                        disabled
                        >弹性考勤</el-radio
                      >
                    </div>
                    <div class="sjiaxuanz">
                      <div class="gzsjian">工作时长：7小时0分钟</div>
                      <div class="itmesjian">
                        <div class="nbistide">
                          <div>1</div>
                          第一次上班时间
                        </div>
                        <div class="sjianmok">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="上班时间:"
                              prop="shiftCommuteList[0].workStartTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[0].workStartTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].lateTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].lateTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].absenteeismTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].absenteeismTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].punchAdvanceTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0]
                                      .punchAdvanceTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="shiftCommuteList[0].workEndTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[0].workEndTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].leaveEarlyTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].leaveEarlyTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].notClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].notClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].postponeClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0]
                                      .postponeClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="gunx"></div>
                        <div class="nbistide">
                          <div>2</div>
                          第二次上班时间
                        </div>
                        <div class="sjianmok">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="上班时间:"
                              prop="shiftCommuteList[1].workStartTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="
                                  ruleForm.shiftCommuteList[1].workStartTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].lateTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].lateTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].absenteeismTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].absenteeismTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].punchAdvanceTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1]
                                      .punchAdvanceTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="shiftCommuteList[1].workEndTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[1].workEndTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].leaveEarlyTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].leaveEarlyTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].notClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].notClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].postponeClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1]
                                      .postponeClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div></el-tab-pane
                >
                <!-- ---------------------------------------------------------- -->
                <el-tab-pane label="三次上下班" :name="3"
                  ><div class="xxkli" v-if="ruleForm.commutingType == 3">
                    <div class="dxuank">
                      <p>考勤方式:</p>
                      <el-radio v-model="ruleForm.attendanceType" :label="1"
                        >固定时间考勤</el-radio
                      >
                      <el-radio
                        v-model="ruleForm.attendanceType"
                        :label="2"
                        disabled
                        >弹性考勤</el-radio
                      >
                    </div>
                    <div class="sjiaxuanz">
                      <div class="gzsjian">工作时长：7小时0分钟</div>
                      <div class="itmesjian">
                        <div class="nbistide">
                          <div>1</div>
                          第一次上班时间
                        </div>
                        <div class="sjianmok">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="上班时间:"
                              prop="shiftCommuteList[0].workStartTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[0].workStartTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].lateTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].lateTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].absenteeismTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].absenteeismTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].punchAdvanceTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0]
                                      .punchAdvanceTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="shiftCommuteList[0].workEndTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[0].workEndTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].leaveEarlyTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].leaveEarlyTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].notClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0].notClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[0].postponeClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[0]
                                      .postponeClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="gunx"></div>
                        <div class="nbistide">
                          <div>2</div>
                          第二次上班时间
                        </div>
                        <div class="sjianmok">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="上班时间:"
                              prop="shiftCommuteList[1].workStartTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[1].workStartTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].lateTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].lateTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].absenteeismTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].absenteeismTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].punchAdvanceTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1]
                                      .punchAdvanceTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="shiftCommuteList[1].workEndTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[1].workEndTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].leaveEarlyTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].leaveEarlyTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].notClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1].notClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[1].postponeClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[1]
                                      .postponeClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="gunx"></div>
                        <div class="nbistide">
                          <div>3</div>
                          第三次上班时间
                        </div>
                        <div class="sjianmok">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="上班时间:"
                              prop="shiftCommuteList[2].workStartTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[2].workStartTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[2].lateTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[2].lateTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[2].absenteeismTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[2].absenteeismTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[2].punchAdvanceTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[2]
                                      .punchAdvanceTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="shiftCommuteList[2].workEndTime"
                              label-width="90px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                :disabled="bdsfkbj"
                                v-model="
                                  ruleForm.shiftCommuteList[2].workEndTime
                                "
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.attendanceType == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[2].leaveEarlyTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[2].leaveEarlyTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[2].notClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[2].notClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item
                                label
                                prop="shiftCommuteList[2].postponeClockTime"
                                label-width="0px"
                              >
                                <el-input
                                  style="width: 80px"
                                  :disabled="bdsfkbj"
                                  v-model="
                                    ruleForm.shiftCommuteList[2]
                                      .postponeClockTime
                                  "
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div></el-tab-pane
                >
              </el-tabs>
            </div>
            <el-collapse class="zbinab">
              <el-collapse-item title="更多考勤规则">
                <div class="naijidjsd">
                  <el-checkbox
                    :disabled="bdsfkbj"
                    v-model="checked"
                  ></el-checkbox>
                  <el-form-item
                    label="中途休息时间:"
                    prop="xx"
                    label-width="110px"
                  >
                    <el-time-picker
                      is-range
                      v-model="ruleForm.xxsj"
                      :disabled="bdsfkbj"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                    >
                    </el-time-picker>
                  </el-form-item>
                  <div class="cksjchs">休息时间将不计入工时</div>
                </div>
                <div class="naijidjsd">
                  <el-checkbox
                    v-model="ruleForm.punchOutFree"
                    :disabled="bdsfkbj"
                    >下班免打卡</el-checkbox
                  >
                  <div class="cksjchs">开启后，系统将自动打下班卡</div>
                </div>
                <div class="naijidjsd">
                  <el-checkbox
                    v-model="ruleForm.lateToArrive"
                    :disabled="bdsfkbj"
                    >晚走次日晚到</el-checkbox
                  >
                  <div class="cksjchs">该规则不支持排班制和自由班制</div>
                </div>
                <div class="naijidjsd">
                  <el-checkbox v-model="checked" :disabled="bdsfkbj">
                    <div class="cvvdcwsc">
                      晚到超过
                      <el-form-item
                        label
                        prop="seriousLateTime"
                        label-width="0px"
                      >
                        <el-input
                          style="width: 80px"
                          v-model="ruleForm.seriousLateTime"
                          :disabled="bdsfkbj"
                        ></el-input> </el-form-item
                      >分钟记为严重迟到
                    </div>
                  </el-checkbox>
                  <div class="cksjchs">
                    严重迟到分钟数应大于迟到分钟数，且小于上班缺卡分钟数
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            v-if="!bdsfkbj && gzyz == 2"
            type="primary"
            @click="submitForm('ruleForm')"
            >确 定</el-button
          >
          <el-button
            v-if="!bdsfkbj && gzyz == 1"
            type="primary"
            @click="gxbdan('ruleForm')"
            >更 新</el-button
          >
          <!--  -->
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
//
import { shift_add, shift_list, shift_delete, shift_update } from "@/api/human";
export default {
  data() {
    return {
      // 表单验证
      rules: {
        shiftName: [
          { required: true, message: "请输入班次名称", trigger: "blur" },
        ],

        "shiftCommuteList[0].workStartTime": [
          { required: true, message: "请选择上班时间", trigger: "change" },
        ],
        "shiftCommuteList[1].workStartTime": [
          { required: true, message: "请选择上班时间", trigger: "change" },
        ],
        "shiftCommuteList[2].workStartTime": [
          { required: true, message: "请选择上班时间", trigger: "change" },
        ],
        "shiftCommuteList[0].workEndTime": [
          { required: true, message: "请选择下班时间", trigger: "change" },
        ],
        "shiftCommuteList[1].workEndTime": [
          { required: true, message: "请选择下班时间", trigger: "change" },
        ],
        "shiftCommuteList[2].workEndTime": [
          { required: true, message: "请选择下班时间", trigger: "change" },
        ],
      },
      checked: false, //复选
      // 查询条件
      conditions: {
        date: [], //创建日期
        createBy: "", //当前登录人姓名
        createTime: "", //创建日期开始
        endTime: "", //创建日期结束
        page: 1,
        pageSize: 10,
        searchContent: "", //班次名称、创建人姓名
      },
      totals: 0, //列表总条数
      danqinzk: false, //条件是否只查看我创建的班次
      //   展示数据
      tableData: [],
      startPlaceholder: "", //条件默认开始时间
      endPlaceholder: "", //条件默认结束时间
      dialogVisible: false, //弹框开关
      text_wenz: "", //弹框标题
      gzyz: 1, //编辑或新增
      ruleForm: {}, //   增改数据
      bdsfkbj: false, //表单是否可编辑
      // 默认数据
      moren: {
        shiftCommuteList: [
          {
            lateTime: 0, //迟到
            absenteeismTime: 0, //迟到缺
            punchAdvanceTime: 0, //提前打卡
            leaveEarlyTime: 0, //早退
            notClockTime: 0, //早退缺卡
            postponeClockTime: 0, //延后打卡
            workEndTime: "", //下班时间
            workStartTime: "", //上班时间
          },
        ],
        attendanceType: 1, //考勤方式
        commutingType: 1, //上下班类型-标签页选中页
        restEndTime: 0, //中途休息结束时间
        restStartTime: 0, //中途休息开始时间
        xxsj: [new Date(), new Date()], //中途休息时间
        createBy: "", //创建人名
        lateToArrive: false, //是否晚走晚到（0否1是）
        punchOutFree: false, //是否免打卡（0否1是）
        seriousLateTime: 0, //严重迟到时间范围
        shiftName: "", //班次名称
        signType: "#409EFF", //班次标记类型
      },
    };
  },
  created() {
    this.ruleForm = JSON.parse(JSON.stringify(this.moren));
  },
  mounted() {
    this.endPlaceholder = this.getMonday();
    this.startPlaceholder = this.getMonday(30);
    this.getlist(1);
  },
  methods: {
    // 更新表单
    gxbdan(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证通过
          var ser = JSON.parse(JSON.stringify(this.ruleForm));
          ser.lateToArrive = ser.lateToArrive ? 1 : 0;
          ser.punchOutFree = ser.punchOutFree ? 1 : 0;
          ser.shiftCommuteList[0].workEndTime = this.$dayjs(
            ser.shiftCommuteList[0].workEndTime
          ).format("YYYY-MM-DD HH:mm:ss");
          ser.shiftCommuteList[0].workStartTime = this.$dayjs(
            ser.shiftCommuteList[0].workStartTime
          ).format("YYYY-MM-DD HH:mm:ss");

          if (
            ser.shiftCommuteList[0].workEndTime <
            ser.shiftCommuteList[0].workStartTime
          ) {
            return this.$message({
              message: "上班时间大于下班时间，请重新选择",
              type: "error",
            });
          }

          if (ser.commutingType == 2) {
            ser.shiftCommuteList[1].workEndTime = this.$dayjs(
              ser.shiftCommuteList[1].workEndTime
            ).format("YYYY-MM-DD HH:mm:ss");
            ser.shiftCommuteList[1].workStartTime = this.$dayjs(
              ser.shiftCommuteList[1].workStartTime
            ).format("YYYY-MM-DD HH:mm:ss");
            if (
              ser.shiftCommuteList[1].workEndTime <
              ser.shiftCommuteList[1].workStartTime
            ) {
              return this.$message({
                message: "上班时间大于下班时间，请重新选择",
                type: "error",
              });
            }
          } else if (ser.commutingType == 3) {
            ser.shiftCommuteList[1].workEndTime = this.$dayjs(
              ser.shiftCommuteList[1].workEndTime
            ).format("YYYY-MM-DD HH:mm:ss");

            ser.shiftCommuteList[2].workEndTime = this.$dayjs(
              ser.shiftCommuteList[2].workEndTime
            ).format("YYYY-MM-DD HH:mm:ss");

            ser.shiftCommuteList[1].workStartTime = this.$dayjs(
              ser.shiftCommuteList[1].workStartTime
            ).format("YYYY-MM-DD HH:mm:ss");

            ser.shiftCommuteList[2].workStartTime = this.$dayjs(
              ser.shiftCommuteList[2].workStartTime
            ).format("YYYY-MM-DD HH:mm:ss");
            if (
              ser.shiftCommuteList[1].workEndTime <
              ser.shiftCommuteList[1].workStartTime
            ) {
              return this.$message({
                message: "上班时间大于下班时间，请重新选择",
                type: "error",
              });
            }
            if (
              ser.shiftCommuteList[2].workEndTime <
              ser.shiftCommuteList[2].workStartTime
            ) {
              return this.$message({
                message: "上班时间大于下班时间，请重新选择",
                type: "error",
              });
            }
          }
          if (ser.xxsj[0]) {
            ser.restStartTime = this.$dayjs(ser.xxsj[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          if (ser.xxsj[1]) {
            ser.restEndTime = this.$dayjs(ser.xxsj[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          shift_update(ser).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.dialogVisible = false;
              this.resetForm("ruleForm");
              this.getlist(1);
              return this.$message({ message: "操作成功", type: "success" });
            }
          });
        } else {
          // 验证未通过
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证通过
          var ser = JSON.parse(JSON.stringify(this.ruleForm));
          ser.lateToArrive = ser.lateToArrive ? 1 : 0;
          ser.punchOutFree = ser.punchOutFree ? 1 : 0;
          ser.shiftCommuteList[0].workEndTime = this.$dayjs(
            ser.shiftCommuteList[0].workEndTime
          ).format("YYYY-MM-DD HH:mm:ss");
          ser.shiftCommuteList[0].workStartTime = this.$dayjs(
            ser.shiftCommuteList[0].workStartTime
          ).format("YYYY-MM-DD HH:mm:ss");

          if (
            new Date(ser.shiftCommuteList[0].workEndTime) <
            new Date(ser.shiftCommuteList[0].workStartTime)
          ) {
            return this.$message({
              message: "上班时间大于下班时间，请重新选择",
              type: "error",
            });
          }
          if (ser.commutingType == 2) {
            ser.shiftCommuteList[1].workEndTime = this.$dayjs(
              ser.shiftCommuteList[1].workEndTime
            ).format("YYYY-MM-DD HH:mm:ss");
            ser.shiftCommuteList[1].workStartTime = this.$dayjs(
              ser.shiftCommuteList[1].workStartTime
            ).format("YYYY-MM-DD HH:mm:ss");
            if (
              ser.shiftCommuteList[1].workEndTime <
              ser.shiftCommuteList[1].workStartTime
            ) {
              return this.$message({
                message: "上班时间大于下班时间，请重新选择",
                type: "error",
              });
            }
          } else if (ser.commutingType == 3) {
            ser.shiftCommuteList[1].workEndTime = this.$dayjs(
              ser.shiftCommuteList[1].workEndTime
            ).format("YYYY-MM-DD HH:mm:ss");

            ser.shiftCommuteList[2].workEndTime = this.$dayjs(
              ser.shiftCommuteList[2].workEndTime
            ).format("YYYY-MM-DD HH:mm:ss");

            ser.shiftCommuteList[1].workStartTime = this.$dayjs(
              ser.shiftCommuteList[1].workStartTime
            ).format("YYYY-MM-DD HH:mm:ss");

            ser.shiftCommuteList[2].workStartTime = this.$dayjs(
              ser.shiftCommuteList[2].workStartTime
            ).format("YYYY-MM-DD HH:mm:ss");
            if (
              ser.shiftCommuteList[1].workEndTime <
              ser.shiftCommuteList[1].workStartTime
            ) {
              return this.$message({
                message: "上班时间大于下班时间，请重新选择",
                type: "error",
              });
            }
            if (
              ser.shiftCommuteList[2].workEndTime <
              ser.shiftCommuteList[2].workStartTime
            ) {
              return this.$message({
                message: "上班时间大于下班时间，请重新选择",
                type: "error",
              });
            }
          }
          if (ser.xxsj[0]) {
            ser.restStartTime = this.$dayjs(ser.xxsj[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          if (ser.xxsj[1]) {
            ser.restEndTime = this.$dayjs(ser.xxsj[1]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          shift_add(ser).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.dialogVisible = false;
              this.resetForm("ruleForm");
              this.getlist(1);
              return this.$message({ message: "操作成功", type: "success" });
            }
          });
        } else {
          // 验证未通过
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 初始化验证
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 标签页改变函数
    handleClick(tab) {
      var e = tab.name;
      if (tab.name != 1) {
        this.ruleForm.attendanceType = 1;
      }
      if (e == 1) {
        this.ruleForm.shiftCommuteList = [
          {
            lateTime: 0, //迟到
            absenteeismTime: 0, //迟到缺
            punchAdvanceTime: 0, //提前打卡
            leaveEarlyTime: 0, //早退
            notClockTime: 0, //早退缺卡
            postponeClockTime: 0, //延后打卡
            workEndTime: "", //下班时间
            workStartTime: "", //上班时间
          },
        ];
      } else if (e == 2) {
        this.ruleForm.shiftCommuteList = [
          {
            lateTime: 0, //迟到
            absenteeismTime: 0, //迟到缺
            punchAdvanceTime: 0, //提前打卡
            leaveEarlyTime: 0, //早退
            notClockTime: 0, //早退缺卡
            postponeClockTime: 0, //延后打卡
            workEndTime: "", //下班时间
            workStartTime: "", //上班时间
          },
          {
            lateTime: 0, //迟到
            absenteeismTime: 0, //迟到缺
            punchAdvanceTime: 0, //提前打卡
            leaveEarlyTime: 0, //早退
            notClockTime: 0, //早退缺卡
            postponeClockTime: 0, //延后打卡
            workEndTime: "", //下班时间
            workStartTime: "", //上班时间
          },
        ];
      } else if (e == 3) {
        this.ruleForm.shiftCommuteList = [
          {
            lateTime: 0, //迟到
            absenteeismTime: 0, //迟到缺
            punchAdvanceTime: 0, //提前打卡
            leaveEarlyTime: 0, //早退
            notClockTime: 0, //早退缺卡
            postponeClockTime: 0, //延后打卡
            workEndTime: "", //下班时间
            workStartTime: "", //上班时间
          },
          {
            lateTime: 0, //迟到
            absenteeismTime: 0, //迟到缺
            punchAdvanceTime: 0, //提前打卡
            leaveEarlyTime: 0, //早退
            notClockTime: 0, //早退缺卡
            postponeClockTime: 0, //延后打卡
            workEndTime: "", //下班时间
            workStartTime: "", //上班时间
          },
          {
            lateTime: 0, //迟到
            absenteeismTime: 0, //迟到缺
            punchAdvanceTime: 0, //提前打卡
            leaveEarlyTime: 0, //早退
            notClockTime: 0, //早退缺卡
            postponeClockTime: 0, //延后打卡
            workEndTime: "", //下班时间
            workStartTime: "", //上班时间
          },
        ];
      }
      this.resetForm("ruleForm");
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
    // 新增
    func_add() {
      this.gzyz = 2;
      this.ruleForm = JSON.parse(JSON.stringify(this.moren));
      this.bdsfkbj = false;
      this.ruleForm.commutingType = 1;
      this.text_wenz = "新增";
      this.dialogVisible = true;
      this.resetForm("ruleForm");
    },
    // 点击编辑按钮
    the_editor(e) {
      this.gzyz = 1;
      // this.resetForm("ruleForm");
      this.bdsfkbj = false;
      this.ruleForm = JSON.parse(JSON.stringify(e));
      this.ruleForm.xxsj = [
        new Date(this.ruleForm.restStartTime),
        new Date(this.ruleForm.restEndTime),
      ];
      this.ruleForm.lateToArrive =
        this.ruleForm.lateToArrive == 1 ? true : false;
      this.ruleForm.punchOutFree =
        this.ruleForm.punchOutFree == 1 ? true : false;
      this.text_wenz = "编辑";
      this.dialogVisible = true;
    },
    // 点击详情按钮
    the_xqxx(e) {
      // console.log(e);
      this.bdsfkbj = true;
      // this.ruleForm = e;
      this.ruleForm = JSON.parse(JSON.stringify(e));
      this.ruleForm.xxsj = [
        new Date(this.ruleForm.restStartTime),
        new Date(this.ruleForm.restEndTime),
      ];
      this.ruleForm.lateToArrive =
        this.ruleForm.lateToArrive == 1 ? true : false;
      this.ruleForm.punchOutFree =
        this.ruleForm.punchOutFree == 1 ? true : false;
      this.text_wenz = "详情";
      this.dialogVisible = true;
    },
    // 点击删除
    the_remove(e) {
      console.log(e);
      this.$confirm("确认删除【" + e.shiftName + "】", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          shift_delete({ id: e.id }).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getlist(1);
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },
    // 分页更改页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页更改页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 查询
    getlist(i) {
      if (this.conditions.date[0]) {
        this.conditions.createTime = this.$dayjs(
          this.conditions.date[0]
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.conditions.date[1]) {
        this.conditions.endTime = this.$dayjs(this.conditions.date[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (i == 1) {
        this.conditions.page = 1;
      }
      shift_list(this.conditions).then((res) => {
        if (res.data.code == 0) {
          this.totals = res.data.data.total || 0;
          this.tableData = res.data.data.records;
          this.tableData.map((e) => {
            e.sj = "";
            e.shiftCommuteList.map((w) => {
              e.sj +=
                this.$dayjs(w.workStartTime).format("HH:mm") +
                "-" +
                this.$dayjs(w.workEndTime).format("HH:mm") +
                " ";
            });
          });
        } else {
          this.totals = 0;
          this.tableData = [];
        }
      });
    },
  },
};
</script>
<style lang="scss">
@import "./shift.scss";
</style>