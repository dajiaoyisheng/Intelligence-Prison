<template>
  <div id="sysoptionsmanagement" class="w1200">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="23" class="som-header-title"><span>系统选项</span></el-col>
          <el-col :span="1" class="som-header-toolbar">
            <el-button type="primary" size="mini" class="search-btn" @click="saveSysOptions()">保存</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row style="line-height: 30px;">
          <el-col :span="15">
            <span>监狱名称：</span>
            <el-input style="width: 30%;" size="mini" placeholder="请输入内容" v-model="prisonName" clearable></el-input>
          </el-col>
        </el-row>
        <el-row style="line-height: 30px;">
          <el-col :span="15">
            <span>无法定位允许最长时间：</span>
            <el-input-number size="mini" v-model="optionMaxTime" controls-position="right" :min="1" :max="3600"></el-input-number>分
          </el-col>
        </el-row>
        <el-row style="line-height: 30px;">
          <el-col :span="15">
            <span>允许在卫生间中停留的最长时间：</span>
            <el-input-number size="mini" v-model="stayMaxTime" controls-position="right" :min="1" :max="3600"></el-input-number>分
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: '系统选项管理',
        prisonName: "智能监狱",
        optionMaxTime: 5,
        stayMaxTime: 6
      }
    },
    methods: {
      /** 获取系统选项 */
      getSysOptions: function () {
        this.$get(this.urlconfig.ssoGetSysOptions).then((res) => {
          if (res.status === 0) {
            this.optionMaxTime = res.data.optionMaxTime;
            this.stayMaxTime = res.data.stayMaxTime;
            this.prisonName = res.data.prisonName;
          }
        }).catch((error) => {
          console.log(error);
        }).then(() => {
          // todo somthing...
        });
      },
      /** 保存系统选项 */
      saveSysOptions: function () {
        this.$confirm('是否保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = this.createModel();
          this.$post(this.urlconfig.ssoSaveSysOptions, data).then((res) => {
            if (res.status === 0) {
              this.$message.success(res.statusinfo);
            }
          }).catch((error) => {
            console.log(error);
          }).then(() => {
            // todo somthing...
          });
        }).catch((error) => {
          console.log(error);
        });
      },
      /** 创建参数模型 */
      createModel: function () {
        // 无法定位允许最长时间
        let option1 = {}
        option1.name = "optionMaxTime";
        option1.value = this.optionMaxTime;

        // 允许在卫生间中停留的最长时间
        let option2 = {}
        option2.name = "stayMaxTime";
        option2.value = this.stayMaxTime;

        let option3 = {}
        option3.name = "prisonName";
        option3.value = this.prisonName;

        // 系统选项参数集合
        let options = [];
        options.push(option1);
        options.push(option2);
        options.push(option3);

        let data = {};
        data.options = JSON.stringify(options);
        return data;
      }
    },
    mounted() {
      this.getSysOptions();
    }
  }
</script>

<style scoped>
  .el-header {
    line-height: 60px;
  }

  .el-main {
    height: 100%;
    padding: 0px 20px;
  }

  .el-row {
    line-height: 60px;
  }

  .som-header-title {
    color: #59c4ee;
    font-size: 18px;
  }

  .el-input-number {
    margin-right: 5px;
  }
</style>