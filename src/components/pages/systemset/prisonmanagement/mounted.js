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
        this.removeRelationed = function(pricode){
            if(pricode == "" || pricode == null) return;
            _this.removeNodeRelationed(_this.PrisonareaObjtree, pricode);
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
        this.drawObj = new Draw(_this,
            "canvas",
            canvasContainerRect.width,
            canvasContainerRect.height,false,
            function(e, obj, prev) {
                //单击图形后的操作
                let priCode = obj.data.pri_code;
                if(priCode && priCode != ""){
                  let node = { "id" : priCode, "nodeType" : obj.data.nodeType };
                  _this.handleObjectNodeClick(node);
                  _this.$refs.rightTree.setCurrentKey(priCode);
                }

                _this.currUUID = obj.data.__gohashid;
                _this.mouseClickedGraph = this;
            },
            function(e, obj, prev) {
                //鼠标移动到图形上的操作
                _this.drawObj.diagram.currentCursor = "pointer";
                //如果是监区对象拖拽的情况下设置图形和对象的关系
                if (_this.startDragNode) {
                  _this.handleObjectNodeClick(_this.draggingNode.data);
                  let uuid = obj.data.__gohashid;
                  let nodeData = obj.data;
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
                          if(isEdit || nodeData.pri_code != null){
                            let content = "该图形已关联其他对象，是否覆盖?";
                            if(isEdit){
                              content = "其他图形已关联该对象，是否替代?";
                            }
                            _this.$confirm(
                              content,
                              "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                //删除 关联该区域节点的其他图形
                                _this.removeRelationed(nodeData.pri_code);
                                _this.drawObj.removeData(pri_code,nodeData.category);
                                //增加新的
                                nodeData.pri_code = pri_code;
                                nodeData.text = "";
                                nodeData.angle =obj.angle;
                                nodeData.strokeColor = "#00BFF3";
                                nodeData.nodeType = treeType;
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
                              nodeData.nodeType = treeType;
                              _this.addConnect(nodeData);
                              _this.setRelationed(pri_code);
                          }


                      }
                  } else if (nodeData.category === "cameraTemplate") {//摄像头关联

                      if (treeType == "05") {
                        _this.drawObj.diagram.toolManager.clickCreatingTool.isEnabled = false;
                          if(nodeData.pri_code == pri_code) return ;

                          let isEdit = _this.drawObj.isEditData(pri_code);

                          if(isEdit || nodeData.pri_code != null){
                            let content = "该图形已关联其他摄像头，是否覆盖?";
                            if(isEdit){
                                content = "其他图形已关联该摄像头，是否替代?";
                            }
                            _this.$confirm(
                              content,
                              "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                  //删除旧的
                                  _this.drawObj.removeData(pri_code,nodeData.category);
                                  _this.removeRelationed(nodeData.pri_code);
                                  //增加新的
                                  nodeData.pri_code = pri_code;
                                  nodeData.cameraName = pri_name;
                                  nodeData.text = "";
                                  nodeData.cameraColor = "#00BFF3";
                                  nodeData.nodeType = treeType;
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
                              nodeData.nodeType = treeType;
                              _this.addConnect(nodeData);
                              _this.setRelationed(pri_code);
                          }
                        _this.drawObj.diagram.toolManager.clickCreatingTool.isEnabled = true;
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
