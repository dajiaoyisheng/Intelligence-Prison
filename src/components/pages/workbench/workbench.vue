<template>
  <div class="workbench-wrap w1200">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>犯人总数</span></div>
          <div class="bench-item">
            <div class="bench-item-left v-c">
              <span class="num-big num-color" @click="criTotalPositonSip">{{ criminalStatistics.personnum }}人</span>
            </div>
            <div class="bench-item-right v-c">
              <ul>
                <li v-for="item in criminalStatistics.prisonsers" :key="item.area">
                  <span>{{ item.area }}：</span><span class="num-color word-width" @click="criPrisonPositonSip(item.id)">{{ item.pNumItem }}人</span>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>人员分类</span></div>
          <div class="bench-item">
            <template>
              <ve-pie width="100%" height="100%" :judge-width="true" :data="benchChartPieData" :extend="pieExtend" :after-config="pieAfterConfig"></ve-pie>
            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>预警事件分类</span></div>
          <div class="bench-item">
            <template>
              <ve-histogram :data="benchChartbarData" height="100%" width="100%" :extend="histogramExtend" :settings="chartSettings"></ve-histogram>
            </template>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>人员状态</span></div>
          <div class="bench-item p-status-wrap">
            <ul class="p-status clearfix">
              <li v-for="item in pStatus" :key="item.status">
                <span>{{ item.status }}:</span><span class="num-color word-width" @click="criStatePositonSip(item.id)">{{ item.pNum }}人</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div ref="canvasContainer" style="width:100%; height:100%;">
            <div ref="canvas" id="canvasDiv"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Draw from "@/draw/action";
  export default {
    data() {
      return {
        pStatus: [],            // 人员状态列表
        benchChartbarData: [],  // 预警事件分类
        benchChartPieData: [],  // 人员分类列表
        criminalStatistics: {   // 犯人统计列表
          personnum: "",
          prisonsers: []
        },
        pieExtend: {},          // 人员分类列表图例
        histogramExtend: {},    // 预警事件分类扩展
        chartSettings: {        // 预警事件分类图例
          labelMap: {
            action: "违规行为",
            number: "个数",
            pNumber: "人数"
          }
        },
        drawMapObj : null,
        prisonsData:[]
      };
    },
    mounted: function () {
      this.getPSum();
      this.getPClass();
      this.getPStatus();
      this.getPreWarningClass();
      this.initMap();

    },
    methods: {
      getFirstPrisonInfo: function () {
        this.$get(this.urlconfig.pmGetFirstPrisonInfo).then(res => {
          if (res.status === 0) {
            this.drawMap(res.data);
            for(let i=0;i<this.prisonsData.length;i++){
              let data = this.prisonsData[i];
              if(data.nodeType == "03"){

              }
            }
          }
        }).catch(e => {});
      },
      /** 获取犯人统计 */
      getPSum: function () {
        this.$get(this.urlconfig.wkGetPrisonersData).then(res => {
          if (res.status === 0) {
            this.criminalStatistics = res.data;
          }
        }).catch(e => {});
      },
      /** 获取人员分类 */
      getPClass: function () {
        this.$get(this.urlconfig.wkGetBenchChartPie).then(res => {
          if (res.status === 0) {
            this.benchChartPieData = res.data.pieData;
            this.setPieExtend();
          }
        }).catch(e => {});
      },
      /** 预警事件分类 */
      getPreWarningClass: function () {
        this.$get(this.urlconfig.wkGetBenchChartbarData).then(res => {
          if (res.status === 0) {
            this.benchChartbarData = res.data;
            this.setHistogramExtend();
          }
        }).catch(e => {});
      },
      /** 获取人员状态 */
      getPStatus: function () {
        this.$get(this.urlconfig.wkGetPStatus).then(res => {
          if (res.status === 0) {
            this.pStatus = res.data;
          }
        }).catch(e => {});
      },
      /** 数据转化为配置项结束后触发额外的处理 */
      pieAfterConfig: function (options) {
        if (options.legend) {
          options.legend.formatter = function (name) {
            var data = options.series[0].data; // 获取series中的data
            var targetValue; // 对应图例的值
            data.map(item => {
              if (item.name === name) {
                targetValue = item.value; // 对相应的图例赋值
              }
            });
            return `${name}  ${targetValue}`; // 此处用空格调间距(api没找到配置项)
          };
        }
        return options;
      },
      /** 设置预警事件 */
      setHistogramExtend: function () {
        this.histogramExtend = {
          color: ["#00c6dd", "#5867c2"],
          tooltip: {
            enterable: true,
            trigger: "axis",
            position: ["20%", "20%"],
            extraCssText: "z-index: 99",
            formatter: params => {
              var detil_str = "";
              var detil_num_str = "";
              var index = params[0].dataIndex;

              let warningId = this.benchChartbarData.rows[index].id;
              if ('01' == warningId) {
                var curDetil = this.benchChartbarData.rows[index];
                curDetil.detils.map(item => {
                  detil_str = detil_str + `<div class="class-r-span text-center">${item.detil}</div>`;
                  detil_num_str = detil_num_str +
                    `<div>
                      <a class="fontcolor wordspacing num-color text-decoration" href="/#/querystats/posunusual?isSkip=true&warnType=${item.detilCode}">${item.pNumber}</a>
                      <a class="fontcolor wordspacing num-color text-decoration" href="/#/querystats/posunusual?isSkip=true&warnType=${item.detilCode}">${item.number}</a>
                    </div>`;
                });
              } else if ('02' == warningId) {
                var curDetil = this.benchChartbarData.rows[index];
                curDetil.detils.map(item => {
                  detil_str = detil_str + `<div class="class-r-span text-center">${item.detil}</div>`;
                  detil_num_str = detil_num_str +
                    `<div>
                      <a class="fontcolor wordspacing num-color text-decoration" href="/#/querystats/violation?isSkip=true&warnType=${item.detilCode}">${item.pNumber}</a>
                      <a class="fontcolor wordspacing num-color text-decoration" href="/#/querystats/violation?isSkip=true&warnType=${item.detilCode}">${item.number}</a>
                    </div>`;
                });
              }

              var barItem1 = params[0] || params;
              var barItem2 = params[1] || params;
              var content =
                `<div class="tooltip-wrap clearfixe">
                      <div class="tooltip-left fl">
                        <div class="tooltip-header text-center">分类</div>${detil_str}
                      </div>
                      <div class="tooltip-right fr">
                        <div class="tooltip-header">
                          <span>${barItem2.seriesName}</span>
                          <span>${barItem1.seriesName}</span>
                        </div>${detil_num_str}
                      </div>
                    </div>`;
              return content;
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [{
            type: "category",
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: "value"
          }],
          series: {
            label: {
              show: true,
              position: "top"
            },
            barMaxWidth: 30,
            barGap: 0,
            type: "bar"
          },
          legend: {
            right: "5%",
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            textStyle: {
              padding: [0, 0, 0, 10] // 文字块的内边距
            }
          }
        };
      },
      /** 设置人员分类 */
      setPieExtend: function () {
        let _this = this;
        this.pieExtend = {
          tooltip: {
            enterable: true,
            trigger: "item",
            position: "inside",
            extraCssText: "z-index: 99",
            formatter: function (params) {
              let pieItem1 = params[0] || params;
              var index = pieItem1.dataIndex;
              var curDetil = _this.benchChartPieData.rows[index];

              let content =
                `<div>
                  <p>${pieItem1.name}</p>
                  <p>
                    <a class="fontcolor num-color text-decoration" href="/#/personnelposition?isSkip=true&isSupervision=true&supervisionType=${
                      curDetil.id
                    }">${pieItem1.value}</a>
                  </p>
                  <p>${pieItem1.percent}%</p>
                </div>`;
              return content;
            }
          },
          legend: {
            orient: "vertical",
            top: "middle",
            right: "5%",
            itemWidth: 10, // 图例标记的图形宽度,高度默认是14
            itemHeight: 10,
            itemGap: 20, // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
            textStyle: {
              padding: [0, 0, 0, 10] // 文字块的内边距
            }
          },

          // pie 圆心位置
          series: {
            center: ["30%", "50%"],
            label: {
              show: false
            },
            itemStyle: {
              // 饼图白色间隙
              normal: {
                borderWidth: 4,
                borderColor: "#ffffff"
              }
            }
          }
        };
      },
      /** 犯人总数跳转-总人数 */
      criTotalPositonSip: function() {
        let params = {priCode:'', paiCode:'',  prisoner:'', supervisionType:'', criCurstate:''};
        this.$router.push({
          path: "/personnelposition",
          query: {"isSkip":true, "params": params}
        });
      },
      /** 犯人总数跳转-各监区 */
      criPrisonPositonSip: function(code) {
        let params = {priCode:code, paiCode:'',  prisoner:'', supervisionType:'', criCurstate:''};
        this.$router.push({
          path: "/personnelposition",
          query: {"isSkip":true, "params": params}
        });
      },
      /** 犯人总数跳转-各监区 */
      criStatePositonSip: function(code) {
        let params = {priCode:'', paiCode:'',  prisoner:'', supervisionType:'', criCurstate:code};
        this.$router.push({
          path: "/personnelposition",
          query: {"isSkip":true, "params": params}
        });
      },
      initMap:function(){
        this.initDrawObj();
        this.getFirstPrisonInfo();
      },

      /** 初始化平面图区域 */
      initDrawObj: function() {
        let canvasContainerRect = this.$refs.canvasContainer.getBoundingClientRect();
        let width =canvasContainerRect.width == 0 ? 1200: canvasContainerRect.width;
        let height = canvasContainerRect.height == 0 ? 600: canvasContainerRect.height;

        this.$refs.canvas.style.width = width  + "px";
        this.$refs.canvas.style.height = height + "px";
        this.drawMapObj = new Draw(this, "canvasDiv", width, height, true,
          function(e, obj, prev) {

          }, function (e, obj, prev){

          }, function(e, obj, prev){

          });

      },
      /** 执行画图操作 */
      drawMap: function(data) {
        let relations = data.nodeMapping.length > 10 ?JSON.parse(data.nodeMapping):{};
        if(relations.currScale != undefined){
          this.drawMapObj.diagram.scale = relations.currScale;
        }
        this.drawMapObj.resetPos();
        let dataArr = data.nodeConfig.length > 10 ? JSON.parse(data.nodeConfig) : [];
        this.drawMapObj.updateNodeDataArr(dataArr);
        for (let i = dataArr.length - 1; i >= 0; i--) {
          if(dataArr[i].category == "textTipsTemplate") continue;
          if ((dataArr[i].pri_code == undefined) || (dataArr[i].pri_code == "") || (dataArr[i].pri_code == null)) {
            this.drawMapObj.diagram.model.removeNodeData(dataArr[i]);
          }
        }
        //add 标注当前活动区域
        this.drawMapObj.setBackgroundPicture(data.nodeMap);
        this.drawMapObj.doSelectOnly();
        // this.drawMapObj.doShowOnly();
      },  /** 双击下钻 */
      dbClickBack: function(e, obj, pre) {
        let priCode = obj.data.pri_code;
        let nodeType = obj.data.nodeType;
        let param = {"id":priCode, "nodeType":nodeType};
        this.$post(this.urlconfig.tmGetTreeNodeInfo,param).then((res) => {
          if(res.status == 0){
            this.drawMap(res.data);
          }
        }).catch((error) => {

        }).then(()=>{

        });
      },
    }
  };
</script>

<style scoped>
  .bench-item {
    height: 310px;
    position: relative;
    padding: 10px 10%;
  }

  .bench-item-left {
    left: 9%;
  }

  .bench-item-left .num-big {
    font-size: 35px;
  }

  .bench-item-right {
    display: table;
  }

  .bench-item-right ul {
    display: table-cell;
    vertical-align: middle;
    font-size: 14px;
  }

  .bench-item-right ul li:nth-child(9),
  .bench-item-right ul li:nth-child(10) {
    margin-bottom: 0;
  }

  .bench-item-right {
    width: 55%;
    height: 193px;
    border: 1px solid #e6e6e6;
    right: 10%;
    text-align: center;
  }

  .bench-item-right ul li {
    margin-bottom: 4%;
    width: 50%;
  }

  .bench-item-right ul li:nth-child(odd) {
    float: left;
  }

  .bench-item-right ul li:nth-child(even) {
    float: right;
  }

  .p-status-wrap {
    position: relative;
  }

  ul.p-status {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
  }

  ul.p-status li {
    float: left;
    width: 45%;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  ul.p-status li a {
    margin-left: 10px;
  }

  ul.p-status li:nth-child(odd) {
    border-bottom: 1px solid #e0e3ec;
    border-right: 1px solid #e0e3ec;
    text-align: left;
  }

  ul.p-status li:nth-child(even) {
    border-bottom: 1px solid #e0e3ec;
    text-align: right;
  }

  ul.p-status li:nth-child(1),
  ul.p-status li:nth-child(2),
  ul.p-status li:nth-last-child(1),
  ul.p-status li:nth-last-child(2) {
    height: 40px;
  }

  ul.p-status li:nth-child(1),
  ul.p-status li:nth-child(2) {
    line-height: 20px;
  }

  ul.p-status li:nth-last-child(1),
  ul.p-status li:nth-last-child(2) {
    border-bottom: none;
  }

  ul.p-status li:last-child {
    height: 40px;
    border-bottom: none;
  }
</style>

<style>
  .tooltip-wrap {
    width: 260px;
    height: 100px;
  }

  .tooltip-left {
    display: inline-block;
    border-right: 1px solid #fff;
    width: 70%;
  }

  .tooltip-header {
    border-bottom: 1px solid #fff;
  }

  .tooltip-right {
    display: inline-block;
    float: right;
    width: 29%;
  }

  .fontcolor num-color {
    color: #fff;
  }

  .num-color.text-decoration {
    color: #0099ff;
  }

  .wordspacing {
    text-align: center;
    display: inline-block;
    width: 2em;
    height: 26px;
    line-height: 26px;
  }

  .class-r-span {
    height: 26px;
    line-height: 26px;
  }

  .text-decoration {
    text-decoration: underline;
  }
</style>
