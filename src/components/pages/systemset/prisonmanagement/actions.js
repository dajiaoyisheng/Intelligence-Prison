export default {
    methods: {
        /** 加载左侧监狱树形 */
        loadTree: function() {
          let _this = this;
            this.$get(this.urlconfig.pmLoadTree).then(res => {
                if (res.status === 0) {
                    this.Prisonareatree = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
              setTimeout(function(){
                  _this.handleNodeClick(_this.Prisonareatree[0].children[0]);
              },500);

                // todo something...
            });
        },
        /** 点击左侧监狱树形节点 */
        handleNodeClick: function(checkedNode) {
            // this.createDraw();
            // this.getMapConfigData(checkedNode.id);
            this.selectedTreeObj = checkedNode;
            this.$refs.leftTree.setCurrentKey(checkedNode.id);

          let data = { "id": checkedNode.id, "nodeType": checkedNode.nodeType };
          //显示摄像头
          if(checkedNode.nodeType == "03" && checkedNode.children && checkedNode.children[0].nodeType == "04" ){
            this.showCameraBtn = true;
          }else{
            this.showCameraBtn = false;
          }
            // 加载右侧下级树形
            this.$post(this.urlconfig.pmGetChildrenLevelOne, data).then((res) => {
                if (res.status === 0) {
                    this.PrisonareaObjtree = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
              // mounted.mounted();

                // todo somthing...

            });

            // 查询左侧树形节点信息
            this.$post(this.urlconfig.pmGetTreeNodeInfo, data).then((res) => {
                if (res.status === 0) {
                    this.objectInfoLeft = res.data;
                    this.refreshMap(res,checkedNode);

                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 点击右侧下级树形节点 */
        handleObjectNodeClick: function(checkedNode) {
            this.selectPart(checkedNode);
            let data = { "id" : checkedNode.id, "nodeType" : checkedNode.nodeType };
            this.$post(this.urlconfig.pmGetTreeNodeInfo, data).then((res) => {
                if (res.status === 0) {
                    this.objectInfo = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 新增左侧监狱树形节点 */
        addTreeNode: function() {
            if (this.selectedTreeObj == null) {
                this.$alert("请先选择树节点", { confirmButtonText: "确定", showClose: false });
                return false;
            }

            // 只有根节点、监区、片区可以增加子节点
            let type = this.selectedTreeObj.nodeType;
            if ((type != "01") && (type != "02") && (type != "03")) {
                this.$alert("当前节点不能添加子节点", { confirmButtonText: "确定", showClose: false });
                return false;
            }

            this.showDialog = true;
            this.dialogTitle = "新增节点";
            this.$nextTick(() => {
                this.$refs.prisonItemInfo.initAddDatas(this.selectedTreeObj);
            });
        },
        /** 编辑左侧树形节点 */
        editTreeNode: function() {
            if (this.selectedTreeObj == null) {
                this.$alert("请先选择树节点", { confirmButtonText: "确定", showClose: false });
                return false;
            }
            if (this.selectedTreeObj.nodeType === "01") {
                this.$alert("根节点不允许编辑", { confirmButtonText: "确定", showClose: false });
                return false;
            }

            this.showDialog = true;
            this.dialogTitle = "编辑节点";
            this.$nextTick(() => {
                this.$refs.prisonItemInfo.initModifyDatas(this.selectedTreeObj);
            });
        },
        /** 删除左侧树形节点 */
        delTreeNode: function() {
            if (this.selectedTreeObj == null) {
                this.$alert("请先选择树节点", { confirmButtonText: "确定", showClose: false });
                return false;
            }
            if (this.selectedTreeObj.nodeType === "01") {
                this.$alert("根节点不允许删除", { confirmButtonText: "确定", showClose: false });
                return false;
            }

            this.$confirm("您确定要删除这个节点吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let data = {"id" : this.selectedTreeObj.id, "nodeType" : this.selectedTreeObj.nodeType};
                this.$post(this.urlconfig.pmDeleteTreeNode, data).then((res) => {
                    if (res.status === 0) {
                        this.$message({ type: "success", message: "删除成功!" });
                        this.$refs.leftTree.remove(this.selectedTreeObj);

                        // 初始化数据
                        this.selectedTreeObj = null;
                        this.objectInfoLeft = {};
                        this.PrisonareaObjtree = [];
                        this.objectInfo = {};
                    }
                }).catch((error) => {
                    console.log(error);
                }).then(() => {
                    // todo somthing...
                });
            }).catch(() => {
                this.$message({ type: "info", message: "已取消删除操作" });
            });
        },
        /** 关闭弹框之前操作 */
        beforeClose: function(done) {
            done();
            this.showDialog = false;
            this.$refs.prisonItemInfo.resetForm('form');
        },
        /** 保存节点后回调函数 */
        saveNodeCallBack: function(isAddNode, newNode, parentNode) {
            this.showDialog = false;
            this.$refs.prisonItemInfo.resetForm('form');

            if (isAddNode == true) {
                this.$refs.leftTree.append(newNode, parentNode);
            } else {
                let curNode = this.$refs.leftTree.getCurrentNode();
                curNode.label = newNode.label;
            }
        },

        //拖拽节点开始
        handleDragStart(node, ev) {
            this.startDragNode = true;
        },
        //拖拽节点结束
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            //拖拽的对象
            this.draggingNode = draggingNode;
        },
        //设置树节点中relationed字段，给树添加选中状态
        setNodeRelationed(nodes, pri_code, uuid) {
            let _this = this;
            for (let i = 0; i < nodes.length; i++) {
                let element = nodes[i];
                if (element.id == pri_code) {
                    element["relationed"] = "relationed";
                    if (uuid != undefined) {
                        element["shapeUuid"] = uuid;
                    }
                }
                if (element.children) {
                    _this.setNodeRelationed(element.children, pri_code, uuid);
                }
            }
        },
        //删除树节点中relationed字段
        removeNodeRelationed(nodes, pri_code) {
            let _this = this;
            for (let i = 0; i < nodes.length; i++) {
                let element = nodes[i];
                if (element.id == pri_code) {
                    element["relationed"] = undefined;
                    element["shapeUuid"] = undefined;
                    // if (uuid != undefined) {
                    //     element["shapeUuid"] = uuid;
                    // }
                }
                if (element.children) {
                    _this.removeNodeRelationed(element.children, pri_code);
                }
            }
        },
        //递归删除树节点中的relationed字段，树节点样式会更改
        deleteNodeRelationed(nodes, pri_code) {
            let _this = this;
            for (let i = 0; i < nodes.length; i++) {
                let element = nodes[i];
                if (element.pri_code == pri_code) {
                    delete element["relationed"];
                }
                if (element.children) {
                    _this.deleteNodeRelationed(element.children, pri_code);
                }
            }
        },
      saveMapConfig:function(item){
        this.$confirm('是否保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {"beanItem": JSON.stringify(item)};
            this.$post(this.urlconfig.pmSaveMapConfigData, data).then((res) => {
              if (res.status === 0) {
                this.$message.success(res.statusinfo);
              }
            }).catch((error) => {
              console.log(error);
            }).then(() => {
              // todo somthing...
            });
        }).catch((error) => {
          console.log(error);
        });

      },
      getMapConfigData:function(regionId){
        let _this = this;
        let data = { "priCode" : regionId};
        this.$get(this.urlconfig.pmGetMapConfigData,data).then(res => {
          if (res.status === 0) {
            console.log(res.data);
            _this.backgroundImage = res.data.priMap;
            _this.configData = res.data.priConfig;
            _this.relationships = res.data.priMapping;
          }
        }).catch((error) => {
          console.log(error);
        }).then(() => {
          // todo something...
        });
      }

    }
}
