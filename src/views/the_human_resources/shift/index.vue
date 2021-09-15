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
            <el-form-item label="班次名称：" prop="bcmc">
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
          <el-table-column prop="name" label="班次名称"> </el-table-column>
          <el-table-column prop="name" label="考勤时间"> </el-table-column>
          <el-table-column prop="name" label="创建人"> </el-table-column>
          <el-table-column prop="name" label="创建时间"> </el-table-column>
          <el-table-column xxx="name" label="操作">
            <template slot-scope="scope">
              <el-button type="success" icon="el-icon-search" size="mini"  @click="the_xqxx"
                >详情</el-button
              >
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
          <el-form label-width="80px" :model="ruleForm">
            <div class="inpu_cross">
              <el-form-item label="班次名称:" prop="xxx">
                <el-input v-model="ruleForm.xxx"></el-input>
              </el-form-item>
              <el-form-item
                style="margin-left: 180px"
                label="班次标记:"
                prop="ys"
              >
                <colorPicker v-model="ruleForm.ys" />
              </el-form-item>
            </div>
            <div class="xianxka">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="一次上下班" name="first">
                  <div class="xxkli">
                    <div class="dxuank">
                      <p>考勤方式:</p>
                      <el-radio v-model="ruleForm.kqfs" label="1"
                        >固定时间考勤</el-radio
                      >
                      <el-radio v-model="ruleForm.kqfs" label="2"
                        >弹性考勤</el-radio
                      >
                    </div>
                    <div class="sjiaxuanz">
                      <div class="gzsjian">工作时长：7小时0分钟</div>
                      <div class="itmesjian">
                        <div class="sjianmok">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="上班时间:"
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="二次上下班" name="second">
                  <div class="xxkli">
                    <div class="dxuank">
                      <p>考勤方式:</p>
                      <el-radio v-model="ruleForm.kqfs" label="1"
                        >固定时间考勤</el-radio
                      >
                      <el-radio v-model="ruleForm.kqfs" label="2" disabled
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
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
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
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div></el-tab-pane
                >
                <el-tab-pane label="三次上下班" name="third"
                  ><div class="xxkli">
                    <div class="dxuank">
                      <p>考勤方式:</p>
                      <el-radio v-model="ruleForm.kqfs" label="1"
                        >固定时间考勤</el-radio
                      >
                      <el-radio v-model="ruleForm.kqfs" label="2" disabled
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
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
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
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
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
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为迟到
                            </div>
                            <div>
                              <div class="leftbti">晚到超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最早可提前</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟进行打卡
                            </div>
                          </div>
                        </div>
                        <div class="sjianmok" style="margin-top: 10px">
                          <div style="margin-top: 4px">
                            <el-form-item
                              label="下班时间:"
                              prop="xxx"
                              label-width="80px"
                            >
                              <el-time-picker
                                style="width: 120px"
                                v-model="ruleForm.xxx"
                                placeholder="请选择"
                              >
                              </el-time-picker>
                            </el-form-item>
                          </div>
                          <div class="right_sjians">
                            <div v-if="ruleForm.kqfs == 1">
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为早退
                            </div>
                            <div>
                              <div class="leftbti">最早超过</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
                                ></el-input> </el-form-item
                              >分钟记为半天缺卡
                            </div>
                            <div>
                              <div class="leftbti">最晚可延后</div>
                              <el-form-item label prop="sj" label-width="0px">
                                <el-input
                                  style="width: 80px"
                                  v-model="ruleForm.sj"
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
                  <el-checkbox v-model="checked"></el-checkbox>
                  <el-form-item
                    label="中途休息时间:"
                    prop="xx"
                    label-width="110px"
                  >
                    <el-time-picker
                      is-range
                      v-model="ruleForm.xx"
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
                  <el-checkbox v-model="checked">下班免打卡</el-checkbox>
                  <div class="cksjchs">开启后，系统将自动打下班卡</div>
                </div>
                <div class="naijidjsd">
                  <el-checkbox v-model="checked">晚走次日晚到</el-checkbox>
                  <div class="cksjchs">该规则不支持排班制和自由班制</div>
                </div>
                <div class="naijidjsd">
                  <el-checkbox v-model="checked">
                    <div class="cvvdcwsc">
                      晚到超过
                      <el-form-item label prop="sj" label-width="0px">
                        <el-input
                          style="width: 80px"
                          v-model="ruleForm.sj"
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
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // value1: [],
      checked: false, //复选
      activeName: "first", //标签页选中页
      conditions: {
        bcmc: "", //班次名称
        date: [], //创建日期
      },
      //   站视数据
      tableData: [{ name: "xxxx", xxx: "123" },{ name: "xxxx", xxx: "123" },{ name: "xxxx", xxx: "123" }],
      startPlaceholder: "", //条件默认开始时间
      endPlaceholder: "", //条件默认结束时间
      dialogVisible: false, //弹框开关
      text_wenz: "xxx", //弹框标题
      //   增改数据
      ruleForm: {
        ys: "#409EFF",
        xx: "1",
        kqfs: "1",
        sj: "",
        xx: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      },
    };
  },
  mounted() {
    this.endPlaceholder = this.getMonday();
    this.startPlaceholder = this.getMonday(30);
  },
  methods: {
    // 标签页改变函数
    handleClick(tab) {
      if (tab.name != "first") {
        this.ruleForm.kqfs = "1";
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
            // 点击编辑按钮
    the_xqxx(e) {
      console.log(e);
      this.text_wenz = "详情";
      this.dialogVisible = true;
    },
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
    // 分页更改页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页更改页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>
<style lang="scss">
@import "./shift.scss";
</style>