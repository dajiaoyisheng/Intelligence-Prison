import Draw from "@/draw/action";
export default {
    mounted() {
        let _this = this;
        let canvasContainerRect = this.$refs.canvasContainer.getBoundingClientRect();

        this.$refs.canvas.style.width = canvasContainerRect.width + "px";
        this.$refs.canvas.style.height = canvasContainerRect.height + "px";
        this.setRelationed = function(pricode){
            _this.setNodeRelationed(_this.PrisonareaObjtree, pricode, _this.currUUID);
            _this.PrisonareaObjtree = JSON.parse(
              JSON.stringify(_this.PrisonareaObjtree)
            );
        };
        this.setCurrNodeKey = function(pricode){
            _this.setNodeRelationed(_this.PrisonareaObjtree, pricode, _this.currUUID);
            _this.PrisonareaObjtree = JSON.parse(
              JSON.stringify(_this.PrisonareaObjtree)
            );
        };
        this.drawObj = new Draw(
            "canvas",
            canvasContainerRect.width,
            canvasContainerRect.height,
            function(e, obj, prev) {
                //单击图形后的操作
                let priCode = obj.data.pri_code;
                if(priCode && priCode != null){
                  // _this.currentNodeKey=priCode;
                  // _this.handleNodeClick(_this.selectedTreeObj);
                }
                _this.currUUID = obj.data.__gohashid;
                _this.mouseClickedGraph = this;
            },
            function(e, obj, prev) {
                //鼠标移动到图形上的操作
                _this.drawObj.diagram.currentCursor = "pointer";
                //如果是监区对象拖拽的情况下设置图形和对象的关系
                if (_this.startDragNode) {
                  let uuid = obj.data.__gohashid;
                  let nodeData = obj.data;
                  console.log(nodeData);
                  console.log(nodeData);
                  _this.startDragNode = false;
                  _this.mouseOveredGraph = this;
                  let treeType = _this.draggingNode.data.nodeType;
                  let pri_name = _this.draggingNode.data.label;
                  let pri_code = _this.draggingNode.data.id;

                  if (nodeData.category === "simpleTemplate" || nodeData.category == "polygonTemplate") {//区域关联
                      if (treeType != "05") {
                          //避免重复关联
                          if(nodeData.pri_code == pri_code) return ;

                          let isEdit = _this.drawObj.isEditData(pri_code);
                          if(isEdit){
                            _this.$confirm(
                              "已关联，是否覆盖?",
                              "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                //删除旧的
                                _this.drawObj.removeData(pri_code,nodeData.category);
                                //增加新的
                                nodeData.pri_code = pri_code;
                                nodeData.text = "";
                                nodeData.angle =obj.angle;
                                nodeData.strokeColor = "#00BFF3";
                                _this.drawObj.updateData(nodeData);

                                _this.setRelationed(pri_code);
                                _this.$message({
                                  type: "success",
                                  message: "关联成功!"
                                });
                            }).catch(() => {
                              _this.$message({
                                type: "info",
                                message: "已取消操作"
                              });
                            });
                          }else{
                              nodeData.pri_code = pri_code;
                              nodeData.text = "";
                              nodeData.angle =obj.angle;
                              nodeData.strokeColor = "#00BFF3";
                              _this.addConnect(nodeData);
                              _this.setRelationed(pri_code);
                          }


                      }
                  } else if (nodeData.category === "cameraTemplate") {//摄像头关联
                      if (treeType == "05") {
                          if(nodeData.pri_code == pri_code) return ;

                          let isEdit = _this.drawObj.isEditData(pri_code);
                          if(isEdit){
                            _this.$confirm(
                              "已关联，是否覆盖?",
                              "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                  //删除旧的
                                  _this.drawObj.removeData(pri_code,nodeData.category);
                                  //增加新的
                                  nodeData.pri_code = pri_code;
                                  nodeData.cameraName = pri_name;
                                  nodeData.text = "";
                                  nodeData.cameraColor = "#00BFF3";
                                  nodeData.angle =obj.angle;
                                  _this.drawObj.updateData(nodeData);
                                  _this.setRelationed(pri_code);
                                  _this.$message({
                                    type: "success",
                                    message: "关联成功!"
                                  });
                            }).catch(() => {
                              _this.$message({
                                type: "info",
                                message: "已取消操作"
                              });
                            });

                          }else{
                              nodeData.pri_code = pri_code;
                              nodeData.cameraName = pri_name;
                              nodeData.text = "";
                              nodeData.angle =obj.angle;
                              nodeData.cameraColor = "#00BFF3";
                              _this.addConnect(nodeData);
                              _this.setRelationed(pri_code);
                          }
                      }
                  }
                  // else if (nodeData.category == "textTipsTemplate") {//标签
                  //     //存储nodeData
                  // }
                }
            }
        );
    }
}
