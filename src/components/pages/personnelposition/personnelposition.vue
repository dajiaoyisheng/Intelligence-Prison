<template>
  <div class="pp-wrap">
    <section class="pposition-l fl">
      <table>
        <thead>
          <tr>
            <th><div class="cell">序号</div></th>
            <th><div class="cell">姓名</div></th>
            <th><div class="cell">编号</div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in pPositionData" :key="item.name" @click="getPrisonerBaseInfo(item.criId)">
            <td><div class="cell">{{ index + 1 }}</div></td>
            <td><div class="cell">{{ item.criName }}</div></td>
            <td><div class="cell">{{ item.criCode }}</div></td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="pposition-r">
      <section class="pp-r-t">
        <span>监区:</span>
        <el-select size="small" v-model="params.priCode" placeholder="请选择" @change="getPaiCodesData">
          <el-option v-for="item in priCodes" :key="item.priCode" :label="item.priName" :value="item.priCode"></el-option>
        </el-select>
        <span>监舍:</span>
        <el-select size="small" v-model="params.paiCode" placeholder="请选择">
          <el-option v-for="item in paiCodes" :key="item.paiCode" :label="item.paiName" :value="item.paiCode"></el-option>
        </el-select>
        <span>监管类型:</span>
        <el-select size="small" v-model="params.supervisionType" placeholder="请选择">
          <el-option v-for="item in supervisionTypes" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
        </el-select>
        <span>服刑人员:</span>
        <el-input size="small" class="pp-input" v-model="params.prisoner" placeholder="请输入内容"></el-input>
        <el-button @click="getPPositionData" size="small" type="primary" class="search-btn">查询</el-button>
      </section>
      <section class="pp-r-d clearfix">
        <section class="pp-r-d-l fl">
          <p class="h-line">基本信息</p>
          <div class="pp-r-d-l-l fl">
            <div>
              <span>编号:</span>
              <el-input size="small" v-model="baseInfo.criCode" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>姓名:</span>
              <el-input size="small" v-model="baseInfo.criName" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>性别:</span>
              <el-input size="small" v-model="baseInfo.criGender" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>民族:</span>
              <el-input size="small" v-model="baseInfo.criNation" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>出生日期:</span>
              <el-date-picker v-model="baseInfo.criBirthday" type="date" placeholder="选择日期"></el-date-picker>
            </div>
            <div>
              <span>文化程度:</span>
              <el-input size="small" v-model="baseInfo.criEducation" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>婚姻状况:</span>
              <el-input size="small" v-model="baseInfo.criMarryStatus" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>罪名:</span>
              <el-input size="small" v-model="baseInfo.criAccusation" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>刑期:</span>
              <el-input size="small" v-model="baseInfo.criPrisonterm" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>开始服刑时间:</span>
              <el-date-picker v-model="baseInfo.criStartdate" type="date" placeholder="选择日期"></el-date-picker>
            </div>
            <div>
              <span>结束服刑时间:</span>
              <el-date-picker v-model="baseInfo.criEnddate" type="date" placeholder="选择日期"></el-date-picker>
            </div>
            <div>
              <span>监区:</span>
              <el-select size="small" v-model="baseInfo.criPriCode" placeholder="请选择" @change="getPaiCodesData">
                <el-option v-for="item in priCodes" :key="item.priCode" :label="item.priName" :value="item.priCode"></el-option>
              </el-select>
            </div>
            <div>
              <span>监舍:</span>
              <el-select size="small" v-model="baseInfo.criPaiCode" placeholder="请选择">
                <el-option v-for="item in paiCodes" :key="item.paiCode" :label="item.paiName" :value="item.paiCode"></el-option>
              </el-select>
            </div>
            <div>
              <span>监管类型:</span>
              <el-select size="small" v-model="baseInfo.criSupervisetype" placeholder="请选择">
                <el-option v-for="item in supervisionTypes" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
              </el-select>
            </div>
            <div>
              <span>责任预警:</span>
              <el-input size="small" v-model="baseInfo.criResponPolice" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>籍贯:</span>
              <el-input size="small" v-model="baseInfo.criOrigin" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>家庭联系人:</span>
              <el-input size="small" v-model="baseInfo.criContact1" placeholder="请输入内容"></el-input>
            </div>
            <div>
              <span>联系电话:</span>
              <el-input size="small" v-model="baseInfo.criTel1" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="pp-r-d-l-r fr">
            <div class="imgWrap" title="照片">
              <span class="pp-photo"></span>
              <div v-for="(item, key) in pictures" :key="key">
                <img :src="item.url"><span>{{ item.label }}</span>
              </div>
            </div>
            <div class="imgWrap" title="视觉识别码">
              <div v-for="(item, key) in codeImages" :key="key">
                <img :src="item.url"><span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </section>
        <section class="pp-r-d-r">
          <p class="h-line">当日预警事件</p>
          <section class="el-table-wrap clearfix">
            <el-table :data="pPTableData" stripe style="width: 100%">
              <el-table-column prop="startTime"         label="预警开始时间"></el-table-column>
              <el-table-column prop="endTime"           label="预警结束时间"></el-table-column>
              <el-table-column prop="timeLen"           label="预警时长"></el-table-column>
              <el-table-column prop="warningEventType"  label="预警事件"></el-table-column>
              <el-table-column prop="warningArea"       label="所在区域"></el-table-column>
              <el-table-column label="监控视频">
                <template slot-scope="scope">
                  <div class="operating">
                    <img class="v-align-m" :src="images.video">
                    <span @click="playvideo(scope.$index, scope.row, 'curevent')">查看</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="el-pagination-wrap">
              <table-pagination :total="warningCount" @change="getTodayWarnings" ref="warningPagination"></table-pagination>
            </div>
          </section>
        </section>
        <section class="pp-r-d-r pp-r-d-r-d">
          <p class="h-line" style="position: relative; top: 30px;"></p>
            <el-tabs v-model="activeName" @tab-click="handleClick" class="pos-res">
              <el-tab-pane label="当前活动区域" name="first">
                <img :src="images.currentPos">
              </el-tab-pane>
              <el-tab-pane label="历史活动区域" name="second">
                <section class="filter-wrap">
                  <span class="block">
                    <span class="demonstration">时间</span>
                    <el-date-picker size="mini" v-model="params.starttime" type="datetime" placeholder="选择开始时间"></el-date-picker>
                    <span>-</span>
                    <el-date-picker size="mini" v-model="params.endtime" type="datetime" placeholder="选择结束时间"></el-date-picker>
                  </span>
                </section>
                <section class="el-table-wrap clearfix">
                  <el-table :data="pPHisTrackData" stripe style="width: 100%">
                    <el-table-column prop="startTime"   label="进时间"></el-table-column>
                    <el-table-column prop="endTime"     label="出时间"></el-table-column>
                    <el-table-column prop="areaName"    label="区域"></el-table-column>
                    <el-table-column prop="stayTimeLen" label="停留时间"></el-table-column>
                    <el-table-column label="监控视频">
                      <template slot-scope="scope">
                        <div class="operating">
                          <img class="v-align-m" :src="video">
                          <span @click="playVideo(scope.$index, scope.row, 'hisevent')">查看</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="el-pagination-wrap">
                    <table-pagination :total="historyCount" @change="getHisActiveTrack" ref="historyPagination"></table-pagination>
                  </div>
                </section>
              </el-tab-pane>
            </el-tabs>
        </section>
        <section class="movie-wrap">
        </section>
      </section>
    </section>
  </div>
