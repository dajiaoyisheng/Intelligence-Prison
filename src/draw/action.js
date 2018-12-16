import camera from './camera';
import {DragCreatingTool, gojs} from './dragCreatingTool';
import {PolygonDrawingTool} from './PolygonDrawingTool';
import {GeometryReshapingTool} from './GeometryReshapingTool';


export default class Action {
  //构造函数
  constructor(canvasId, width, height, clickCallback, mouseoverCallback, mouseupCallback) {
    this.width = width;
    this.height = height;
    this.stroke = "#00BFF3";
    this.fill = null;
    this.cameraColor ="#333333";
    this.select = false;
    this.camSVGData = "m26.7,13.016006c-0.16,6.095 -5.55,10.992 -12.2,10.992c-6.61,0 -11.99,-4.864 -12.19,-10.934a5.278,5.278 0 0 1 -2.28,-1.96c-0.11,-1.648 0,-6.3 0,-7.369c4.56,-4.952 24.24,-5.029 28.95,0l0,7.369a5.464,5.464 0 0 1 -2.28,1.9l0,0l0,0.002zm-16.44,6.844l0,0c0.62,1.071 2.28,1.843 4.24,1.843s3.63,-0.772 4.25,-1.843l0,0l0.19,-5.986l0,0a4.511,4.511 0 0 0 -8.87,0l0,0l0.19,5.986zm16.46,-15.116c-4.16,-3.047 -18.96,-3.282 -24.43,-0.081c0,0.551 -0.05,3.024 0.04,3.87c4.3,-2.741 19.96,-2.7 24.39,0l0,-3.787l0,-0.002zm-12.22,10.05a2.552,2.552 0 1 1 -2.26,2.535a2.415,2.415 0 0 1 2.26,-2.535l0,0zm12.22,-10.05";


    this.$ = gojs.GraphObject.make;

    //这是为绘制矩形和椭圆而做的，具体参考https://gojs.net/latest/extensions/DragCreating.html
    this.simpleTemplate = this.$(gojs.Node, "Auto", {
        locationSpot: gojs.Spot.Center,
        minSize: new gojs.Size(60, 20),
        resizable: true,
        rotatable: true,
        zOrder: 10
      },
      new gojs.Binding("angle").makeTwoWay(),
      new gojs.Binding("desiredSize", "size", gojs.Size.parse).makeTwoWay(gojs.Size.stringify),
      new gojs.Binding("position", "pos", gojs.Point.parse).makeTwoWay(gojs.Point.stringify),
      // temporarily put selected nodes in Foreground layer
      new gojs.Binding("layerName", "isSelected", function (s) {
        return s ? "Foreground" : "";
      }).ofObject(),
      this.$(gojs.Shape, "Rectangle", {
          fill:this.fill,
          // opacity:0,
          stroke:this.stroke,
          strokeWidth: 3
        },
        new gojs.Binding("figure", "figure"),
        new gojs.Binding("fill", "color"),
        new gojs.Binding("stroke", "strokeColor")
      ),
      this.$(gojs.TextBlock, {
          margin: 2
        }, new gojs.Binding("stroke", "textColor"),
        new gojs.Binding("text", "text")), {
        mouseEnter: function (e, obj, prev) {
          mouseoverCallback && mouseoverCallback(e, obj, prev);
        },
        click: function (e, obj, prev) {
          clickCallback && clickCallback(e, obj, prev);
        }
      });

    //多边形
    this.polygonTemplate = this.$(gojs.Node, "Spot", {
        locationSpot: gojs.Spot.Center,
        resizable: true,
        zOrder: 10
      }, // to support rotation about the center

      new gojs.Binding("location", "loc", gojs.Point.parse).makeTwoWay(gojs.Point.stringify), {
        selectionAdorned: true,
        selectionObjectName: "SHAPE",
        selectionAdornmentTemplate: // custom selection adornment: a blue rectangle
          this.$(gojs.Adornment, "Auto",
            this.$(gojs.Shape, {
              fill: this.fill,
              // opacity: 0,
              strokeWidth: 3,
              stroke: "dodgerblue",

            }),

            this.$(gojs.Placeholder, {
              margin: -1
            })
          )
      },

      {
        resizable: true,
        resizeObjectName: "SHAPE"
      }, {
        rotatable: true,
        rotateObjectName: "SHAPE"
      }, {
        reshapable: true
      },
      // GeometryReshapingTool assumes nonexistent Part.reshapeObjectName would be "SHAPE"
      this.$(gojs.Shape, {
          name: "SHAPE",
          fill: this.fill,
          // opacity:0,
          stroke: this.stroke,
          // strokeDashArray: [6, 6, 6],
          strokeWidth: 3
        },
        new gojs.Binding("fill"),
        new gojs.Binding("stroke", "strokeColor"),
        new gojs.Binding("desiredSize", "size", gojs.Size.parse).makeTwoWay(gojs.Size.stringify),
        new gojs.Binding("angle").makeTwoWay(),
        new gojs.Binding("geometryString", "geo").makeTwoWay(),
        new gojs.Binding("strokeWidth")),
      this.$(gojs.TextBlock, {
          margin: 2, textAlign: "center", verticalAlignment: gojs.Spot.Center
        },
        new gojs.Binding("stroke", "textColor"),
        new gojs.Binding("text", "text")),
      {
        mouseEnter: function (e, obj, prev) {
          mouseoverCallback && mouseoverCallback(e, obj, prev);
        },
        click: function (e, obj, prev) {
          clickCallback && clickCallback(e, obj, prev);
        }
      }
    );
    //摄像头
    this.cameraTemplate = this.$(gojs.Node, "Auto",
      {
        minSize: new gojs.Size(50, 40),
        resizable: true,
        zOrder: 99,
        locationSpot: gojs.Spot.Center,
        rotatable: true,
        //rotateObjectName: "SHAPE"
      }, new gojs.Binding("angle").makeTwoWay(),
      new gojs.Binding("desiredSize", "size", gojs.Size.parse).makeTwoWay(gojs.Size.stringify),
      new gojs.Binding("position", "pos", gojs.Point.parse).makeTwoWay(gojs.Point.stringify),
      this.$(gojs.Shape, "Rectangle", {
        fill: this.fill,//"#00B5CB",
        // opacity: 0,
        strokeWidth: 0,
        minSize: new gojs.Size(50, 40),
      }, new go.Binding("fill", "color")),
      this.$(gojs.Shape, {
        fill: this.cameraColor,
        strokeWidth: 0,
        geometry: gojs.Geometry.parse(this.camSVGData, true)
      }, new gojs.Binding("fill", "cameraColor")),
      // Each node has a tooltip that reveals the name of its icon
      {
        toolTip: this.$(gojs.Adornment, "Auto",
          this.$(gojs.Shape, {
            fill: "LightYellow",
            stroke: "#888",
          }),
          this.$(gojs.TextBlock, {
              stroke: "#888",
              font: "bold 14px sans-serif"
            },
            new gojs.Binding("text", "cameraName")))
      }, {
        mouseEnter: function (e, obj, prev) {
          mouseoverCallback && mouseoverCallback(e, obj, prev);
        }
      });

    //标签
    this.textTipsTemplate = this.$(gojs.Node, "Auto", {
        movable: true, //禁止移动
        resizable: true, //可以调整大小
        minSize: new gojs.Size(0, 0),
        selectionObjectName: "BODY",
        textEditable: true,
        locationSpot: gojs.Spot.Center,
        rotatable: true,
        zOrder: 100
      },
      new gojs.Binding("stroke", "strokeColor"),
      new gojs.Binding("angle").makeTwoWay(),
      new gojs.Binding("desiredSize", "size", gojs.Size.parse).makeTwoWay(gojs.Size.stringify),
      new gojs.Binding("position", "pos", gojs.Point.parse).makeTwoWay(gojs.Point.stringify),
      this.$(gojs.TextBlock, {
          margin: 2
        }, {editable: true}, new gojs.Binding("stroke", "textColor"),
        new gojs.Binding("text", "text"))
    );

    this.diagram = this.$(gojs.Diagram, canvasId, {
      //以下三行防止出现动态滚动条
      autoScrollRegion: 0,
      hasVerticalScrollbar: false,
      hasHorizontalScrollbar: false,
      //启用撤销重做快捷键
      "undoManager.isEnabled": true,
      //禁止动画效果
      "animationManager.isEnabled": true,
      //鼠标滚轮事件禁止
      "toolManager.mouseWheelBehavior": gojs.ToolManager.WheelNone,
      // nodeTemplate: this.nodeTemplate,

    });


    //底图
    this.background_picture = new gojs.Picture();

    //绑定底图
    this.background = this.$(gojs.Part, // 这个part没有绑定任何model数据
      {
        layerName: "Background",
        location: new gojs.Point(0, 0),
        selectable: false,
        pickable: false
      },
      this.background_picture
    );

    this.diagram.add(this.background);
    this.init();
    this.initTool();
  };

