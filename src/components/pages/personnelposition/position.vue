<template>
    <div id="position">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="baseInfo">
                <el-row>
                    <el-col :span="19">
                        <el-row style="font-size: 13px;">
                            <el-col :span="6"><span class="label-base">编号:</span><span v-text="criminal.criCode"></span></el-col>
                            <el-col :span="6"><span class="label-base">姓名:</span><span v-text="criminal.criName"></span></el-col>
                            <el-col :span="6"><span class="label-base">性别:</span><span v-text="criminal.criGender"></span></el-col>
                            <el-col :span="6"><span class="label-base">身份证号:</span><span v-text="criminal.criIdcard"></span></el-col>
                        </el-row>
                        <el-row style="font-size: 13px;">
                            <el-col :span="6"><span class="label-base">生日:</span><span v-text="criminal.criBirthday"></span></el-col>
                            <el-col :span="6"><span class="label-base">民族:</span><span v-text="criminal.criNation"></span></el-col>
                            <el-col :span="6"><span class="label-base">籍贯:</span><span v-text="criminal.criOrigin"></span></el-col>
                            <el-col :span="6"><span class="label-base">婚姻状况:</span><span v-text="criminal.criMarryStatus"></span></el-col>
                        </el-row>
                        <el-row style="font-size: 13px;">
                            <el-col :span="6"><span class="label-base">状态:</span><span v-text="criminal.criState"></span></el-col>
                        </el-row>
                        <el-collapse v-model="activeNames">
                            <el-collapse-item title="教育/经验" name="1">
                                <el-row>
                                    <el-col :span="6"><span class="label-base">文化程度:</span><span v-text="criminal.criEducation"></span></el-col>
                                    <el-col :span="6"><span class="label-base">职业:</span><span v-text="criminal.criOccupation"></span></el-col>
                                    <el-col :span="6"><span class="label-base">所在公司:</span><span v-text="criminal.criCompany"></span></el-col>
                                    <el-col :span="6"><span class="label-base">职务:</span><span v-text="criminal.criDuties"></span></el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item title="服刑信息" name="2">
                                <el-row>
                                    <el-col :span="8"><span class="label-other">所属监区:</span><span v-text="criminal.criPriCode"></span></el-col>
                                    <el-col :span="8"><span class="label-other">所属监舍:</span><span v-text="criminal.criPaiCode"></span></el-col>
                                    <el-col :span="8"><span class="label-other">责任预警:</span><span v-text="criminal.criResponPolice"></span></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><span class="label-other">服刑罪名:</span><span v-text="criminal.criAccusation"></span></el-col>
                                    <el-col :span="8"><span class="label-other">监管类型:</span><span v-text="criminal.criSupervisetype"></span></el-col>
                                    <el-col :span="8"><span class="label-other">当前状态:</span><span v-text="criminal.criCurstate"></span></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><span class="label-other">开始服刑时间:</span><span v-text="criminal.criStartdate"></span></el-col>
                                    <el-col :span="8"><span class="label-other">结束服刑时间:</span><span v-text="criminal.criEnddate"></span></el-col>
                                    <el-col :span="8"><span class="label-other">刑期时长:</span><span>{{ criminal.criPrisonterm }}个月</span></el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item title="联系人员" name="3">
                                <el-row>
                                    <el-col :span="8"><span class="label-other">联系人员1:</span><span v-text="criminal.criContact1"></span></el-col>
                                    <el-col :span="8"><span class="label-other">联系人员2:</span><span v-text="criminal.criContact2"></span></el-col>
                                    <el-col :span="8"><span class="label-other">联系人员3:</span><span v-text="criminal.criContact3"></span></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><span class="label-other">联系电话1:</span><span v-text="criminal.criTel1"></span></el-col>
                                    <el-col :span="8"><span class="label-other">联系电话2:</span><span v-text="criminal.criTel2"></span></el-col>
                                    <el-col :span="8"><span class="label-other">联系电话3:</span><span v-text="criminal.criTel3"></span></el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                    <el-col :span="5">照片</el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="当日预警" name="warning">
                <el-table :data="pPTableData" stripe style="width: 100%">
                    <el-table-column prop="startTime"         label="预警开始时间"></el-table-column>
                    <el-table-column prop="endTime"           label="预警结束时间"></el-table-column>
                    <el-table-column prop="timeLen"           label="预警时长"></el-table-column>
                    <el-table-column prop="warningEventType"  label="预警事件"></el-table-column>
                    <el-table-column prop="warningArea"       label="所在区域"></el-table-column>
                </el-table>
                <div class="el-pagination-wrap">
                    <table-pagination :total="warningCount" @change="getTodayWarnings" ref="warningPagination"></table-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="活动记录" name="actRecord">
                <el-row>
                    <el-col :span="6">
                        <el-tabs v-model="actRecordTab" @tab-click="handleActClick">
                            <el-tab-pane label="当前活动区域" name="nowActArea"></el-tab-pane>
                            <el-tab-pane label="历史活动区域" name="hisActArea"></el-tab-pane>
                        </el-tabs>
                    </el-col>
                    <el-col :span="14" v-if="actRecordTab == 'hisActArea'" style="line-height: 56px;">
                        <span style="font-size: 14px;">时间：</span>
                        <el-date-picker style="width: 35%;" size="small" v-model="params.startTime" type="datetime" placeholder="选择日期"></el-date-picker>
                        <span>-</span>
                        <el-date-picker style="width: 35%;" size="small" v-model="params.endTime" type="datetime" placeholder="选择日期"></el-date-picker>
                        <el-button size="mini" type="primary" class="search-btn" @click="getHisActArea()">查询</el-button>
                    </el-col>
                </el-row>
                <el-row style="width:100%; height:700px;">
                    <div v-if="actRecordTab == 'nowActArea'" style="width:100%; height:700px;">
                      <div ref="canvasContainer" style="width:1200px; height:700px;" >
                          <div ref="canvas" id="canvasDiv" style="width:1200px; height:700px;"></div>
                      </div>
                    </div>
                    <div v-show="actRecordTab == 'hisActArea'">
                        <el-table :data="pPHisTrackData" stripe style="width: 100%">
                            <el-table-column prop="startTime"   label="进时间"></el-table-column>
                            <el-table-column prop="endTime"     label="出时间"></el-table-column>
                            <el-table-column prop="areaName"    label="区域"></el-table-column>
                            <el-table-column prop="stayTimeLen" label="停留时间"></el-table-column>
                        </el-table>
                        <div class="el-pagination-wrap">
                            <table-pagination :total="pPHisTrackCount" @change="getHisActArea" ref="historyPagination"></table-pagination>
                        </div>
                    </div>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Draw from "@/draw/action";