</template>

<script>
  import video from '@/assets/video.png';
  import currentPos from '@/assets/currentPos.png';
  import tablePagination from '@/components/commons/tablePage.vue';

  export default {
    components: {
      tablePagination
    },
    data() {
      return {
        priCodes: [],           // 监区列表
        paiCodes: [],           // 监舍列表
        supervisionTypes: [],   // 监管类型
        pPositionData: [],      // 人员列表
        baseInfo: {},           // 人员信息
        pictures: [],           // 人员照片
        codeImages: [],         // 人员照片
        pPTableData: [],        // 当日预警
        warningCount: 0,        // 当日预警总数
        activeName: "second",   // 活动标签
        historyCount: 0,        // 历史活动总数
        pPHisTrackData: [],     // 历史活动区域
        params: {
          priCode: '',
          paiCode: '',
          prisoner: '',
          supervisionType: '',
          starttime: new Date(new Date().setHours(0, 0, 0, 0)),
          endtime: new Date(new Date().setHours(24, 0, 0, 0))
        },
        images: {
          video: video,
          currentPos: currentPos,
        }
      }
    },
    mounted: function() {
      this.getPriCodesData();
      this.getSupervisionTypes();
      this.getPPositionData();
    },
    methods: {
      /** 获取监区列表 */
      getPriCodesData: function() {
        this.$get(this.urlconfig.ppGetAreaData).then(res => {
          if (res.status === 0) {
            this.priCodes = res.data
          }
        })
      },
      /** 获取监舍列表 */
      getPaiCodesData: function() {
        let data = { "priCode": this.params.priCode }
        this.$post(this.urlconfig.ppGetHouseData, data).then(res => {
          if (res.status === 0) {
            this.paiCodes = res.data
          }
        })
      },
      /** 获取监管类型 */
      getSupervisionTypes: function() {
        this.$get(this.urlconfig.ppGetVisiontypeData).then(res => {
          if (res.status === 0) {
            this.supervisionTypes = res.data;
          }
        })
      },
      /** 获取人员列表 */
      getPPositionData: function() {
        let data = { "params" : JSON.stringify(this.params) }
        this.$post(this.urlconfig.ppSearch, data).then(res => {
          if (res.status === 0) {
            this.pPositionData = res.data;
            if (this.pPositionData.length > 0) {
              this.getPrisonerBaseInfo(this.pPositionData[0].criId);
            }
          }
        })
      },
      /** 获取人员信息 */
      getPrisonerBaseInfo: function(criId) {
        let data = { "criId" :  criId}
        this.$post(this.urlconfig.ppGetPrisoner, data).then(res => {
          if (res.status === 0) {
            this.baseInfo = res.data;
            this.getPrisonerPhotos(criId);
            this.getTodayWarnings(criId);
            this.getHisActiveTrack(criId);
          }
        })
      },
      /** 获取人员照片 */
      getPrisonerPhotos: function(criId) {
        let data = { "criId" :  criId}
        this.$post(this.urlconfig.ppGetPrionserPhoto, data).then(res => {
          if (res.status === 0) {
            this.pictures = res.data.pictures;
            this.codeImages = res.data.codeImages;
          }
        })
      },
      /** 获取当日预警 */
      getTodayWarnings: function(criId) {
        let data = {
          criId: criId,
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
      /** 获取历史活动区域 */
      getHisActiveTrack: function(criId) {
        let data = {
          criId: criId,
          endTime: this.params.endtime,
          startTime: this.params.starttime,
          pageIndex: this.$refs.historyPagination.index,
          pageSize: this.$refs.historyPagination.pageSize
        }

        this.$post(this.urlconfig.ppGetHisActiveTrack, data).then(res => {
          if (res.status === 0) {
            this.pPHisTrackData = res.data.items;
            this.historyCount = res.data.totalRows;
          }
        })
      },
      /** 页签切换操作 */
      handleClick(tab, event) {
        
      }
    }
  }
</script>

<style scoped>
  .pposition-l {
    position: fixed;
    top: 60px;
    left: 0;
    height: 100%;
    width: 15%;
    background: #fff;
    display: inline-block;
    border-right: 1px solid #e0e3ec;
    overflow: auto;
    height: calc(100% - 60px);
  }

  .pposition-l .pp-td-w {
    width: 20%;
    background-color: #fff;
  }

  .pposition-r {
    width: 85%;
    float: right;
  }

  /* 选项卡begin */
  .el-tabs__header {
    display: inline-block;
    position: relative;
    margin: 0;
  }

  .el-tabs__header:after {
    display: block;
    content: '';
    position: absolute;
    top: 51%;
    background: #e9ebf0;
    width: 250%;
    height: 1px;
    left: 105%;
  }

  /* 选项卡end */
  .el-tabs__nav {
    cursor: pointer;
  }

  table thead tr {
    height: 48px;
  }

  .pp-r-t {
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 1%;
  }

  .pp-r-d {
    background-color: #f3f6f8;
    padding: 20px 1%;
  }

  .pp-r-d-l {
    width: 40%;
    display: inline-block;
  }

  .pp-r-d-l-l .el-select,
  .pp-r-d-l .el-input {
    width: 52%;
    margin-bottom: 14px;
  }

  .pp-r-d-l .div-select .el-input {
    width: 100%;
  }

  .pp-r-d-l .el-input:nth-child(12),
  .pp-r-d-l .el-input:nth-child(13),
  .pp-r-d-l .el-input:nth-child(14),
  .pp-r-d-l .el-input:nth-child(15),
    {
    width: 100%
  }

  .pp-r-d-l-l,
  .pp-r-d-l-r {
    width: 50%;
    display: inline-block
  }

  .pp-r-d-l-r .imgWrap {
    width: 95%;
    border: 1px solid #dcdcdc;
    position: relative;
    text-align: center;
    background-color: #fff;
    padding-top: 15px;
  }

  .imgWrap>span {
    position: absolute;
    left: 50%;
    left: 5%;
    top: -1%;
    width: 6em;
    background-color: #fff;
    height: 2px;
  }

  .imgWrap>span.pp-photo {
    width: 3em;
  }

  .imgWrap::before {
    content: attr(title);
    position: absolute;
    left: 5%;
    top: -0.7em;
    padding: 0 10px;
    z-index: 99;
  }

  .imgWrap:nth-child(2) {
    margin-top: 20px;
  }

  .pp-r-d-l-r .imgWrap>div {
    width: 45%;
    display: inline-block;
  }

  .pp-r-d-l-r .imgWrap>div>span {
    display: inline-block;
  }

  p.h-line {
    margin-bottom: 17px;
  }

  .pos-res {
    position: relative;
  }

  /* 选项卡后面的横线 */
  .pp-r-d-r-d p.h-line::after {
    top: 1%;
    width: 68%;
  }

  .pp-r-d .pp-r-d-l .pp-r-d-l-l div span:nth-child(1) {
    display: inline-block;
    width: 34%;
    text-align: right;
  }

  .pp-r-d-r {
    width: 60%;
    float: right;
  }
</style>