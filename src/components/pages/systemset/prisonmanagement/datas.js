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
            maxexpandId: 95,
            //这里是图标
            images: {
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
            },
            textColor: "#409EFF",
            borderColor: "#409EFF",
            drawObj: null,
            lineWidth: 1,
            strokeStyle: "#ff0000",
            shapeType: "rect",
            fileList: [], //
            isDrawCamera: false,
            backgroundImage: null,
            Prisonareatree: [], //监区树对象
            PrisonareaObjtree: [], //监区树对象
            selectedTreeObj: null, //要编辑的左侧树节点
            objectInfo: {}, //选中的父对象
            message: "监区管理",
            cameraImg: new Image(),
            startDragNode: false, //是否拖动节点
            draggingNode: null, //被拖动的节点
            mouseOveredGraph: null, //鼠标移动到的图形
            mouseClickedGraph: null, //鼠标点击的图形
            relationships: {}, //存储对象和图形的关系
            currUUID: null //当前选中图形的uuid
        };
    },
}