  //添加摄像头
  addCamera(rectuuid, point) {
    this.diagram.clearSelection();
    let cameraNode = new camera(rectuuid, point);
    this.diagram.add(cameraNode);
    // this.setNode(null,"Camera",null);
  };

  doRemove() {
    this.diagram.commandHandler.deleteSelection();
  };

  getSelectionData() {
    let selection = this.diagram.selection;
    let it = selection.iterator;
    for (let i = 0; i < selection.count; i++) {
      it.next();

      return data;
    }
  };

  changeTextColor(textColor) {
    this.updateDataProperty("textColor", textColor);

  };

  updateData(data) {
    let model = this.diagram.model;
    model.startTransaction("flash");
    this.diagram.model.updateTargetBindings(data);
    model.commitTransaction("flash");
  };

  isEditData(pri_code) {
    return this.diagram.findNodesByExample({"pri_code": pri_code}).count > 0;
  };

  removeData(pri_code) {
    let it = this.diagram.findNodesByExample({"pri_code": pri_code});
    let model = this.diagram.model;
    model.startTransaction("flash");
    for (let i = 0; i < it.count; i++) {
      it.next();
      var isPart = it.value instanceof gojs.Part;
      var data = isPart ? it.value.data : it.value;
      data.pri_code = null;
      data.text = "请从右侧拖拽对象进行关联";
      this.diagram.model.updateTargetBindings(data);
    }
    model.commitTransaction("flash");
  };

