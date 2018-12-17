<template>
  <div class="w1200">
    <section>
      <section class="pp-r-t q-v-t filter-wrap">
        <section>
          <el-row :gutter="20">
            <el-col :span="9">
              <span class="block">
                <span class="demonstration">时间</span>
                <el-date-picker size="mini" v-model="parame.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
                <span>-</span>
                <el-date-picker size="mini" v-model="parame.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
              </span>
            </el-col>
            <el-col :span="6">
              <span>预警事件类型：</span>
              <el-select size="small" v-model="parame.warningEventType" placeholder="请选择">
                <el-option v-for="item in warningEventTypes" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <span>服刑人员姓名/编码：</span>
              <el-input size="small" class="pp-input" v-model="parame.prisonerName" placeholder="请输入内容" clearable></el-input>
            </el-col>
            <el-col :span="2">
              <el-button @click="getTableDatas" class="search-btn" size="small">查询</el-button>
            </el-col>
          </el-row>
        </section>
      </section>
      <section class="el-table-wrap clearfix">
        <el-table :data="ppuTableDatas" style="width: 100%">
          <el-table-column prop="startTime"         label="预警开始时间"  min-width="100px"></el-table-column>
          <el-table-column prop="endTime"           label="预警结束时间"  min-width="100px"></el-table-column>
          <el-table-column prop="timeLen"           label="预警时长"      min-width="80px"></el-table-column>
          <el-table-column prop="prisonerName"      label="预警事件对象"  min-width="80px"></el-table-column>
          <el-table-column prop="warningEventType"  label="预警事件类型"  min-width="100px"></el-table-column>
          <el-table-column prop="warningArea"       label="预警所在区域"  min-width="100px"></el-table-column>
          <el-table-column prop="warningRule"       label="预警规则"      min-width="100px"></el-table-column>
          <el-table-column prop="warningTv"         label="预警视频"      width="100px">
            <template slot-scope="scope">
              <div class="operating" v-if="scope.row.prisonerID != '' && scope.row.prisonerID != null">
                <el-button @click="showPosition(scope.$index, scope.row)" type="text">
                  <span>查看</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="el-pagination-wrap fr">
          <table-pagination :total="count" @change="getTableDatas" ref="pagination"></table-pagination>
        </div>
      </section>
    </section>
    <section>
      <el-dialog title="人员定位" :visible.sync="isShowPosition" width="1100px" :before-close="beforePositionClose">
          <v-position ref="vPosition"></v-position>
        </el-dialog>
    </section>
  </div>
</template>

<script>
  import tablePagination from '@/components/commons/tablePage.vue';
  import position from "@/components/pages/personnelposition/position.vue";

  export default {
    components: {
      "tablePagination" : tablePagination,
      "v-position" : position
    },
    data() {
      return {
        parame: {
          startTime: new Date(new Date().setHours(0, 0, 0, 0)),
          endTime: new Date(new Date().setHours(24, 0, 0, 0)),
          warningEventType: '',
          prisonerName: '',
        },
        count: 0,
        ppuTableDatas: [],
        warningEventTypes: [],
        isShowPosition: false,    // 是否弹出人员定位
      }
    },
    mounted: function () {
      this.getPreWarnType();
      this.getTableDatas();
    },
    methods: {
      /** 获取预警事件类型 */
      getPreWarnType: function() {
        this.$get(this.urlconfig.scmGetVWTypes).then((res) => {
          if (res.status === 0) {
            if ((res.data != null) && (res.data.length > 0)) {
              this.parame.warningEventType = res.data[0].sCode;
            }
            this.warningEventTypes = res.data;
          }
        })
      },
      /** 获取表格数据 */
      getTableDatas: function() {
        let data = {
          params: JSON.stringify(this.parame),
          pageIndex: this.$refs.pagination.index,
          pageSize: this.$refs.pagination.pageSize
        }

        this.$post(this.urlconfig.qvGetTableDatas, data).then((res) => {
          this.count = res.data.totalRows;
          this.ppuTableDatas = res.data.items;
        })
      },
      /** 查看人员定位功能 */
      showPosition: function (index, row) {
        this.isShowPosition = true;
        this.$nextTick(() => {
            this.$refs.vPosition.getPrisonerBaseInfo(row.prisonerID);
        });
      },
      /** 关闭人员定位操作 */
      beforePositionClose: function() {
        this.isShowPosition = false;
      },
    }
  }
</script>

<style scoped>
  .q-v-t .el-date-editor.el-input,
  .q-v-t .el-date-editor.el-input__inner {
    width: 40%;
  }

  .q-v-t section {
    display: inline-block;
    margin-right: 1%;
  }

  .q-v-t .el-select,
  .q-v-t .pp-input {
    width: 49%;
  }
</style>