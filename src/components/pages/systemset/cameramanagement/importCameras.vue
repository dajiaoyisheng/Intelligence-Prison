<template>
    <div id="importCameras">
        <section class="importSection">
            <el-row>
                <el-col :span="24"><span>只能上传xls/xlsx文件，且不超过1M</span></el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="6"><span class="importMeta">请选择导入文件:</span></el-col>
                <el-col :span="12">
                    <el-upload action="auto" class="upload-demo" multiple :auto-upload="false" :file-list="files" :limit="3" 
                               :on-exceed="handleExceed" :on-change="handleChange" :before-remove="beforeRemove">
                        <el-button size="mini" type="primary" slot="trigger">选择文件</el-button>
                        <el-button size="mini" type="success" @click="handleSubmit">上传到服务器</el-button>
                    </el-upload>
                </el-col>
                <el-col :span="4">
                    <a class="importMeta" :href="downloadtURL" download="">下载模板</a>
                </el-col>
            </el-row>
            <el-row v-if="isShowResult">
                <el-col :span="24">
                    <span>
                        上传{{ files.length }}个文件，成功{{ importResult.successCount }}条，失败{{ importResult.errorCount }}条，点击<a class="importMeta" :href="errorFileURL" download="">“下载”</a>获取失败记录。
                    </span>
                </el-col>
            </el-row>
        </section>
    </div>
</template>

<script>
export default {
    data() {
      return {
            files: [],              // 文件列表
            downloadtURL: "",       // 下载模板地址
            errorFileURL: "",       // 下载失败记录地址
            isShowResult: false,    // 是否显示导入结果
            importResult: {
                errorCount: 0,
                successCount : 0
            }
      }
    },
    methods: {
        /** 初始化请求地址 */
        initDatas: function() {
            this.files = [];
            this.isShowResult = false;
            this.downloadtURL = this.$store.state.env + this.urlconfig.cmDownloadTemplet;
            this.errorFileURL = this.$store.state.env + this.urlconfig.cmDownloadErrorFile;
        },
        /** 文件超出个数限制验证 */
        handleExceed: function(files, fileList) {
            this.$message.warning(`当前限制选择3个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        /** 上传文件列表变更操作 */
        handleChange: function(file, fileList) {
            if (this.files.length > 0) {
                for (let i = 0; i < this.files.length; i++) {
                    let item = this.files[i];

                    if (item.name == file.name) {
                        this.$message.warning("[" + file.name + "]文件不能重复选择！");
                        fileList.splice(fileList.length - 1, 1);
                        return;
                    }
                }
                this.files.push(file);
            } else {
                this.files.push(file);
            }
        },
        /** 删除文件之前操作 */
        beforeRemove: function(file, fileList) {
            for (let i = 0; i < this.files.length; i++) {
                let item = this.files[i];
                if (item.name == file.name) {
                    this.files.splice(i, 1);
                    return;
                }
            }
        },
        /** 提交导入文件 */
        handleSubmit: function() {
            let totalSize = 0, param = new FormData();
            for (let i = 0; i < this.files.length; i++) {
                let file = this.files[i];
                let fileName = file.name;
                let point = fileName.lastIndexOf(".");
                let postfix = fileName.substring(point + 1);
                
                // 验证文件后缀
                if (("xls" != postfix) && ("xlsx" != postfix)) {
                    this.$message.warning("[" + fileName + "]文件类型不匹配！");
                    return;
                } else {
                    totalSize += file.size;
                    param.append('importFile', this.files[i].raw);
                }
            }
            
            // 验证总文件大小
            if ((totalSize / 1024 / 1024) > 1) {
                this.$message.warning("所选文件总大小不能超过1M!");
                return;
            } else {
                this.$fileUpload(this.urlconfig.cmImportCameras, param).then((res) => {
                    if (res.status === 0) {
                        this.isShowResult = true;
                        this.importResult = res.data;
                        this.$message.success(res.statusinfo);
                    }
                }).catch((error) => {
                    console.log(error);
                }).then(() => {
                    // todo somthing...
                });
            }
        }
    }
}
</script>

<style scoped>
    .importSection {
        padding: 10px 20px 20px 20px;
    }
    
    .importMeta {
        height:28px;
        line-height:28px;
    }
</style>