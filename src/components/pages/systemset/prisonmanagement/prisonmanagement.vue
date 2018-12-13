<template>
  <div id="prisonmanagement">
    <!-- 左 -->
    <section class="aside-l fl inbl">
      <div class="h aside-l-h clearfix">
        <div class="l fl">
          <!--  
          <img :src="images.exportgroup">
          <img :src="images.importgroup">
          -->
        </div>
        <div class="r fr">
          <img :src="images.add"  @click="addTreeNode()"  alt="添加">
          <img :src="images.edit" @click="editTreeNode()" alt="编辑">
          <img :src="images.del"  @click="delTreeNode()"  alt="删除">
        </div>
      </div>
      <div class="left-tree">
        <v-tree ref="leftTree" :tree-data="Prisonareatree" @handle-node-click="handleNodeClick"></v-tree>
      </div>
    </section>
    <!-- 窗口 -->
    <section>
      <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="800px" :before-close="beforeClose">
          <prisonInfo ref="prisonItemInfo" :saveNodeCallBack="saveNodeCallBack"></prisonInfo>
      </el-dialog>
    </section>
    <!-- 中 -->
    <section class="aside-r fr inbl">
      <div class="h clearfix">
        <div class="aside-r-h-l fl inbl clearfix">
          <div class="l fl">
            <img :src="images.exportgroup" title="导出">
            <el-upload
              action
              ref="upload"
              style="display: inline-block;"
              :before-upload="checkTreeSelected"
              :on-change="handleFileListChange"
              :file-list="fileList"
              :auto-upload="false"
              :show-file-list="false"
              title="导入平面图"
            >
              <img :src="images.importgroup">
            </el-upload>
            <img :src="images.save" @click="tojson()" title="保存">
          </div>
          <div class="r fr clearfix">
            <img :src="images.del"      title="删除">
            <img :src="images.div"      title="矩形"    @click="draw('Rectangle')">
            <img :src="images.polygon"  title="多边形">
            <img :src="images.oval"     title="椭圆"    @click="draw('Ellipse')">
            <!-- 绘制标签，可以使用固定大小的矩形 -->
            <img :src="images.label"    title="标签"    @click="draw('text')">
            <span class="text-color-wrap">
              <img :src="images.textA" title="文本颜色">
              <el-color-picker :popper-class="'color-picker-drop'" v-model="textColor" @change="changeTextColor"></el-color-picker>
            </span>
            <span class="text-color-wrap">
              <img :src="images.colorborder" title="容器框颜色">
              <el-color-picker :popper-class="'color-picker-drop'" v-model="strokeStyle" @change="changeBorderColor"></el-color-picker>
            </span>
          </div>
        </div>
        <div class="aside-r-h-r fr text-center">
          <el-button class="search-btn" size="small">保存</el-button>
        </div>
      </div>
      <div class="main">
        <div class="l fl inbl">
          <div ref="canvasContainer" class="actionImage">
            <!-- 画图区域 -->
            <div ref="canvas" id="canvas"></div>
          </div>
        </div>
        <div class="r fr inbl">
          <el-card class="box-card" style="height: 400px; margin-bottom: 10px;">
            <div slot="header" class="clearfix">
              <span>对象</span>
            </div>
            <div>
              <v-tree ref="rightTree" :draggable="true" :default-expand-all="true" :tree-data="PrisonareaObjtree"
                      @handle-drag-end="handleDragEnd" @handle-drag-start="handleDragStart" @handle-node-click="handleObjectNodeClick">
              </v-tree>
            </div>
          </el-card>
          <el-card class="box-card" style="height: 200px;">
            <div slot="header" class="clearfix">
              <span>区域属性</span>
            </div>
            <div style="font-size: 14px;">
              <el-row>
                <el-col :span="6"><span>名称:</span></el-col>
                <el-col :span="18"><span class="value" v-text="objectInfo.nodeName"></span></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><span>类型:</span></el-col>
                <el-col :span="18"><span class="value" v-text="objectInfo.nodeTypeTitle"></span></el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import vTree from "@/components/commons/tree.vue";
import prisonInfo from "./prisonInfo.vue";
import mounted from "./mounted.js";
import actions from "./actions.js";
import datas from "./datas.js";

