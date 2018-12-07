import camera from './camera';
import { gojs, DragCreatingTool } from './dragCreatingTool';

export default class Action {
    //构造函数
    constructor(canvasId, width, height, clickCallback, mouseoverCallback, mouseupCallback) {
        this.width = width;
        this.height = height;

        this.$ = gojs.GraphObject.make;
        this.shape = new gojs.Shape();
        //这是为绘制矩形和椭圆而做的，具体参考https://gojs.net/latest/extensions/DragCreating.html
        this.nodeTemplate = this.$(gojs.Node, "Auto", {
                movable: false, //禁止移动
                resizable: true, //可以调整大小
                minSize: new gojs.Size(0, 0),
                selectionObjectName: "BODY"
            },
            new gojs.Binding("desiredSize", "size", gojs.Size.parse).makeTwoWay(gojs.Size.stringify),
            new gojs.Binding("position", "pos", gojs.Point.parse).makeTwoWay(gojs.Point.stringify),
            this.shape,
            this.$(gojs.TextBlock, { margin: 2 }, new gojs.Binding("text", "text")), {
                mouseEnter: function(e, obj, prev) {
                    mouseoverCallback && mouseoverCallback(e, obj, prev);
                }
            }
        );

        this.diagram = this.$(gojs.Diagram, canvasId, {
            //以下三行防止出现动态滚动条
            autoScrollRegion: 0,
            hasVerticalScrollbar: false,
            hasHorizontalScrollbar: false,
            //启用撤销重做快捷键
            "undoManager.isEnabled": true,
            //禁止动画效果
            "animationManager.isEnabled": false,
            //鼠标滚轮事件禁止
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone,
            nodeTemplate: this.nodeTemplate,
        });

        //监听选中的图形的移动事件
        this.diagram.addDiagramListener("SelectionMoved",
            function(e) {
                let it = e.subject.iterator;
                it.next();
                let isPart = it.value instanceof gojs.Part;
                let part = isPart ? it.value : it;
                console.log(part);
                let data = isPart ? part.data : part.value;
                console.log(data);
                let position = part.position;
                let x = position.x;
                let y = position.y;
                part.position.x = 100;
                part.position.y = 100;
                console.log(data);

                //限制摄像头的移动范围
                let RangelimitForCamera = function() {

                }

                //限制图形的移动范围
                let RangelimitForRect = function(part) {
                    let partHeight = part.height;
                    let partWidth = part.width;
                    let diagramSize = part.diagram.viewportBounds.size;
                    let diagramHeight = diagramSize.height;
                    let diagramWidth = diagramSize.width;

                    let limitHeight = diagramHeight - partHeight - 2;
                    let limitWidth = diagramWidth - partWidth - 2;
                    let newPosition = position;
                    if (x < 0) {
                        newPosition.x = 0;
                    }

                    if (y < 0) {
                        newPosition.y = 0;
                    }

                    if (x > limitWidth) {
                        newPosition.x = limitWidth;
                    }

                    if (y > limitHeight) {
                        newPosition.y = limitHeight;
                    }

                    part.diagram.model.setDataProperty(data, 'pos', Object.values(newPosition).join(" "));
                }

                //RangelimitForRect(part);
            }
        );

        //底图
        this.background_picture = new gojs.Picture();

        //绑定底图
        this.background = this.$(gojs.Part, // 这个part没有绑定任何model数据
            {
                layerName: "Background",
                position: new gojs.Point(0, 0),
                selectable: false,
                pickable: false
            },
            this.background_picture
        );

        this.diagram.add(this.background);
        this.init();
    };

    //添加摄像头
    addCamera(rectuuid) {
        this.diagram.add(new camera(rectuuid));
    }

    //设置线条颜色
    setShape(stroke, figure, fill) {
        this.shape.stroke = stroke || this.shape.stroke;
        this.shape.fill = fill || "#FFFFFF";
        this.shape.figure = figure || this.shape.figure;
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


    init() {
        this.shape.stroke = "#00BFF3"; //线颜色
        this.shape.fill = "#FFFFFF"; //填充颜色

        this.background_picture.source = "";
        this.background_picture.width = this.width;
        this.background_picture.height = this.height;

        let background_picture = this.background_picture;

        //初始化绘制矩形和椭圆的工作
        this.diagram.toolManager.mouseMoveTools.insertAt(2,
            this.$(DragCreatingTool, {
                isEnabled: true,
                delay: 0,
                box: this.$(gojs.Part, {
                        layerName: "Tool"
                    },
                    this.$(gojs.Shape, {
                        name: "SHAPE",
                        fill: null,
                        stroke: "cyan",
                        strokeWidth: 2
                    })
                ),
                archetypeNodeData: {
                    text: "请从右侧拖拽对象进行关联"
                },
                //这里可以做一些有意思的操作
                insertPart: function(bounds) {
                    return DragCreatingTool.prototype.insertPart.call(this, bounds, background_picture);
                }
            })
        );
    }
};