  updateNodeDataArr(nodesData) {
    let model = this.diagram.model;
    model.startTransaction("flash");
    this.diagram.model.nodeDataArray = nodesData;
    model.commitTransaction("flash");
  };

  updateDataProperty(property, value) {
    let selection = this.getSelectionData();
    let model = this.diagram.model;
    model.startTransaction("flash");
    model.setDataProperty(this.diagram.findNodeForKey(selection.key).data, property, value);
    model.commitTransaction("flash");
  };

  changeBorderColor(borderColor) {
    this.updateDataProperty("strokeColor", borderColor);
  };

  doSelectOnly() {
    let polygonDrawingTool = this.diagram.toolManager.findTool("PolygonDrawing");
    polygonDrawingTool.isEnabled = false;
    let dragCreatingTool = this.diagram.toolManager.findTool("DragCreating");
    dragCreatingTool.isEnabled = false;

    this.select = true;
  };

  //设置线条颜色
  setShape(stroke, figure, fill) {
    // this.stroke = stroke;
    // this.fill = fill;
    this.select = false;

    if ("Polygon" == figure) {
      let polygonDrawingTool = this.diagram.toolManager.findTool("PolygonDrawing");
      polygonDrawingTool.isEnabled = true;
      let archetypePartData = {
        textColor: "red",
        strokeColor: this.stroke,
        category: "polygonTemplate",
        text: "请从右侧拖拽对象进行关联"
      };
      polygonDrawingTool._archetypePartData = archetypePartData;
    } else {
      let archData = {
        textColor: "red",
        strokeColor: this.stroke,
        text: "请从右侧拖拽对象进行关联"
      };
      let polygonDrawingTool = this.diagram.toolManager.findTool("PolygonDrawing");
      polygonDrawingTool.isEnabled = false;

      let dragCreatingTool = this.diagram.toolManager.findTool("DragCreating");
      dragCreatingTool.isEnabled = true;

      if ("Camera" == figure) {
        figure = "Rectangle";
        dragCreatingTool._category = "cameraTemplate";
        archData.cameraName = "";
        dragCreatingTool.archetypeNodeData = archData;

      } else if ("Text" == figure) {
        figure = "Rectangle";
        dragCreatingTool._category = "textTipsTemplate";
        archData.text = "编辑标签内容";
        dragCreatingTool.archetypeNodeData = archData;
      } else {
        dragCreatingTool.archetypeNodeData = archData;
        dragCreatingTool._category = "simpleTemplate";
      }
      dragCreatingTool.box.elt(0).figure = figure;
    }

  };

