<template>
  <div id="holidyDialog">
    <section id="tip">
      <span>请在表格中设置日期类型</span>
    </section>
    <section>
      <el-row>
        <el-col :span="18">
          <vue-event-calendar :events="holidyDays" @month-changed="handleMonthChanged"></vue-event-calendar>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="legend">图例</div>
          <div class="legend"><span id="workday"></span><span class="legend_title">工作日</span></div>
          <div class="legend"><span id="holiday"></span><span class="legend_title">节假日</span></div>
          <div class="legend"><span id="unWorkDay"></span><span class="legend_title">非工作日</span></div>
        </el-col>
      </el-row>
    </section>
    <section class="btn_group">
      <el-button-group>
        <el-button size="mini" title="新增" type="primary" icon="el-icon-plus"    @click="addNewHoliday"></el-button>
        <el-button size="mini" title="删除" type="primary" icon="el-icon-delete"  @click="deleteHoliday"></el-button>
        <el-button size="mini" title="保存" type="primary" icon="el-icon-tickets" @click="saveHolidays"></el-button>
      </el-button-group>
    </section>
    <section class="data_table">
      <el-table :data="holidyDays" stripe border height="300" @selection-change="handleSelectionChange">
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
              <el-date-picker v-model="scope.row.beginDate" value-format="yyyy/MM/dd" class="dateCell" size="mini" type="date" v-show="current === scope.$index + 'beginDate'" @blur="changeCellUnEditable"></el-date-picker>
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
              <el-date-picker v-model="scope.row.endDate" value-format="yyyy/MM/dd" class="dateCell" size="mini" type="date" v-show="current === scope.$index + 'endDate'" @blur="changeCellUnEditable"></el-date-picker>
              <span v-show="current !== scope.$index + 'endDate'">
                <span v-if="scope.row.endDate != null">{{scope.row.endDate}}</span>
                <span v-else>-</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="日期类型"  align="center"  prop="type">
          <template slot-scope="scope">
            <div @click="changeCellEditable(scope.$index + 'type', scope.row)">
              <el-select size="mini" v-model="scope.row.type" v-show="current === scope.$index + 'type'" @blur="changeCellUnEditable">
                <el-option v-for="item in dateTypes" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
              </el-select>
              <span v-show="current !== scope.$index + 'type'">{{ scope.row.type }}</span>
            </div>
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
        value1 : "",
        current: null,        // 当前行
        currentYear: "",      // 当前年份
        holidyDays: [],       // 当年节假日列表
        multipleSelection: [] // 表格多选数据项
      }
    },
    methods: {
      /** 初始化数据 */
      initDatas: function() {
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
      /** 月份变化处理 */
      handleMonthChanged: function(data) {
        let year = data.substring(0, 4);
        if (year != this.currentYear) {
          this.currentYear = year;
          this.initDatas();
        }
      },
      /** 表格选择处理 */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      changeCellEditable: function(index, row) {
        this.current = index;
      },
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
        alert(this.holidyDays.length);
      }
    },
    props: ['dateTypes']
  }
</script>

<style scoped>
  #tip {
    line-height: 14px;
    margin-bottom: 18px;
  }

  .legend {
    height: 25px;
    line-height: 25px;
    vertical-align: middle;
  }

  .legend_title {
     height: 15px;
     line-height: 15px;
     margin-left: 5px;
     display: inline-block;
     vertical-align: middle;
  }

  .legend #workday {
    height: 15px;
    width: 15px;
    display: inline-block;
    vertical-align: middle;
    background: #FFF;
    border: 1px solid #AAA;
  }

  .legend #holiday {
    height: 15px;
    width: 15px;
    display: inline-block;
    vertical-align: middle;
    background: #EEF9FD;
    border: 1px solid #AAA;
  }

  .legend #unWorkDay {
    height: 15px;
    width: 15px;
    display: inline-block;
    vertical-align: middle;
    background: #FFF1EF;
    border: 1px solid #AAA;
  }

  .btn_group {
    line-height: 30px;
  }

  .data_table {
    margin-top: 20px;
  }

  .dateCell {
    width: 92px;
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