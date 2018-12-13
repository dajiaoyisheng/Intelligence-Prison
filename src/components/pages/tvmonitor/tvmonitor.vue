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
                  <el-col :span="20">
                    <iframe v-for="camera in cameras" :key="camera" style="height: 380px; width: 800px;" :src="'../ws_rtsp/rtspPlay.jsp?id=' + camera"></iframe>
                  </el-col>
                  <el-col :span="4">
                    <el-card class="box-card" shadow="never" style="height: 220px;">
                      <div slot="header" class="clearfix"><span>相邻摄像头</span></div>
                      <div>

                      </div>
                    </el-card>
                    <el-card class="box-card" shadow="never" style="height: 540px;">
                      <div slot="header" class="clearfix"><span>所有摄像头</span></div>
                      <div>

                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </section>
            </div>
          </el-card>
        </el-main>
        <el-aside class="pn-right-main-aside" style="width: 400px">
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>楼层</span></div>
            <div>
              <el-carousel trigger="click" :autoplay="false" indicator-position="none" arrow="always">
                <el-carousel-item v-for="item in floors" :key="item">
                  <img :src="item">
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>人员</span></div>
            <div>
              <el-table :data="tableData" stripe style="width: 100%" height="465">
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
import floor1 from '@/assets/floor.png';
import floor2 from '@/assets/floor1.png';

export default {
  data() {
    return {
      treeData: [],             // 左侧树形数据模型
      tableData: [],            // 监控人员数据模型
      checkedNode: null,        // 当前选中树形节点
      checkedNodeInfo: {},      // 选中树形节点信息
      cameras: ['1', '2'],      // 摄像头列表
      nearCameras: [],          // 相邻摄像头
      floors: [floor1, floor2], // 楼层平面图
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
    /** 查看人员定位功能 */
    showVideo: function (index, row) {
      this.$router.push({
        path: "/personnelposition"
      });
    },
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