export default {
  // VUE中的混入操作，将代码分散到多个文件中
  mixins: [datas, mounted, actions],
  components: { vTree, prisonInfo },
  created: function() {
    this.loadTree();
  },
  methods: {
    /** 导出json */
    tojson: function() {},
    /** 上传文件之前的检查，目前有问题 */
    checkTreeSelected: function() {
      if (this.selectedTreeObj == null) {
        this.$alert("请先选择树节点", {
          confirmButtonText: "确定",
          showClose: false
        });
        return false;
      }
    },
    /** 读取上传的背景图片并转换成base64格式 */
    handleFileListChange: function(file, fileList) {
      let _this = this;
      //创建一个reader
      let reader = new FileReader();
      //将图片转成base64格式
      reader.readAsDataURL(file.raw);
      reader.onload = function(event) {
        var base64txt = (_this.backgroundImage = event.target.result);
        _this.drawObj.setBackgroundPicture(base64txt);
      };
    },
    /** 检查背景图是否被载入 */
    checkBackgroundImage: function() {
      this.$alert("请先导入平面图", {
        confirmButtonText: "确定",
        showClose: false
      });
    },
    /** 绘制 */
    draw: function(type) {
      if (this.backgroundImage !== null) {
        this.shapeType = type;
        this.startDraw();
      } else {
        this.checkBackgroundImage();
      }
    },
    /** 具体绘制操作 */
    startDraw: function() {
      this.drawObj.setShape(this.strokeStyle, this.shapeType);
    },
    /** 更改文字颜色 */
    changeTextColor: function(curTextColor) {
      console.log(`changeTextColor:`, curTestColor);
    },
    /** 更改图形边框颜色 */
    changeBorderColor: function(curBorderColor) {
      if (this.mouseClickedGraph) {
        let uuid = this.mouseClickedGraph.getAttr("uuid");
      }
    }
  }
};
</script>

<style scoped>
.h {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #e0e3ec;
}

img {
  cursor: pointer;
}

.aside-l {
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

.aside-r {
  width: calc(100% - 250px);
}

.aside-l-h {
  padding: 0 10%;
}

.aside-l.fl.inbl {
  background: #ffffff;
}

.left-tree {
  margin-top: 20px;
}

.aside-l-h .l {
  width: 40%;
}

.aside-l-h .r {
  width: 57%;
}

.aside-l-h .l img {
  margin-right: 15px;
}

.aside-l-h .r img {
  margin-left: 12px;
}

.aside-r-h-l {
  margin-left: 47px;
  width: calc(100% - 460px);
}

.aside-r-h-l .l {
  width: 50%;
}

.aside-r-h-l .r {
  width: 50%;
  text-align: right;
}

.aside-r-h-l .l img,
.aside-r-h-l .r img {
  width: 15px;
  height: 15px;
}

.aside-r-h-l .l img {
  margin-right: 29px;
}

.aside-r-h-l .r img {
  margin-left: 20px;
}

.aside-r-h-r {
  margin-right: 34px;
}

.main {
  padding: 20px 2% 5%;
}

.main .actionImage {
  min-height: 500px;
  background: #fff;
  width: 100%;
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
}

.h-line {
  font-size: 14px;
  font-weight: 400;
  color: #59c4ee;
}

.h-line:after {
  width: 89%;
}

.camera-list {
  padding: 15px 0;
}

.camera-list > span {
  margin-right: 19px;
}

.camera-list > span > .name {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}

.camera-list > span > .icon > img {
  width: 18px;
  height: 14px;
}

.main .l {
  width: calc(100% - 370px);
}

.main .r {
  width: 342px;
}

.main .r .t,
.main .r .d {
  border: 1px solid #e0e3ec;
  padding: 37px 97px 31px 44px;
  color: #666666;
  font-size: 14px;
  font-weight: 400;
}

.main .r .t {
  margin-bottom: 30px;
}

.main .r .d p {
  margin-bottom: 10px;
}

.main .r .line-word > p > b {
  color: #333333;
  font-size: 14px;
  font-weight: 400;
}

.main .r .line-word > p > .value {
  margin-left: 35px;
}

.text-color-wrap {
  position: relative;
}
</style>

<style>
.el-color-picker {
  position: absolute;
  left: 0;
  opacity: 0;
}

.el-color-picker__color-inner {
  background-color: #e0e3ec !important;
}

.el-color-picker__trigger {
  border: none;
}

#prisonmanagement .el-dialog__body {
  padding: 10px 20px;
}

#prisonmanagement .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
</style>