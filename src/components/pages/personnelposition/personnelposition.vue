<template>
  <div id="pp-wrap">
    <section class="pp-left">
      <el-table ref="pPositionTable" :data="pPositionData" stripe @row-click="getPrisonerBaseInfo" :highlight-current-row="true">
        <el-table-column type="index"   width="50"></el-table-column>
        <el-table-column prop="criName" label="姓名"></el-table-column>
        <el-table-column prop="criCode" label="编号"></el-table-column>
      </el-table>
    </section>
    <section class="pn-right">
      <section style="padding: 10px;">
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
        <el-button @click="getPPositionData" size="mini" type="primary" class="search-btn">查询</el-button>
      </section>
      <section style="height: calc(100% - 120px);">
        <v-position ref="vPosition"></v-position>
      </section>
    </section>
  </div>
</template>

<script>
import EventUtils from "@/components/commons/eventUtils.js";
import position from "@/components/pages/personnelposition/position.vue";

export default {
  components: {
    "v-position" : position
  },
  data() {
    return {
      priCodes: [],           // 监区列表
      paiCodes: [],           // 监舍列表
      pPositionData: [],      // 人员列表
      supervisionTypes: [],   // 监管类型
      params: {               // 查询条件
        priCode: '',
        paiCode: '',
        prisoner: '',
        criCurstate: '',
        supervisionType: ''
      }
    }
  },
  mounted: function() {
    this.getPriCodesData();
    this.getSupervisionTypes();
    EventUtils.$on("params", (parameter) => {
     this.headerSearchOn(parameter);
    });
  },
  methods: {
    /** 获取监区列表 */
    getPriCodesData: function() {
      this.$get(this.urlconfig.ppGetAreaData).then(res => {
        if (res.status === 0) {
          this.priCodes = res.data
          if (this.priCodes.length > 0) {
            this.params.priCode = this.priCodes[0].priCode;
            this.getPaiCodesData();
          } else {
            this.params.priCode = "";
          }
        }
      })
    },
    /** 获取监舍列表 */
    getPaiCodesData: function() {
      let data = { "priCode": this.params.priCode }
      this.$post(this.urlconfig.ppGetHouseData, data).then(res => {
        if (res.status === 0) {
          this.paiCodes = res.data
          if (this.paiCodes.length > 0) {
            this.params.paiCode = this.paiCodes[0].paiCode;
            this.getPPositionData();
          } else {
            this.params.paiCode = "";
          }
        }
      })
    },
    /** 获取监管类型 */
    getSupervisionTypes: function() {
      this.$get(this.urlconfig.ppGetVisiontypeData).then(res => {
        if (res.status === 0) {
          this.supervisionTypes = res.data;
          if (this.supervisionTypes.length > 0) {
            this.params.supervisionType = this.supervisionTypes[0].sCode;
          } else {
            this.params.supervisionType = "";
          }
        }
      })
    },
    /** 获取人员列表 */
    getPPositionData: function() {
      // 如果跳转进来，重新设置查询参数
      if (this.$route.query.isSkip != undefined) {
        if (this.$route.query.isSupervision != undefined) {
          let supervisionType = this.$route.query.supervisionType;
          this.params = {priCode:'', paiCode:'',  prisoner:'', supervisionType:supervisionType, criCurstate:''};
        } else {
          this.params = this.$route.query.params;
          let data = { "priCode": this.params.priCode }

          // 如果监区编码不为空，重查区域
          if (this.params.priCode != "") {
            this.$post(this.urlconfig.ppGetHouseData, data).then(res => {
              if (res.status === 0) {
                this.paiCodes = res.data
              }
            })
          }
        }
      }

      let data = { "params" : JSON.stringify(this.params) }
      this.$post(this.urlconfig.ppSearch, data).then(res => {
        if (res.status === 0) {
          this.pPositionData = res.data;
          if (this.pPositionData.length > 0) {
            let firstRow = this.pPositionData[0];
            this.$refs.pPositionTable.setCurrentRow(firstRow);

            let criId = this.pPositionData[0].criId;
            this.$nextTick(() => {
              this.$refs.vPosition.getPrisonerBaseInfo(criId);
            });
          }
        }
      })
    },
    /** 查询人员基本信息 */
    getPrisonerBaseInfo: function(row) {
      this.$nextTick(() => {
        this.$refs.vPosition.getPrisonerBaseInfo(row.criId);
      });
    },
    /** header组件搜索跳转 */
    headerSearchOn: function(parameter) {
      this.params = parameter;
      let data = { "params" : JSON.stringify(this.params) }

      this.$post(this.urlconfig.ppSearch, data).then(res => {
        if (res.status === 0) {
          this.pPositionData = res.data;
          if (this.pPositionData.length > 0) {
            let firstRow = this.pPositionData[0];
            this.$refs.pPositionTable.setCurrentRow(firstRow);

            let criId = this.pPositionData[0].criId;
            this.$nextTick(() => {
              this.$refs.vPosition.getPrisonerBaseInfo(criId);
            });
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .pp-left {
    height: calc(100% - 60px);
    width: 250px;
    top: 60px;
    left: 0;

    z-index: 666;
    overflow: auto;
    position: fixed;
    background: #fff;
    display: inline-block;
    border-right: 1px solid #e0e3ec;
  }

  .pn-right {
    width: calc(100% - 265px);
    margin: 0px 10px;
    float: right;
  }

  .pp-input {
    width: 20%;
    vertical-align: middle;
    margin: 0px 20px 0px 5px;
  }
</style>
