import Draw from "@/draw/action";
export default {
    mounted() {
        let _this = this;
        let canvasContainerRect = this.$refs.canvasContainer.getBoundingClientRect();

        this.$refs.canvas.style.width = canvasContainerRect.width + "px";
        this.$refs.canvas.style.height = canvasContainerRect.height + "px";
        this.drawObj = new Draw(
            "canvas",
            canvasContainerRect.width,
            canvasContainerRect.height,
            function(e, obj, prev) {
                //单击图形后的操作
                _this.currUUID = obj.data.__gohashid;
                _this.mouseClickedGraph = this;
            },
            function(e, obj, prev) {
                //鼠标移动到图形上的操作
                //如果是监区对象拖拽的情况下设置图形和对象的关系
                if (_this.startDragNode) {
                    let uuid = obj.data.__gohashid;
                    _this.startDragNode = false;
                    _this.mouseOveredGraph = this;
                    let treeType = _this.draggingNode.data.nodeType;
                    let pri_name = _this.draggingNode.data.label;
                    let pri_code = _this.draggingNode.data.id;

                    //添加区域
                    if (_this.relationships[uuid] == undefined) {
                        //如果是拖拽的摄像头，则提示并返回false
                        if (treeType == "05") {
                            _this.$message({
                                type: "info",
                                message: "请先添加区域"
                            });
                            return false;
                        }
                        //添加图形和对象的对应关系
                        _this.relationships[uuid] = {
                            area: _this.draggingNode,
                            cameras: {}
                        };
                        //更新图形上的文字
                        _this.drawObj.updatePropertieByHashid(uuid, 'text', pri_name);

                        _this.$message({
                            type: "success",
                            message: "关联成功!"
                        });
                    } else {
                        //如果是添加摄像头
                        if (treeType == "05") {
                            _this.relationships[uuid]["cameras"][pri_code] = _this.draggingNode;
                            let addedCameras = Object.keys(
                                _this.relationships[uuid]["cameras"]
                            );
                            //添加摄像头图标
                            _this.drawObj.addCamera(uuid);
                        } else {
                            //如果是添加监区或区域
                            _this
                                .$confirm(
                                    "当前区域已经和图形关联，当前操作会替换已有关联关系，并删除已关联的摄像头，是否继续?",
                                    "提示", {
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        type: "warning"
                                    }
                                )
                                .then(() => {
                                    let pre_pri_code =
                                        _this.relationships[uuid]["area"]["data"]["pri_code"];
                                    _this.deleteNodeRelationed(
                                        _this.PrisonareaObjtree,
                                        pre_pri_code
                                    );
                                    _this.PrisonareaObjtree = JSON.parse(
                                        JSON.stringify(_this.PrisonareaObjtree)
                                    );

                                    _this.relationships[uuid] = {
                                        area: _this.draggingNode,
                                        cameras: {}
                                    };

                                    _this.$message({
                                        type: "success",
                                        message: "关联成功!"
                                    });
                                })
                                .catch(() => {
                                    _this.$message({
                                        type: "info",
                                        message: "已取消操作"
                                    });
                                });
                        }
                    }
                    //设置树节点数据，更新颜色以及重绘
                    _this.setNodeRelationed(_this.PrisonareaObjtree, pri_code, uuid);
                    _this.PrisonareaObjtree = JSON.parse(
                        JSON.stringify(_this.PrisonareaObjtree)
                    );
                }
            }
        );
    }
}