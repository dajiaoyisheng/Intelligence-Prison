<template>
    <div id="importCameras">
        <section class="importSection">
            <el-row>
                <el-col :span="24"><span>只能上传xls/xlsx文件，且不超过2M</span></el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="6"><span class="importMeta">请选择导入文件:</span></el-col>
                <el-col :span="12">
                    <el-upload class="upload-demo" multiple action="auto" :limit="3" :on-exceed="handleExceed" :file-list="files" :on-change="handleChange" :auto-upload="false">
                        <el-button size="mini" type="primary" slot="trigger">选择文件</el-button>
                        <el-button size="mini" type="success" @click="submitUpload">上传到服务器</el-button>
                    </el-upload>
                </el-col>
                <el-col :span="4">
                    <a class="importMeta" :href="downloadtURL" download="">下载模板</a>
                </el-col>
            </el-row>
        </section>
    </div>
</template>

<script>
export default {
    data() {
      return {
            files: [],
            downloadtURL: ""
      }
    },
    methods: {
        /** 初始化请求地址 */
        initDatas: function() {
            this.files = [];
            this.downloadtURL = this.$store.state.env + this.urlconfig.cmDownloadTemplet;
        },
        /** 文件超出个数限制时的钩子 */
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择3个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleChange: function(file, fileList) {
            this.files = fileList;
        },
        /** 提交导入文件 */
        submitUpload: function() {
            var files = this.files;
            var param = new FormData();
            for (var i = 0; i < files.length; i++) {
                param.append('importFile', files[i].raw);
            }

            this.$fileUpload(this.urlconfig.cmImportCameras, param).then((res) => {
                if (res.status === 0) {
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