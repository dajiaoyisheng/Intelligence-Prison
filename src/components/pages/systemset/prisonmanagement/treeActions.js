//树节点操作，树组件位置src\components\commons\tree.vue，如想修改请参考http://element-cn.eleme.io/#/zh-CN/component/tree
export default {
    methods: {
        //拖拽节点开始
        handleDragStart(node, ev) {
            this.startDragNode = true;
        },
        //拖拽节点结束
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            //拖拽的对象
            this.draggingNode = draggingNode;
        },
        //点击左侧树节点
        handleNodeClick(data, checkedNode, indeterminate) {
            this.PrisonareaObjtree = [data];
            this.selectedTreeObj = checkedNode;
        },
        //点击右侧树节点
        handleObjectNodeClick(data, checkedNode, indeterminate) {
            this.objectInfo = data;
        },
        //添加左侧树节点
        addTreeNode() {
            let _this = this;
            if (this.selectedTreeObj == null) {
                this.$alert("请先选择树节点", {
                    confirmButtonText: "确定",
                    showClose: false
                });
                return false;
            }

            let type = this.selectedTreeObj.data.nodeType;
            if (type != "02" && type != "03" && type != "04") {
                this.$alert("当前节点不能添加子节点", {
                    confirmButtonText: "确定",
                    showClose: false
                });
                return false;
            }

            this.$prompt("请输入节点名称", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /\S+/,
                    inputErrorMessage: "输入格式不正确"
                })
                .then(({ value }) => {
                    // 调用添加接口
                    let data = {
                        id: "0030",
                        label: value,
                        icon: "el-icon-message",
                        isWarning: false,
                        type: "area",
                        pri_code: "0030",
                        name: value,
                        position: value
                    };
                    _this.$refs.leftTree.append(data, _this.selectedTreeObj);
                    _this.selectedTreeObj = null;
                })
                .catch(() => {
                    //取消输入
                    this.$message({
                        type: "info",
                        message: "您已取消添加节点"
                    });
                    _this.selectedTreeObj = null;
                });
        },
        //编辑左侧树节点
        editTreeNode() {
            let _this = this;
            if (this.selectedTreeObj == null) {
                this.$alert("请先选择树节点", {
                    confirmButtonText: "确定",
                    showClose: false
                });
                return false;
            }

            let data = _this.selectedTreeObj.data;

            this.$prompt(data.label, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /\S+/,
                    inputErrorMessage: "输入格式不正确"
                })
                .then(({ value }) => {
                    // 调用编辑接口
                    data.label = value;
                    data.name = value;
                    data.position = value;

                    let key = _this.$refs.leftTree.getCurrentKey();
                    _this.$refs.leftTree.updateKeyChildren(key, data);
                    _this.selectedTreeObj = null;
                })
                .catch(() => {
                    //取消输入
                    this.$message({
                        type: "info",
                        message: "您已取消修改节点"
                    });
                    _this.selectedTreeObj = null;
                });
        },
        //删除左侧树节点
        delTreeNode() {
            let _this = this;
            if (this.selectedTreeObj == null) {
                this.$alert("请先选择树节点", {
                    confirmButtonText: "确定",
                    showClose: false
                });
                return false;
            }

            this.$confirm("您确定要删除这个节点吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    //掉删除接口
                    _this.$refs.leftTree.remove(_this.selectedTreeObj);
                    _this.selectedTreeObj = null;
                    _this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                })
                .catch(() => {
                    _this.selectedTreeObj = null;
                    _this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        //设置树节点中relationed字段，给树添加选中状态
        setNodeRelationed(nodes, pri_code, uuid) {
            let _this = this;
            for (let i = 0; i < nodes.length; i++) {
                let element = nodes[i];
                if (element.pri_code == pri_code) {
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
    }
}