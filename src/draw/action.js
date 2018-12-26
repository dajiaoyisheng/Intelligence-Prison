import camera from './camera';
import {DragCreatingTool, gojs} from './dragCreatingTool';
import {PolygonDrawingTool} from './PolygonDrawingTool';
import {GeometryReshapingTool} from './GeometryReshapingTool';


export default class Action {

  //构造函数
  constructor($this,canvasId, width, height,readOnly, clickCallback, mouseoverCallback, mouseupCallback) {
    this.width = width;
    this.height = height;
    this.stroke  = "#00BFF3";
    this.fill =  "transparent";
    this.textColor = "red";

    this.cameraColor ="#2b2b2b";
    this.select = false;
    this.camSVGData = "m26.7,13.016006c-0.16,6.095 -5.55,10.992 -12.2,10.992c-6.61,0 -11.99,-4.864 -12.19,-10.934a5.278,5.278 0 0 1 -2.28,-1.96c-0.11,-1.648 0,-6.3 0,-7.369c4.56,-4.952 24.24,-5.029 28.95,0l0,7.369a5.464,5.464 0 0 1 -2.28,1.9l0,0l0,0.002zm-16.44,6.844l0,0c0.62,1.071 2.28,1.843 4.24,1.843s3.63,-0.772 4.25,-1.843l0,0l0.19,-5.986l0,0a4.511,4.511 0 0 0 -8.87,0l0,0l0.19,5.986zm16.46,-15.116c-4.16,-3.047 -18.96,-3.282 -24.43,-0.081c0,0.551 -0.05,3.024 0.04,3.87c4.3,-2.741 19.96,-2.7 24.39,0l0,-3.787l0,-0.002zm-12.22,10.05a2.552,2.552 0 1 1 -2.26,2.535a2.415,2.415 0 0 1 2.26,-2.535l0,0zm12.22,-10.05";

    this.moveable = !readOnly;
    this.resizable = !readOnly;
    this.rotaeable = !readOnly;
    this.warningTimeout = null;
    this.createEnable = false;
    this.$ = gojs.GraphObject.make;
    //这是为绘制矩形和椭圆而做的，具体参考https://gojs.net/latest/extensions/DragCreating.html
    this.simpleTemplate = this.$(gojs.Node, "Auto", {
        locationSpot: gojs.Spot.Center,
        minSize: new gojs.Size(20, 20),
        resizable: this.resizable,
        movable: this.moveable,
        rotatable: this.rotaeable,
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
        },
        doubleClick:function(e, obj, prev){
          $this.dbClickBack && $this.dbClickBack(e, obj, prev);
        }
      });