  //设置底图，这里使用的是base64编码
  setBackgroundPicture(source) {
    this.background_picture.source = source;
    this.background_picture.width = this.width;
    this.background_picture.height = this.height;
  };

  //通过hashid更新图形信息
  updatePropertieByHashid(hashid, name, value) {
    let selection = this.diagram.selection;
    let it = selection.iterator;
    for (let i = 0; i < selection.count; i++) {
      it.next();
      var isPart = it.value instanceof gojs.Part;
      var data = isPart ? it.value.data : it.value;
      if (data.__gohashid == hashid) {
        this.diagram.model.setDataProperty(data, name, value);
        break;
      }
    }
  };

  initTool() {
    let backgroundpic = this.background_picture;
    let fillColor = this.fill;
    let strokeColor = this.stroke;
    // Add an instance of the custom tool defined in DragCreatingTool.js.
    // This needs to be inserted before the standard DragSelectingTool,
    // which is normally the third Tool in the ToolManager.mouseMoveTools list.
    // Note that if you do not set the DragCreatingTool.delay, the default value will
    // require a wait after the mouse down event.  Not waiting will allow the DragSelectingTool
    // and the PanningTool to be able to run instead of the DragCreatingTool, depending on the delay.
    this.diagram.toolManager.mouseMoveTools.insertAt(3,
      this.$(DragCreatingTool, {
        isEnabled: true, // disabled by the checkbox
        delay: 0, // always canStart(), so PanningTool never gets the chance to run
        box: this.$(gojs.Part, {
            layerName: "Tool"
          },
          this.$(gojs.Shape, {
            name: "SHAPE",
            figure: "Rectangle",
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: 2
          })
        ),
        archetypeNodeData: {
          textColor: "red",
          strokeColor: this.stroke,
          text: "请从右侧拖拽对象进行关联"
        }, // initial properties shared by all nodes
        insertPart: function (bounds) { // override DragCreatingTool.insertPart
          // use a different color each time
          // call the base method to do normal behavior and return its result
          return DragCreatingTool.prototype.insertPart.call(this, bounds, backgroundpic);
        }
      }));


    // create polygon drawing tool for myDiagram, defined in PolygonDrawingTool.js
    var tool = new PolygonDrawingTool();
    // provide the default JavaScript object for a new polygon in the model
    tool.archetypePartData = {
      fill: this.fill,
      strokeColor: this.stroke,
      strokeWidth: 2,
      category: "polygonTemplate",
      text: "请从右侧拖拽对象进行关联"
    };
    tool.isPolygon = true; // for a polyline drawing tool set this property to false
    tool.isEnabled = false;
    // install as first mouse-down-tool
    this.diagram.toolManager.mouseDownTools.insertAt(0, tool);

    this.diagram.toolManager.mouseDownTools.insertAt(4, new GeometryReshapingTool());
  };

  init() {
    this.diagram.nodeTemplateMap.add("simpleTemplate", this.simpleTemplate);
    this.diagram.nodeTemplateMap.add("polygonTemplate", this.polygonTemplate);
    this.diagram.nodeTemplateMap.add("cameraTemplate", this.cameraTemplate);
    this.diagram.nodeTemplateMap.add("textTipsTemplate", this.textTipsTemplate);

    this.background_picture.source = "";
    this.background_picture.width = this.width;
    this.background_picture.height = this.height;
    let _this = this;
    this.diagram.mouseOver=function (e) {
      if (_this.select) {
        _this.diagram.currentCursor = "pointer";
      }
    };
  }

};
