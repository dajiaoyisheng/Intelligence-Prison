<template>
  <div id="systemmanagement" class="w1200">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="21" class="stm-header-title"><span>系统管理</span></el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-tabs type="border-card" @tab-click="changeTabs">
          <el-tab-pane label="日志管理">
            <section>
              <el-row class="logger-params">
                <el-col :span="20"><span style="color: #666;">用户操作日志</span></el-col>
                <el-col :span="4">
                  <el-input size="mini" class="logger-params-input" v-model="parameter.name" placeholder="搜索关键词" clearable></el-input>
                  <el-button size="mini" class="search-btn" @click="queryLoggers()">搜索</el-button>
                </el-col>
              </el-row>
            </section>
            <section>
              <el-table :data="loggerList" style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="操作内容："><span>{{ props.row.optionContent }}</span></el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="操作人"   prop="optionUser"></el-table-column>
                <el-table-column label="操作IP"   prop="optionIP"></el-table-column>
                <el-table-column label="操作名称" prop="optionName"></el-table-column>
                <el-table-column label="操作时间" prop="optionTime"></el-table-column>
              </el-table>
              <div class="el-pagination-wrap text-center">
                <table-pagination :total="count" @change="changeCurrent" ref="loggerPagination"></table-pagination>
              </div>
            </section>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import tablePagination from '@/components/commons/tablePage.vue';

  export default {
    data() {
      return {
        count: 0,
        tabId: 'tab-0',
        parameter: {
          name: ''
        },
        loggerList: []
      }
    },
    methods: {
      /** 查询日志列表 */
      queryLoggers: function () {
        let data = {
          searchKey: this.parameter,
          currPage: this.$refs.loggerPagination.index,
          pageSize: this.$refs.loggerPagination.pageSize
        }

        this.$post(this.urlconfig.smGetLoggers, data).then((res) => {
          if (res.status === 0) {
            this.count = res.data.count;
            this.loggerList = res.data.items;
          }
        }).catch((error) => {
          console.log(error);
        }).then(() => {
          // todo somthing...
        });
      },
      /** 切换页签操作 */
      changeTabs: function (tab, event) {
        this.parameter.name = "";
        this.tabId = event.target.getAttribute('id');

        if (this.tabId == 'tab-0') {
          this.$refs.loggerPagination.index = 1;
          this.queryLoggers();
        }
      },
      /** 切换分页操作 */
      changeCurrent: function () {
        if (this.tabId == 'tab-0') {
          this.queryLoggers();
        }
      },
    },
    mounted() {
      this.queryLoggers();
    },
    components: {
      "tablePagination": tablePagination
    }
  }
</script>

<style scopted>
  .el-header {
    line-height: 60px;
  }

  .el-main {
    height: 100%;
    padding-top: 0px;
  }

  .stm-header-title {
    font-size: 18px;
    color: #59c4ee;
  }

  .logger-params {
    font-size: 14px;
    line-height: 40px;
    margin-bottom: 5px;
    margin-left: 10px;
  }

  .logger-params-input {
    width: 60%;
    vertical-align: middle;
  }
</style>

<style>
  #systemmanagement .el-tabs__header {
    padding: 0;
    position: relative;
  }

  #systemmanagement .el-tabs__item {
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

  #systemmanagement .el-dialog__body {
    padding: 10px 20px;
  }

  #systemmanagement .el-row {
    line-height: 60px;
  }
</style>