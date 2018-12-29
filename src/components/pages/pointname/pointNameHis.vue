<template>
    <div id="pointNameHis">
        <el-row style="text-align: center">
            {{ pointDate }} {{ pointTime }}点名情况
        </el-row>
        <el-row style="text-align:left; padding-left:15px; font-size:14px;">
            <el-col :span="21">
                本次点名应到{{ totalPnNum }}人，已到{{ arrivedNum }}人，未到{{ totalPnNum - arrivedNum }}人，详细信息如下：
            </el-col>
            <el-col :span="3">
                <el-checkbox v-model="params.checked" @change="checkedChangeQuery">显示已到人员</el-checkbox>
            </el-col>
        </el-row>
        <el-table class="topItem" :data="tableData" stripe style="width: 100%">
            <el-table-column type="index"   width="50"></el-table-column>
            <el-table-column label="编号"   align="center" prop="criCode">
                <template slot-scope="scope">
                    <span v-bind:class="{'active' : scope.row.pnState == '02'}">{{ scope.row.criCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名"   align="center" prop="criName">
                <template slot-scope="scope">
                    <span v-bind:class="{'active' : scope.row.pnState == '02'}">{{ scope.row.criName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态"   align="center" prop="pnState">
                <template slot-scope="scope">
                    <span v-if="scope.row.pnState == '01'">已到</span>
                    <span v-if="scope.row.pnState == '02'" v-bind:class="{'active' : scope.row.pnState == '02'}">未到</span>
                </template>
            </el-table-column>
            <el-table-column label="备注"   align="center" prop="pnRemark">
                <template slot-scope="scope">
                    <div @click="changePnRemark(scope.$index + 'top', scope.row)">
                        <el-input size="small" v-model="tempRemark" v-show="current === scope.$index + 'top'" @blur="changePnRemarkBlur"></el-input>
                        <span v-bind:class="{'active' : scope.row.pnState == '02'}" v-show="current !== scope.$index + 'top'">{{scope.row.pnRemark}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-pagination-wrap text-center">
            <table-pagination ref="pnHisPagination" :total="totalCount" @change="queryPointNameHis"></table-pagination>
        </div>
    </div>
</template>

<script>
import tablePagination from '@/components/commons/tablePage.vue';

export default {
    data() {
      return {
        tempRow: null,      // 临时选中表格行项
        current: null,      // 当前选中表格行项
        tempRemark: '',     // 临时备注信息
        totalCount: 0,      // 表格总记录数
        totalPnNum: 0,      // 点名总人数
        arrivedNum: 0,      // 已到人数
        pointDate: '',      // 点名日期
        pointTime: '',      // 点名时间
        tableData: [],      // 表格数据
        params: {
            nodeId : "",
            pointDate : "",
            pointTime : "",
            checked: false
        }
      };
    },
    methods: {
        /** 初始化查询 */
        initQuery: function(nodeIdParameter, pointDateParameter, pointTimeParameter) {
            this.params.checked = false;
            this.$refs.pnHisPagination.index = 1;
            this.params.nodeId = nodeIdParameter;
            this.params.pointDate = pointDateParameter;
            this.params.pointTime = pointTimeParameter;
            this.queryPointNameHis();
        },
        /** 已到人员变更查询 */
        checkedChangeQuery: function() {
           this.$refs.pnHisPagination.index = 1;
           this.queryPointNameHis();
        },
        /** 查询历史点名数据 */
        queryPointNameHis: function() {
            let data = { 
                params: JSON.stringify(this.params),
                pageIndex: this.$refs.pnHisPagination.index,
                pageSize: this.$refs.pnHisPagination.pageSize
            };

            this.$post(this.urlconfig.pnGetPnHis, data).then((res) => {
                if (res.status === 0) {
                    this.tempRow = null;
                    this.current = null;

                    this.pointDate = res.data.pointDate;
                    this.pointTime = res.data.pointTime;
                    this.tableData = res.data.tableData;
                    this.totalCount = res.data.totalCount;
                    this.totalPnNum = res.data.totalPnNum;
                    this.arrivedNum = res.data.arrivedNum;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 执行立即点名 */
        pointNameNow: function(parameter) {
            let data = { "parameter": JSON.stringify(parameter) };
            this.$post(this.urlconfig.pnPointNameNow, data).then((res) => {
                if (res.status === 0) {
                    this.params.checked = false;
                    this.$refs.pnHisPagination.index = 1;
                    this.params.nodeId = parameter.nodeId;
                    this.params.pointDate = parameter.pointDate;
                    this.params.pointTime = res.data.pointTime;
                    this.queryPointNameHis();
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 修改备注信息 */
        changePnRemark: function(index, row) {
            this.tempRow = row;
            this.current = index;
            this.tempRemark = row.pnRemark;
        },
        /** 备注失去焦点 */
        changePnRemarkBlur: function() {
            if ((this.tempRow.pnRemark !== this.tempRemark) && (this.tempRemark != '')) {
                this.$confirm('备注信息已修改，是否保存?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        "pnID" : this.tempRow.pnID,
                        "pnRemark" : this.tempRemark
                    }

                    this.$post(this.urlconfig.pnSavePointName, data).then((res) => {
                        if (res.status === 0) {
                            this.tempRow.pnRemark = this.tempRemark;
                            this.tempRow = null;
                            this.current = null;
                        }
                    }).catch((error) => {
                        console.log(error);
                    }).then(() => {
                        // todo somthing...
                    });
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                this.tempRow = null;
                this.current = null;
            }
        }
    },
    components: {
      "tablePagination": tablePagination
    }
}
</script>

<style scoped>
  .el-row {
    line-height: 30px;
    margin-bottom: 0px;
  }

  .active {
      color: red;
  }
</style>

<style>
  #pointNameHis .el-collapse-item__header {
    font-size: 16px;
    padding-left: 15px;
    padding-right: 15px;
  }
</style>