import tablePagination from '@/components/commons/tablePage.vue';

export default {
    data() {
        return {
            activeName: "baseInfo",         // 默认选中页签面板
            actRecordTab: "nowActArea",     // 默认活动记录区域
            activeNames: [ '1', '2', '3'],  // 默认展开折叠面板
            criminal: { },                  // 服刑人员基本信息
            pPTableData: [],                // 当日预警表格数据
            warningCount: 0,                // 当日预警数据总量
            pPHisTrackData: [],             // 历史活动区域记录
            pPHisTrackCount: 0,             // 历史活动区域总量
            drawObj:null,
            nowActivePriCode :null,
            params: {
                startTime: new Date(new Date().setHours(0, 0, 0, 0)),
                endTime: new Date(new Date().setHours(24, 0, 0, 0))
            }
        }
    },
    methods: {
        /** 页签切换操作 */
        handleClick: function(tab, event) {
            if (this.activeName == "baseInfo") {
                // 不做任何处理
            } else if (this.activeName == "warning") {
                this.getTodayWarnings();
            } else if (this.activeName == "actRecord") {
                this.getNowActArea();
                this.actRecordTab = "nowActArea";
            }
        },
        /** 活动区域页签切换 */
        handleActClick: function(tab, event) {
            if (this.actRecordTab == "nowActArea") {
                this.getNowActArea();

            } else if (this.actRecordTab == "hisActArea") {
                this.getHisActArea();
            }
        },
        /** 获取人员信息 */
        getPrisonerBaseInfo: function(criCode) {
            this.clearAndInitData();
            let data = { "criId" :  criCode}

            this.$post(this.urlconfig.ppGetPrisonerView, data).then(res => {
                if (res.status === 0) {
                    this.criminal = res.data;

                }
            })
        },
        /** 获取当日预警 */
        getTodayWarnings: function() {
            let data = {
                criId: this.criminal.criCode,
                pageIndex: this.$refs.warningPagination.index,
                pageSize: this.$refs.warningPagination.pageSize
            }

            this.$post(this.urlconfig.ppGetTodayWarnings, data).then(res => {
                if (res.status === 0) {
                    this.pPTableData = res.data.items;
                    this.warningCount = res.data.totalRows;
                }
            })
        },
        /** 查询当前活动区域 */
        getNowActArea: function() {
          let data = {
            criId: this.criminal.criCode,
          }

          this.$post(this.urlconfig.ppGetCriCurrentAreaInfo, data).then((res) => {
            if (res.status === 0) {
              this.nowActivePriCode = res.data.paiCode;
              this.initDrawObj();
              this.getAreaMapInfo(res.data.psiCode);
            }
          }).catch((error) => {
            console.log(error);
          }).then(() =>{
              // todo something...
          });
        },
        getAreaMapInfo : function(psiCode){
          // let data = {"nodeId":this.checkedNode.id, "nodeType":this.checkedNode.nodeType}
          let data = {"id":psiCode, "nodeType":"03"};
          //获取所属片区的信息，区域没有平面图
          this.$post(this.urlconfig.tmGetTreeNodeInfo,data).then((res) => {
              if(res.status == 0){
                  this.drawMap(res.data);
              }
          }).catch((error) => {

          }).then(()=>{

          });
        },
        /** 查询历史活动区域 */
        getHisActArea: function() {
            let data = {
                criId: this.criminal.criCode,
                endTime: this.params.endTime,
                startTime: this.params.startTime,
                pageIndex: this.$refs.historyPagination.index,
                pageSize: this.$refs.historyPagination.pageSize
            }

            this.$post(this.urlconfig.ppGetHisActiveTrack, data).then(res => {
                if (res.status === 0) {
                    this.pPHisTrackData = res.data.items;
                    this.pPHisTrackCount = res.data.totalRows;
                }
            })
        },
        /** 清理并初始化 */
        clearAndInitData: function() {
            this.activeName = "baseInfo";
            this.actRecordTab = "nowActArea";
            this.activeNames = [ '1', '2', '3'];
            this.criminal = { };
            this.pPTableData = [];
            this.warningCount = 0;
            this.pPHisTrackData = [];
            this.pPHisTrackCount = 0;
            this.params = {
                startTime: new Date(new Date().setHours(0, 0, 0, 0)),
                endTime: new Date(new Date().setHours(24, 0, 0, 0))
            }
        },
        /** 初始化平面图区域 */
        initDrawObj: function() {
          let canvasContainerRect = this.$refs.canvasContainer.getBoundingClientRect();
          let width =canvasContainerRect.width == 0 ? 1200: canvasContainerRect.width;
          let height = canvasContainerRect.height == 0 ? 600: canvasContainerRect.height;

          this.$refs.canvas.style.width = width  + "px";
          this.$refs.canvas.style.height = height + "px";
          this.drawMapObj = new Draw(this, "canvasDiv", width, height, true,
            function(e, obj, prev) {

            }, function (e, obj, prev){

            }, function(e, obj, prev){

            });

        },
        /** 执行画图操作 */
        drawMap: function(data) {
          let relations = data.nodeMapping.length > 10 ?JSON.parse(data.nodeMapping):{};
          if(relations.currScale != undefined){
            this.drawMapObj.diagram.scale = relations.currScale;
          }
          this.drawMapObj.resetPos();
          let dataArr = data.nodeConfig.length > 10 ? JSON.parse(data.nodeConfig) : [];
          this.drawMapObj.updateNodeDataArr(dataArr);
          for (let i = dataArr.length - 1; i >= 0; i--) {
            if(dataArr[i].category == "textTipsTemplate") continue;
            if ((dataArr[i].pri_code == undefined) || (dataArr[i].pri_code == "") || (dataArr[i].pri_code == null)) {
              this.drawMapObj.diagram.model.removeNodeData(dataArr[i]);
            }
          }
          //add 标注当前活动区域
          this.drawMapObj.addPrisonerIcon(this.nowActivePriCode);
          this.drawMapObj.setBackgroundPicture(data.nodeMap);
          this.drawMapObj.doSelectOnly();
          this.drawMapObj.doShowOnly();
        },
    },
    components: {
      tablePagination
    }
}
</script>

<style scopted>
 .label-base {
    width: 40%;
    margin: 0px 10px;

    text-align: right;
    display: inline-block;
 }

 .label-other {
    width: 85px;
    margin: 0px 10px;
    text-align: right;
    display: inline-block;
 }
</style>

<style>
  #position .el-tabs__header {
    padding: 0;
    position: relative;
  }

  #position .el-tabs__item {
    padding: 0 20px;
    height: 40px;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    position: relative;
  }

  #position .el-collapse-item__header {
      background-color: #EEE;
      padding-left: 10px;
      padding-right: 10px;
  }

  #position .el-collapse-item__header.is-active {
      background-color: #EEE;
      padding-left: 10px;
      padding-right: 10px;
  }

  #position #tab-nowActArea,
  #position #tab-hisActArea {
    height: 30px;
    line-height: 30px;
    padding: 0px 10px;
 }
</style>
