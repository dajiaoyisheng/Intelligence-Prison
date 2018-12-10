<template>
  <div id="prisonmanagement">
    <!-- 左 -->
    <section class="aside-l fl inbl">
      <div class="h aside-l-h clearfix">
        <div class="l fl">
          <img :src="images.exportgroup" alt>
          <img :src="images.importgroup" alt>
        </div>
        <div class="r fr">
          <img :src="images.add" @click="addTreeNode()" alt="添加">
          <img :src="images.edit" @click="editTreeNode()" alt="编辑">
          <img :src="images.del" @click="delTreeNode()" alt="删除">
        </div>
      </div>

      <div class="left-tree">
        <v-tree ref="leftTree" :tree-data="Prisonareatree" v-on:handle-node-click="handleNodeClick"></v-tree>
      </div>
    </section>
    <!-- 中 -->
    <section class="aside-r fr inbl">
      <div class="h clearfix">
        <div class="aside-r-h-l fl inbl clearfix">
          <div class="l fl">
            <img :src="images.exportgroup" title="导出">
            <el-upload
              style="display: inline-block;"
              ref="upload"
              action
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
            <img :src="images.del" title="删除">
            <img :src="images.div" @click="draw('Rectangle')" title="矩形">
            <img :src="images.polygon" title="多边形">
            <img :src="images.oval" @click="draw('Ellipse')" title="椭圆">
            <!-- 绘制标签，可以使用固定大小的矩形 -->
            <img :src="images.label" @click="draw('text')" title="标签">
            <span class="text-color-wrap">
              <img :src="images.textA" title="文本颜色">
              <el-color-picker
                :popper-class="'color-picker-drop'"
                v-model="textColor"
                @change="changeTextColor"
              ></el-color-picker>
            </span>
            <span class="text-color-wrap">
              <img :src="images.colorborder" title="容器框颜色">
              <el-color-picker
                :popper-class="'color-picker-drop'"
                v-model="strokeStyle"
                @change="changeBorderColor"
              ></el-color-picker>
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
          <div class="t line-word" title="对象">
            <span></span>
            <v-tree
              ref="rightTree"
              :draggable="true"
              :tree-data="PrisonareaObjtree"
              :default-expand-all="true"
              v-on:handle-node-click="handleObjectNodeClick"
              v-on:handle-drag-start="handleDragStart"
              v-on:handle-drag-end="handleDragEnd"
            ></v-tree>
          </div>

          <div class="d line-word" title="属性">
            <span></span>
            <p>
              <b>区域属性</b>
            </p>
            <p>
              <span>编码:</span>
              <span class="value" v-text="objectInfo.pri_code"></span>
            </p>
            <p>
              <span>名称:</span>
              <span class="value" v-text="objectInfo.name"></span>
            </p>
            <p>
              <span>位置:</span>
              <span class="value" v-text="objectInfo.position"></span>
            </p>
            <p>
              <span>角度:</span>
              <span class="value">
                <input v-model="objectInfo.angle" style="width: 20px;">
              </span>
            </p>
            <p>
              <span>备注:</span>
              <span class="value"></span>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import vTree from "@/components/commons/tree.vue";

//datas 定义了一些变量
import datas from "./datas.js";
// mounted 页面绑定之后的操作，主要是绘图区的初始化，以及对象拖拽到图形上的后续操作
import mounted from "./mounted.js";
//树操作
import treeActions from "./treeActions.js";

//如果要联调则使用这个文件，同时将src/main.js的Mock.bootstrap();行注释
// import actions from "./actions.js";
//如果是demo则使用这个文件，同时将src/main.js的Mock.bootstrap();行注释打开
import actions from "./demoActions.js";

export default {
  //vue中的混入操作，目的是将代码分散到多个文件中
  mixins: [datas, mounted, treeActions, actions],
  components: {
    vTree
  },
  created: function() {
    //加载树数据，在actions中
    this.loadTree();
  },
  methods: {
    //导出json
    tojson() {},
    //上传文件之前的检查，目前有问题
    checkTreeSelected() {
      if (this.selectedTreeObj == null) {
        this.$alert("请先选择树节点", {
          confirmButtonText: "确定",
          showClose: false
        });
        return false;
      }
    },
    //读取上传的背景图片并转换成base64格式
    handleFileListChange(file, fileList) {
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
    //检查背景图是否被载入
    checkBackgroundImage() {
      this.$alert("请先导入平面图", {
        confirmButtonText: "确定",
        showClose: false
      });
    },
    //绘制
    draw(type) {
      if (this.backgroundImage !== null) {
        this.shapeType = type;
        this.startDraw();
      } else {
        this.checkBackgroundImage();
      }
    },
    //具体绘制操作
    startDraw() {
      this.drawObj.setShape(this.strokeStyle, this.shapeType);
    },
    //更改文字颜色
    changeTextColor(curTextColor) {
      console.log(`changeTextColor:`, curTestColor);
    },
    //更改图形边框颜色
    changeBorderColor(curBorderColor) {
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
  width: 18%;
}

.aside-r {
  width: 82%;
}

.aside-l-h {
  padding: 0 10%;
  border-right: 1px solid #e0e3ec;
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
  width: 66%;
}

.aside-r-h-l .l {
  width: 50%;
}

.aside-r-h-l .r {
  width: 50%;
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
  width: 66%;
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

.color-picker-drop {
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
</style>
