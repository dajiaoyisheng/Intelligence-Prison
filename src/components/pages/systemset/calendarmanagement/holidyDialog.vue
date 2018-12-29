<template>
  <div id="holidyDialog">
    <section class="btn_group">
      <el-row>
        <el-col :span="5">
          <el-button-group>
            <el-button size="mini" title="新增" type="primary" icon="el-icon-plus"    @click="addNewHoliday"></el-button>
            <el-button size="mini" title="删除" type="primary" icon="el-icon-delete"  @click="deleteHoliday"></el-button>
            <el-button size="mini" title="保存" type="primary" icon="el-icon-tickets" @click="saveHolidays"></el-button>
          </el-button-group>
        </el-col>
        <el-col :span="4">
          <el-select size="mini" v-model="currentYear" @change="handleQueryHolidays">
            <el-option v-for="year in years" :key="year" :label="year" :value="year"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </section>
    <section class="data_table">
      <el-table :data="holidyDays" stripe border height="500" @selection-change="handleSelectionChange">
        <el-table-column type="index"     align="center"  width="45"></el-table-column>
        <el-table-column type="selection" align="center"  width="45"></el-table-column>
        <el-table-column label="日期名称"  align="center"  prop="title">
          <template slot-scope="scope">
            <div @click="changeCellEditable(scope.$index + 'title', scope.row)">
              <el-input v-model="scope.row.title" size="mini" v-show="current === scope.$index + 'title'" @blur="changeCellUnEditable"></el-input>
              <span v-show="current !== scope.$index + 'title'">
                <span v-if="scope.row.title != ''">{{scope.row.title}}</span>
                <span v-else>-</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="开始日期"  align="center"  prop="beginDate">
          <template slot-scope="scope">
            <div @click="changeCellEditable(scope.$index + 'beginDate', scope.row)">
              <el-date-picker v-model="scope.row.beginDate" value-format="yyyy/MM/dd" class="dateCell" size="mini" type="date" v-show="current === scope.$index + 'beginDate'" @blur="changeCellUnEditable" :picker-options="pickerOptions"></el-date-picker>
              <span v-show="current !== scope.$index + 'beginDate'">
                <span v-if="scope.row.beginDate != null">{{scope.row.beginDate}}</span>
                <span v-else>-</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结束日期"  align="center"  prop="endDate">
          <template slot-scope="scope">
            <div @click="changeCellEditable(scope.$index + 'endDate', scope.row)">
              <el-date-picker v-model="scope.row.endDate" value-format="yyyy/MM/dd" class="dateCell" size="mini" type="date" v-show="current === scope.$index + 'endDate'" @blur="changeCellUnEditable" :picker-options="pickerOptions"></el-date-picker>
              <span v-show="current !== scope.$index + 'endDate'">
                <span v-if="scope.row.endDate != null">{{scope.row.endDate}}</span>
                <span v-else>-</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="日期类型"  align="center"  prop="type">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.type">
              <el-option v-for="item in dateTypes" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
  import { isBeginEndDate, dateTimeFormatter } from "../../../commons/vue-event-calendar/tools.js";

  export default {
    data() {
      return {
        current: null,        // 当前行
        currentYear: "",      // 当前年份
        holidyDays: [],       // 当年节假日列表
        multipleSelection: [],// 表格多选数据项
        years: ["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"]
      }
    },
    computed: {
      pickerOptions() {
        let that = this;
        return {
          disabledDate(time) {
            let year = that.currentYear;
            let statdate = new Date(year, 0, 1, 0, 0, 0);
            let enddate = new Date(year, 11, 31, 0, 0, 0);
            return time.getTime() > enddate.getTime() || time.getTime() < statdate.getTime();
          }
        }
      }
    },
    methods: {
      /** 初始化数据 */
      initDatas: function() {
        this.current = null;
        this.currentYear = "";
        this.handleQueryHolidays();
      },
      /** 处理查询节假日 */
      handleQueryHolidays() {
        let data = { "currentYear" : this.currentYear };
        this.$post(this.urlconfig.scmGetCurrentYearDatas, data).then((res) => {
          if (res.status === 0) {
            this.holidyDays = res.data.holidyDays;
            this.currentYear = res.data.currentYear;
          }
        }).catch((error) => {
          console.log(error);
        }).then(() => {
          // todo something...
        });
      },
      /** 表格选择处理 */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /** 点选编辑表格 */
      changeCellEditable: function(index, row) {
        this.current = index;
      },
      /** 取消编辑表格 */
      changeCellUnEditable: function() {
        this.current = null;
      },
      /** 增加新节假日 */
      addNewHoliday: function() {
        var newRow = {
          title: '名称',
          beginDate: dateTimeFormatter(new Date(), 'yyyy/MM/dd'),
          endDate: dateTimeFormatter(new Date(), 'yyyy/MM/dd'),
          type: '03'
        }
        this.holidyDays.unshift(newRow);
      },
      /** 删除节假日期 */
      deleteHoliday: function() {
        if (this.multipleSelection) {
          this.multipleSelection.forEach(row => {
            let point = this.holidyDays.indexOf(row);
            this.holidyDays.splice(point, 1);
          });
        }
      },
      /** 保存节假日期 */
      saveHolidays: function() {
        let data = { "year": this.currentYear, "beanItems":JSON.stringify(this.holidyDays)}
        this.$post(this.urlconfig.scmSaveHolidays, data).then((res) => {
          if (res.status === 0) {
            this.$message({ type: "success", message: "保存成功!" });
            this.initDatas();
          }
        }).catch((error) => {
          console.log(error);
        }).then(() => {
          // todo somthing...
        });
      }
    },
    props: ['dateTypes']
  }
</script>

<style scoped>
  .btn_group {
    line-height: 30px;
  }

  .data_table {
    margin-top: 20px;
  }

  .dateCell {
    width: 95%;
  }
</style>

<style>
  #holidyDialog .el-row {
    line-height: 30px;
  }

  #holidyDialog .el-table th {
    height: 20px;
    line-height: 20px;
  }
</style>