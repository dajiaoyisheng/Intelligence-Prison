<template>
  <div class="workbench-wrap w1200">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>犯人总数</span></div>
          <div class="bench-item">
            <div class="bench-item-left v-c">
              <router-link class="num-big num-color" to="/personnelposition">{{ criminalStatistics.personnum }}人</router-link>
            </div>
            <div class="bench-item-right v-c">
              <ul>
                <li v-for="item in criminalStatistics.prisonsers" :key="item.area">
                  <span>{{ item.area }}：</span>
                  <router-link class="num-color word-width" :to="{path:'/personnelposition', query:{ area:item.area }}">{{ item.pNumItem }}人</router-link>
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
                <span>{{ item.status }}:</span>
                <router-link class="num-color word-width" :to="{path:'/personnelposition', query:{ status:item.status }}">{{item.pNum }}人</router-link>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        平面图
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
        }
      };
    },
    mounted: function () {
      this.getPSum();
      this.getPClass();
      this.getPStatus();
      this.getPictureList();
      this.getPreWarningClass();
    },
    methods: {
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
      /** 获取监区平面图数据 */
      getPictureList: function () {
        // TODO:有待补充
      },
      /** 点击钻取监区 */
      displayBImg: function (curPic, e) {
        // TODO:有待补充
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
            enterable: true, // 鼠标是否可进入tooltip
            position: ["20%", "20%"],
            trigger: "axis", // 触发方式
            extraCssText: "z-index: 99",
            // axisPointer: { // 坐标轴指示器，坐标轴触发有效
            //   type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            // },
            formatter: params => {
              var detil_str = "";
              var detil_num_str = "";
              var index = params[0].dataIndex;
              var curDetil = this.benchChartbarData.rows[index];
              curDetil.detils.map(item => {
                detil_str =
                  detil_str +
                  `<div class="class-r-span text-center">${item.detil}</div>`;
                detil_num_str =
                  detil_num_str +
                  // 要求数字居右?太丑 class="text-right"
                  `<div>
                      <a class="fontcolor wordspacing num-color text-decoration" href="/#/querystats/violation?warnclass=${
                        item.detil
                      }">${item.pNumber}</a>
                      <a class="fontcolor wordspacing num-color text-decoration" href="/#/querystats/violation?warnclass=${
                        item.detil
                      }">${item.number}</a>
                    </div>`;
              });
              var barItem1 = params[0] || params;
              var barItem2 = params[1] || params;
              // if (barItem1.componentType == 'series') {
              var content =
                `<div class="tooltip-wrap clearfixe">
                      <div class="tooltip-left fl">
                        <div class="tooltip-header text-center">分类</div>
                        ${detil_str}
                      </div>
                      <div class="tooltip-right fr">
                        <div class="tooltip-header">
                          <span>${barItem2.seriesName}</span>
                          <span>${barItem1.seriesName}</span>
                        </div>
                        ${detil_num_str}
                      </div>
                    </div>`;
              return content;
              // }
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
        this.pieExtend = {
          tooltip: {
            enterable: true,
            trigger: "item",
            position: "inside",
            extraCssText: "z-index: 99",
            formatter: function (params) {
              let pieItem1 = params[0] || params;
              let content =
                `<div>
                  <p>${pieItem1.name}</p>
                  <p>
                    <a class="fontcolor num-color text-decoration" href="/#/personnelposition?level=${
                      pieItem1.name
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
      }
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