<template>
    <div id="prisonItemInfo">
        <el-form :label-position="labelPosition" label-width="122px" :model="form" :rules="rules" ref="form" class="demo-form">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="节点名称" prop="nodeName">
                        <el-input style="width: 220px;" v-model="form.nodeName" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="节点类型" prop="nodeType">
                        <el-select v-model="form.nodeType">
                            <el-option v-for="item in nodeTypes" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="节点状态" prop="nodeState">
                        <el-select v-model="form.nodeState">
                            <el-option v-for="item in states" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.nodeType == '02'">
                    <el-form-item label="监狱名称" prop="priName">
                        <el-input style="width: 220px;" v-model="form.priName" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.nodeType == '04'">
                    <el-form-item label="区域类型" prop="areaType">
                        <el-select v-model="form.areaType">
                            <el-option v-for="item in areaTypes" :key="item.sCode" :label="item.sName" :value="item.sCode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9" :offset="15">
                    <el-form-item>
                        <el-button size="small" @click="submitForm('form')" type="primary">保存</el-button>
                        <el-button size="small" @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
      return {
          isAddNode: true,          // 是否新增节点
          labelPosition: "right",   // 标题显示位置
          states: [],               // 使用状态字典
          areaTypes: [],            // 区域类型字典
          nodeTypes: [],            // 节点类型字典
          parentNode: {},           // 选中节点对象
          arealList: [],            // 下级所有区域
          form: {                   // 表单数据模型
            nodeId: "",             // 树形节点编号
            nodeName: "",           // 树形节点名称
            orgNodeName: "",        // 原节点名称
            nodeState: "",          // 节点使用状态
            areaType: "",           // 区域类型信息
            nodeType: "",           // 节点类型信息
            priName: "",            // 所属监狱名称
            areas: []               // 相邻区域集合
          },
          rules: {                  // 校验规则列表
            nodeName: [{ required: true, message: '请输入节点名称', trigger: 'change' }],
            nodeState: [{ required: true, message: '请选择节点状态', trigger: 'blur' }],
            nodeType: [{ required: true, message: '请选择节点类型', trigger: 'blur' }]
        }
      }
    },
    methods: {
        /** 新增初始化数据 */
        initAddDatas: function(checkedNode) {
            this.isAddNode = true;
            this.parentNode = checkedNode;

            this.getState();
            this.getAreaType();
            this.setNodeDatas();
        },
        /** 编辑初始化数据 */
        initModifyDatas: function(checkedNode) {
            this.isAddNode = false;
            this.parentNode = checkedNode;

            this.getState();
            this.getAreaType();
            this.setNodeDatas();
            this.getTreeNodeInfo();
        },
        /** 获取使用状态字典 */
        getState: function() {
            this.$get(this.urlconfig.pmGetState).then((res) => {
                if (res.status === 0) {
                    this.states = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 获取区域类型字典 */
        getAreaType: function() {
            this.$get(this.urlconfig.pmGetAreaTypes).then((res) => {
                if (res.status === 0) {
                    this.areaTypes = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 设置节点类型字典 */
        setNodeDatas: function() {
            // 如果是新增，选中节点为父级
            let nodeType = this.parentNode.nodeType;
            if (this.isAddNode === true) {
                if (nodeType == "01") { // 根节点
                    this.nodeTypes = [];
                    this.nodeTypes.push({ "sCode" : "02", "sName" : "监区" });
                } else if (nodeType == "02") { // 监区节点
                    this.nodeTypes = [];
                    this.nodeTypes.push({ "sCode" : "03", "sName" : "片区" });
                } else if (nodeType == "03") { // 片区节点
                    this.nodeTypes = [];
                    this.nodeTypes.push({ "sCode" : "03", "sName" : "片区" });
                    this.nodeTypes.push({ "sCode" : "04", "sName" : "区域" });
                }
            }
            // 如果是编辑，选中节点为当前节点
            else {
                if (nodeType == "02") { // 监区节点
                    this.nodeTypes = [];
                    this.nodeTypes.push({ "sCode" : "02", "sName" : "监区" });
                } else if (nodeType == "03") {  // 片区节点
                    this.nodeTypes = [];
                    this.nodeTypes.push({ "sCode" : "03", "sName" : "片区" });
                } else if (nodeType == "04") {  // 区域节点
                    this.nodeTypes = [];
                    this.nodeTypes.push({ "sCode" : "04", "sName" : "区域" });
                }
            }
            
            if (this.nodeTypes.length > 0) {
                this.form.nodeType = this.nodeTypes[0].sCode;
            }
            this.getAreasByParent();
        },
        /** 获取下级区域字典 */
        getAreasByParent: function() {
            let data = { "isAddNode" : this.isAddNode, "id" : this.parentNode.id, "nodeType" : this.parentNode.nodeType };
            this.$post(this.urlconfig.pmGetAreasByParent, data).then((res) => {
                if (res.status === 0) {
                    this.arealList = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 修改前查询指定节点 */
        getTreeNodeInfo: function() {
            let data = {"id" : this.parentNode.id, "nodeType" : this.parentNode.nodeType};
            this.$post(this.urlconfig.pmGetTreeNodeInfo, data).then((res) => {
                if (res.status === 0) {
                    this.form = res.data;
                }
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                // todo somthing...
            });
        },
        /** 保存作息表单 */
        submitForm: function(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = { 
                        "isAddNode": this.isAddNode,
                        "pNodeId" : this.parentNode.id,
                        "pNodeType": this.parentNode.nodeType,
                        "beanItem": JSON.stringify(this.form) 
                    };

                    this.$post(this.urlconfig.pmSaveTreeNode, data).then((res) => {
                        if (res.status === 0) {
                            this.$message.success(res.statusinfo);
                            this.saveNodeCallBack(this.isAddNode, res.data, this.parentNode);
                        }
                    }).catch((error) => {
                        console.log(error);
                    }).then(() => {
                        // todo something...
                    });
                } else {
                    console.log("保存树形节点失败");
                    return false;
                }
            });
        },
        /** 重置作息表单 */
        resetForm: function(formName) {
            this.$refs[formName].resetFields();
        }
    },
    props: [ 'saveNodeCallBack' ]
}
</script>

<style scoped>

</style>