import add from "@/assets/add.png";
import del from "@/assets/del-g.png";
import edit from "@/assets/edit-g.png";
import save from "@/assets/save.png";
import cancel from "@/assets/cancel.png";
import renew from "@/assets/renew.png";
import div from "@/assets/div.png";
import polygon from "@/assets/polygon.png";
import oval from "@/assets/oval.png";
import label from "@/assets/label.png";
import camera from "@/assets/camera.png";
import review from "@/assets/review.png";
import textA from "@/assets/text-a.png";
import colorborder from "@/assets/colorborder.png";
import exportgroup from "@/assets/exportgroup.png";
import importgroup from "@/assets/importgroup.png";

export default {
    data() {
        return {
            showDialog: false,         // 是否弹出新增/编辑树节点窗口
            dialogTitle: "新增节点",    // 新增/编辑树节点窗口标题名称
            Prisonareatree: [],        // 左侧监狱树形对象
            selectedTreeObj: null,     // 左侧选中树形节点
            objectInfoLeft: {},        // 左侧树形节点信息
            PrisonareaObjtree: [],     // 右侧下级树形对象
            objectInfo: {},            // 右侧树形节点信息

            maxexpandId: 95,            // 最大扩展
            textColor: "#409EFF",       // 文本颜色
            borderColor: "#409EFF",     // 边框颜色
            drawObj: null,              // 绘制对象
            lineWidth: 1,               // 线条宽度
            strokeStyle: "#ff0000",     // 样式
            shapeType: "rect",          // 模型类型
            fileList: [],               // 文件列表
            isDrawCamera: false,        // 是否绘制摄像头
            backgroundImage: null,      // 背景图片
            cameraImg: new Image(),     // 创建图片
            startDragNode: false,       // 是否拖动节点
            draggingNode: null,         // 被拖动的节点
            mouseOveredGraph: null,     // 鼠标移动到的图形
            mouseClickedGraph: null,    // 鼠标点击的图形
            relationships: {},          // 存储对象和图形的关系
            currUUID: null,             // 当前选中图形的uuid

            images: {                   // 图标对象集合
                add: add,
                del: del,
                edit: edit,
                save: save,
                cancel: cancel,
                renew: renew,
                div: div,
                polygon: polygon,
                oval: oval,
                label: label,
                camera: camera,
                review: review,
                textA: textA,
                colorborder: colorborder,
                exportgroup: exportgroup,
                importgroup: importgroup
            }
        };
    },
}