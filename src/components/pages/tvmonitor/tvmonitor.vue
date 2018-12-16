<template>
  <div id="tvmonitor">
    <section class="tm-left">
      <el-tree :data="treeData" node-key="id" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false" :highlight-current="true">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.isWarning == false"><i :class="node.icon"></i>{{ node.label }}</span>
          <span v-if="data.isWarning == true"><i><img :src="images.warning"></i>{{ node.label }}</span>
        </span>
      </el-tree>
    </section>
    <section class="tm-right">
      <el-container>
        <el-main>
          <el-card class="box-card" style="height: 865px;">
            <div slot="header" class="clearfix"><span>平面图/监控视频</span></div>
            <div>
              <section v-if="(checkedNode != null) && (checkedNode.nodeType != '01') && (checkedNode.nodeType != '04')">
                <span>平面图</span>
              </section>
              <section v-if="(checkedNode != null) && (checkedNode.nodeType == '04')">
                <el-row>
                  <el-col :span="19">
                    <div v-if="(cameras != null) && (cameras.length > 0)">
                      <el-row>
                        <el-col :span="22">
                          <span>时间:</span>
                          <el-date-picker style="width: 43%" size="mini" v-model="params.startTime" type="datetime" value-format="yyyyMMddHHmmss" @change="setStartTime" placeholder="开始时间"></el-date-picker>
                          <span>-</span>
                          <el-date-picker style="width: 43%" size="mini" v-model="params.endTime" type="datetime" value-format="yyyyMMddHHmmss" @change="setEndTime" placeholder="结束时间"></el-date-picker>
                        </el-col>
                        <el-col :span="1">
                          <el-button size="mini" type="primary" class="search-btn" @click="queryVideos">查询</el-button>
                        </el-col>
                      </el-row>
                      <el-row style="margin-right: 20px;">
                        <el-col :span="12" style="text-align: center">
                          <iframe v-for="(camera, index) in cameras" :key="index" v-if="(index % 2) == 0" style="height: 370px; width: 550px;" :src="'../ws_rtsp/rtspPlay.jsp?id=' + camera + '&startTime=' + params.startTime + '&endTime=' + params.endTime"></iframe>
                        </el-col>
                        <el-col :span="12" style="text-align: center">
                          <iframe v-for="(camera, index) in cameras" :key="index" v-if="(index % 2) != 0" style="height: 370px; width: 550px;" :src="'../ws_rtsp/rtspPlay.jsp?id=' + camera + '&startTime=' + params.startTime + '&endTime=' + params.endTime"></iframe>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-else>
                      <img src="@/assets/empty.png">
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <el-card class="box-card" shadow="never" style="height: 220px;">
                      <div slot="header" class="clearfix"><span>相邻摄像头</span></div>
                      <div>
                        <el-row v-for="nearCamera in nearCameras" :key="nearCamera.ciId">
                          <el-col :span="10">
                            {{ nearCamera.ciName }}
                          </el-col>
                          <el-col :span="10">
                            <i style="cursor: pointer;" class="el-icon-circle-plus-outline" @click="addShowVideo(nearCamera.ciId)"></i>
                            <i style="cursor: pointer;" class="el-icon-remove-outline" @click="delShowVideo(nearCamera.ciId)"></i>
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                    <el-card class="box-card" shadow="never" style="height: 540px;">
                      <div slot="header" class="clearfix"><span>所有摄像头</span></div>
                      <div>
                        <el-tree :data="camerasTreeData" node-key="id" default-expand-all @node-click="showVideoClick" :expand-on-click-node="false" :highlight-current="true">
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span v-if="data.isWarning == false"><i :class="node.icon"></i>{{ node.label }}</span>
                            <span v-if="data.isWarning == true"><i><img :src="images.warning"></i>{{ node.label }}</span>
                          </span>
                        </el-tree>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </section>
            </div>
          </el-card>
        </el-main>
        <el-aside class="pn-right-main-aside" style="width: 300px">
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>人员</span></div>
            <div>
              <el-table :data="tableData" stripe style="width: 100%" height="768">
                <el-table-column type="index"   width="50"></el-table-column>
                <el-table-column label="编号"   align="center">
                  <template slot-scope="scope">
                    <el-button @click="showVideo(scope.$index, scope.row)" type="text">
                      <span>{{ scope.row.criCode }}</span>
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="姓名"   align="center">
                  <template slot-scope="scope">
                    <el-button @click="showVideo(scope.$index, scope.row)" type="text">
                      <span>{{ scope.row.criName }}</span>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-aside>
      </el-container>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeData: [],             // 左侧树形数据模型
      tableData: [],            // 监控人员数据模型
      checkedNode: null,        // 当前选中树形节点
      checkedNodeInfo: {},      // 选中树形节点信息
      camerasTreeData: [],      // 摄像头树形
      cameras: [],              // 摄像头列表
      nearCameras: [],          // 相邻摄像头
      params: {                 // 查询条件
        startTime: "",
        endTime: ""
      }
    }
  },
  mounted() {
    this.getPrisonareatree();
  },
  methods: {
    /** 获取左侧树形数据模型 */
    getPrisonareatree: function() {
      this.$get(this.urlconfig.tmGetPrisonareatree).then((res) => {
        if (res.status === 0) {
          this.treeData = res.data;
        }
      }).catch((error) => {
        console.log(error);
      }).then(() => {
        // todo somthing...
      });
    },
    /** 点击左侧树形节点操作 */
    handleNodeClick: function(data) {
      this.checkedNode = data;
      this.getCriminals();
      this.getTreeNodeInfo();
      this.getCameras();
      this.getCamerasTreeData();
    },
    /** 获取监控人员列表 */
    getCriminals: function() {
      let data = {"nodeId":this.checkedNode.id, "nodeType":this.checkedNode.nodeType}
      this.$post(this.urlconfig.tmGetCriminals, data).then((res) => {
        if (res.status === 0) {
          this.tableData = res.data;
        }
      }).catch((error) => {
        console.log(error);
      }).then(() => {
        // todo somthing...
      });
    },
    /** 获取选中树形节点信息 */
    getTreeNodeInfo: function() {
      let data = {"id":this.checkedNode.id, "nodeType":this.checkedNode.nodeType}
      this.$post(this.urlconfig.tmGetTreeNodeInfo, data).then((res) => {
        if (res.status === 0) {
          this.checkedNodeInfo = res.data;
        }
      }).catch((error) => {
        console.log(error);
      }).then(() => {
        // todo somthing...
      });
    },
    /** 获取摄像头列表 */
    getCameras: function() {
      if (this.checkedNode.nodeType == '04') {
        let data = { "paiCode" : this.checkedNode.id }
        this.$post(this.urlconfig.tmGetCameras, data).then((res) => {
          if (res.status === 0) {
            this.cameras = res.data.cameras;
            this.nearCameras = res.data.nearCameras;
          }
        }).catch((error) => {
          console.log(error);
        }).then(() => {
          // todo somthing...
        });
      }
    },
    /** 获取摄像头树形 */
    getCamerasTreeData: function() {
      if (this.checkedNode.nodeType == '04') {
        this.$get(this.urlconfig.tmGetCamerasTreeData).then((res) => {
          if (res.status === 0) {
            this.camerasTreeData = res.data;
          }
        }).catch((error) => {
          console.log(error);
        }).then(() => {
          // todo somthing...
        });
      }
    },
    /** 查看人员定位功能 */
    showVideo: function (index, row) {
      this.$router.push({
        path: "/personnelposition"
      });
    },
    /** 增加显示视频 */
    addShowVideo: function(ciId) {
      var index = this.cameras.indexOf(ciId);
      if (index < 0) {
        this.cameras.push(ciId);
      }
    },
    /** 减少显示视频 */
    delShowVideo: function(ciId) {
      var index = this.cameras.indexOf(ciId);
      if (index > -1) {
        this.cameras.splice(index, 1);
      }
    },
    /** 点击树形节点增加/减少显示视频 */
    showVideoClick: function(data) {
      if (data.nodeType == '05') {
        var index = this.cameras.indexOf(data.id);
        if (index < 0) {
          this.cameras.push(data.id);
        } else {
          this.cameras.splice(index, 1);
        }
      }
    },
    /** 根据条件查询视频 */
    queryVideos: function() {
      let tmpCameras = this.cameras;
      this.cameras = [];
      this.cameras = tmpCameras;
    },
    /** 设置开始时间格式 */
    setStartTime: function(val) {
      this.params.startTime = val;
    },
    /** 设置结束时间格式 */
    setEndTime: function(val) {
      this.params.endTime = val;
    }
  }
}
</script>

<style scoped>
  .tm-left {
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

  .tm-right {
    width: calc(100% - 265px);
    margin: 0px 10px;
    float: right;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

<style>
 #tvmonitor .el-main {
   padding: 0px;
 }

 #tvmonitor .el-carousel__container {
   height: 200px;
 }
</style>