    //多边形
    this.polygonTemplate = this.$(gojs.Node, "Spot", {
        locationSpot: gojs.Spot.Center,
        resizable: this.resizable,
        rotatable:this.rotaeable,
        movable: this.moveable,
        zOrder: 10
      }, // to support rotation about the center
      new gojs.Binding("position", "pos", gojs.Point.parse).makeTwoWay(gojs.Point.stringify),
      new gojs.Binding("location", "loc", gojs.Point.parse).makeTwoWay(gojs.Point.stringify), {
        selectionAdorned: true,
        selectionObjectName: "SHAPE",
        selectionAdornmentTemplate: // custom selection adornment: a blue rectangle
          this.$(gojs.Adornment, "Auto",{
              movable: this.moveable,
              zOrder: 9
            },
            this.$(gojs.Shape, {
              fill: this.fill,
              // opacity: 0,
              strokeWidth: 3,
              stroke: "dodgerblue",

            }),

            this.$(gojs.Placeholder, {
              margin: -1
            }),
            {
              mouseEnter: function (e, obj, prev) {
                mouseoverCallback && mouseoverCallback(e, obj, prev);
              },
              click: function (e, obj, prev) {
                clickCallback && clickCallback(e, obj, prev);
              },doubleClick:function(e, obj, prev){
                $this.dbClickBack && $this.dbClickBack(e, obj, prev);
              }
            }
          )
      },

      {
        resizable: this.resizable,
        resizeObjectName: "SHAPE"
      }, {
        rotatable:this.rotaeable,
        rotateObjectName: "SHAPE"
      }, {
        reshapable: !readOnly
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
        },doubleClick:function(e, obj, prev){
          $this.dbClickBack && $this.dbClickBack(e, obj, prev);
        }
      }
    );
    //摄像头
    this.cameraTemplate = this.$(gojs.Node, "Auto",
      {
        minSize: new gojs.Size(40, 40),
        resizable: this.resizable,
        zOrder: 99,
        movable: this.moveable,
        locationSpot: gojs.Spot.Center,
        rotatable: this.rotaeable,
        //rotateObjectName: "SHAPE"
      }, new gojs.Binding("angle").makeTwoWay(),
      new gojs.Binding("desiredSize", "size", gojs.Size.parse).makeTwoWay(gojs.Size.stringify),
      new gojs.Binding("position", "pos", gojs.Point.parse).makeTwoWay(gojs.Point.stringify),
      this.$(gojs.Shape, "Rectangle", {
        fill: this.fill,//"#00B5CB",
        // opacity: 0,
        strokeWidth: 0,
        minSize: new gojs.Size(40, 40),
      }, new gojs.Binding("fill", "color")),
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
        },
        click: function (e, obj, prev) {
          clickCallback && clickCallback(e, obj, prev);
        }
      });


    //标签
    this.textTipsTemplate = this.$(gojs.Node, "Auto", {
        movable: this.moveable, //禁止移动
        resizable: this.resizable, //可以调整大小
        minSize: new gojs.Size(0, 0),
        selectionObjectName: "BODY",
        textEditable: true,
        locationSpot: gojs.Spot.Center,
        rotatable: this.rotaeable,
        zOrder: 100
      },
      new gojs.Binding("stroke", "strokeColor"),
      new gojs.Binding("angle").makeTwoWay(),
      new gojs.Binding("desiredSize", "size", gojs.Size.parse).makeTwoWay(gojs.Size.stringify),
      new gojs.Binding("position", "pos", gojs.Point.parse).makeTwoWay(gojs.Point.stringify),
      this.$(gojs.TextBlock, {
          margin: 2
        }, {editable: true}, new gojs.Binding("stroke", "textColor"),
        new gojs.Binding("text", "text").makeTwoWay())
    );

    //人
    this.prisonerTemplate =
      this.$(gojs.Node,{
          zOrder: 999,
          movable: false,
        },
        new gojs.Binding("location", "loc"),  // specified by data
        { locationSpot: gojs.Spot.Center },   // at center of node
        this.$(gojs.Shape, "Circle",
          { width: 15, height: 15, strokeWidth: 3 ,fill:"yellow",stroke:"blue"}
        ),  // also specified by data
        // { // this tooltip shows the name and picture of the kitten
        //   toolTip:
        //     this.$(gojs.Adornment, "Auto",
        //       this.$(gojs.Shape, { fill: "lightyellow" }),
        //       this.$(gojs.Panel, "Vertical",
        //         this.$(gojs.Picture, { margin: 3 },
        //           new gojs.Binding("source", "src", function(s) { return "images/" + s + ".png"; })),
        //         this.$(gojs.TextBlock, { margin: 3 },
        //           new gojs.Binding("text", "key"))
        //       )
        //     )  // end Adornment
        // }
      );

    this.diagram = this.$(gojs.Diagram, canvasId, {
      //以下三行防止出现动态滚动条
      // autoScrollRegion: 0,
      // hasVerticalScrollbar: false,
      // hasHorizontalScrollbar: false,
      initialContentAlignment: gojs.Spot.TopLeft,
      // autoScale:gojs.Diagram.UniformToFill,
      allowZoom:true,
      position : new gojs.Point(0,0),
      // initialAutoScale: gojs.Diagram.Uniform,

      // scale:0.75,
      //启用撤销重做快捷键
      "undoManager.isEnabled": true,

      "clickCreatingTool.isDoubleClick": false,
      "clickCreatingTool.isEnabled": this.createEnable,
      "clickCreatingTool.archetypeNodeData": { text: "", color: this.fill ,category:"cameraTemplate",figure:"Rectangle"},
      //禁止动画效果
      "animationManager.isEnabled": false,
      //鼠标滚轮事件禁止
      // "toolManager.mouseWheelBehavior": gojs.ToolManager.WheelNone,
      // nodeTemplate: this.nodeTemplate,

    });


    //底图
    this.background_picture = new gojs.Picture();

    //绑定底图
    this.background = this.$(gojs.Part, // 这个part没有绑定任何model数据
      {
        layerName: "Background",
        // position: new gojs.Point(0,0),
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
      var isPart = it.value instanceof gojs.Part;
      var data = isPart ? it.value.data : it.value;
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

  removeData(pri_code,category) {
    let it = this.diagram.findNodesByExample({"pri_code": pri_code});
    let model = this.diagram.model;

    model.startTransaction("flash");
    for (let i = 0; i < it.count; i++) {
      it.next();
      let isPart = it.value instanceof gojs.Part;
      let data = isPart ? it.value.data : it.value;
      data.pri_code = null;
      data.text = "请从右侧拖拽对象进行关联";
      if(data.category == "cameraTemplate"){
        data.cameraColor = this.cameraColor;
      }else{
        data.textColor = this.textColor;
      }

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
    this.createEnable = false;
    this.select = true;
    this.diagram.toolManager.clickCreatingTool.isEnabled = this.createEnable;
    this.diagram.allowTextEdit = false;

  };
  resetPos(){
    this.diagram.position = new gojs.Point(0,0);
  };
  doShowOnly(){
    this.diagram.isReadOnly= true;  // do not allow users to modify or select in this view
    this.diagram.allowSelect= false;
  };
  //选中关联节点
  doSelectPart(pri_code) {
    let it = this.diagram.findNodesByExample({"pri_code": pri_code});

    // model.startTransaction("flash");
    for (let i = 0; i < it.count; i++) {
      it.next();
      if(it.value instanceof gojs.Part){
        this.diagram.select(it.value)
      }
    }
    // model.commitTransaction("flash");
  };

  //设置线条颜色
  setShape(stroke, figure, fill) {
    // this.stroke = stroke;
    // this.fill = fill;
    this.select = false;
    this.createEnable = false;
    this.diagram.allowTextEdit = true;

    if ("Polygon" == figure) {

      let polygonDrawingTool = this.diagram.toolManager.findTool("PolygonDrawing");
      polygonDrawingTool.isEnabled = true;
      let archetypePartData = {
        textColor: this.textColor,
        strokeColor: this.stroke,
        category: "polygonTemplate",
        text: "请从右侧拖拽对象进行关联"
      };
      polygonDrawingTool._archetypePartData = archetypePartData;
    } else {
      let archData = {
        textColor: this.textColor,
        strokeColor: this.stroke,
        text: "请从右侧拖拽对象进行关联"
      };
      let polygonDrawingTool = this.diagram.toolManager.findTool("PolygonDrawing");
      polygonDrawingTool.isEnabled = false;

      let dragCreatingTool = this.diagram.toolManager.findTool("DragCreating");
      dragCreatingTool.isEnabled = true;

      if ("Camera" == figure) {
        this.createEnable = true;
        figure = "Rectangle";
        dragCreatingTool._category = "cameraTemplate";
        archData.cameraName = "";
        dragCreatingTool.archetypeNodeData = archData;

      } else if ("Text" == figure) {
        figure = "Rectangle";
        dragCreatingTool._category = "textTipsTemplate";
        archData.text = "编辑标签内容";
        dragCreatingTool.archetypeNodeData = archData;
      } else if ("Prisoner" == figure) {
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
    this.diagram.toolManager.clickCreatingTool.isEnabled = this.createEnable;
  };

  //设置底图，这里使用的是base64编码
  setBackgroundPicture(source) {
    this.background_picture.source = source;
    this.background_picture.position= new gojs.Point(0,0);
    // this.background_picture.width = this.width;
    // this.background_picture.height = this.height;
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
  activeWarning(priCodes){
    let atNodeDataArr = [];
    for(let k = 0; k < priCodes.length; k++){
      let pri_code  = priCodes[k];
      let it = this.diagram.findNodesByExample({"pri_code": pri_code}); //绑定节点区域或者摄像头
      for (let i = 0; i < it.count; i++) {
        it.next();
        let isPart = it.value instanceof gojs.Part;
        let data = isPart ? it.value.data : it.value;
        atNodeDataArr.push(data);

      }
    }
    let count =0;
    if(this.warningTimeout != null){
      clearTimeout(this.warningTimeout);
    }
    this.loop(atNodeDataArr,count);

  };
  loop(nodeDataArr,count){
    let _this = this;
    let diagram = this.diagram;
    count ++;
    this.warningTimeout = setTimeout(function() {
      diagram.model.startTransaction("flash");
      for(let i = 0 ;i<nodeDataArr.length;i++){
        if(nodeDataArr[i].strokeColor == "red"){
          nodeDataArr[i].strokeColor = _this.stroke;
          count = count == 6 ? count =5:count
        }else {
          nodeDataArr[i].strokeColor = "red";
        }
        diagram.model.updateTargetBindings(nodeDataArr[i]);
      }
      diagram.model.commitTransaction("flash");
      if(count <6){
        _this.loop(nodeDataArr,count);
      }
    }, 200);
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
        isEnabled: false, // disabled by the checkbox
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
          textColor: this.textColor,
          strokeColor: this.stroke,
          text: "请从右侧拖拽对象进行关联"
        }, // initial properties shared by all nodes
        insertPart: function (bounds) { // override DragCreatingTool.insertPart
          // use a different color each time
          // call the base method to do normal behavior and return its result
          this.diagram.toolManager.clickCreatingTool.isEnabled= false;
          return DragCreatingTool.prototype.insertPart.call(this, bounds, backgroundpic);
        }
      }));


    // create polygon drawing tool for this.diagram, defined in PolygonDrawingTool.js
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
    let _this = this;
    this.diagram.toolManager.clickCreatingTool.doStop = function(){
      _this.diagram.toolManager.clickCreatingTool.isEnabled= false;
      let dragCreatingTool = _this.diagram.toolManager.findTool("DragCreating");
      dragCreatingTool.isEnabled = false;
    };

    this.diagram.commandHandler.pasteSelection = function(){
      let selections = this.diagram.selection.toArray();
      if(selections.length <= 0 ) return;
      _this.diagram.model.startTransaction("flash");
      let selectedParts = [];
      for (let i = 0; i < selections.length; i++) {
        var data = _this.diagram.model.copyNodeData(selections[i].data);
        data.pri_code = "";
        data.text = "请从右侧拖拽对象进行关联";
        if(data.category == "cameraTemplate"){
          data.cameraColor = _this.cameraColor;
        }else{
          data.textColor = _this.textColor;
        }
        let poc = new gojs.Point.parse(data.pos);
        poc.x  = poc.x+30;
        poc.y  = poc.y+20;
        data.pos = poc.x + " " + poc.y;
        _this.diagram.model.addNodeData(data);
        let part = _this.diagram.findPartForData(data);

        if (part !== null && _this.diagram.allowSelect) {
          selectedParts.push(part);
        }
      }
      _this.diagram.selectCollection(selectedParts);  // raises ChangingSelection/Finished
      _this.diagram.model.commitTransaction("flash");

      // gojs.CommandHandler.prototype.pasteSelection.call(this,poc);
    };
    this.diagram.nodeTemplateMap.add("simpleTemplate", this.simpleTemplate);
    this.diagram.nodeTemplateMap.add("polygonTemplate", this.polygonTemplate);
    this.diagram.nodeTemplateMap.add("cameraTemplate", this.cameraTemplate);
    this.diagram.nodeTemplateMap.add("textTipsTemplate", this.textTipsTemplate);
    this.diagram.nodeTemplateMap.add("prisonerTemplate", this.prisonerTemplate);

    this.background_picture.source = "";
    // this.background_picture.width = this.width;
    // this.background_picture.height = this.height;

    this.diagram.mouseOver=function (e) {
      if (_this.select) {
        _this.diagram.currentCursor = "pointer";
      }
    };

  };
  randomLoop(partVal,newdata) {
    let _this = this;
    setTimeout(function() {
      _this.randomMovement(partVal,newdata);
      _this.randomLoop(partVal,newdata);
      }, 1000);
  };
  addPrisonerIcon(priCode){
    // { key: "Alonzo", src: "50x40", loc: new go.Point(220, 130), color: 2 },
    let partVal = this.getNodeDataByPricode(priCode);
    if(partVal != null){

      var model = this.diagram.model;
      model.startTransaction("update locations");
      let newdata = { category:"prisonerTemplate", key: priCode, loc: partVal.location, color: 2 };
      model.addNodeData(newdata);
      model.commitTransaction("update locations");

      this.randomLoop(partVal,newdata);
    }
  };
  getNodeDataByPricode(pricode) {
    let it = this.diagram.findNodesByExample({"pri_code": pricode});
    for (let i = 0; i < it.count; i++) {
      it.next();
      var isPart = it.value instanceof gojs.Part;
      if(isPart){
        var data =  it.value.data ;
        if(data.pri_code == pricode){
          return it.value;
        }
      }
    }
    return null;
  };
  randomMovement(partVal,newdata) {
    var model = this.diagram.model;
    model.startTransaction("update locations");

    var pt = newdata.loc;
    var x = pt.x + 20 * Math.random() - 10;
    var y = pt.y + 20 * Math.random() - 10;
    // make sure the kittens stay inside the house
    var b = partVal.actualBounds;
    if (x < b.x || x > b.right) x = pt.x;
    if (y < b.y || y > b.bottom) y = pt.y;
    model.setDataProperty(newdata, "loc", new gojs.Point(x, y));

    model.commitTransaction("update locations");
  };


};
