<template>
    <div id="importCameras">
        <section class="importSection">
            <el-row>
                <el-col :span="24"><span>只能上传xls/xlsx文件，且不超过2M</span></el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="6"><span class="importMeta">请选择导入文件:</span></el-col>
                <el-col :span="12">
                    <el-upload action="auto" :file-list="files" :http-request="uploadSectionFile" :auto-upload="false">
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
            importURL: "",
            downloadtURL: ""
      }
    },
    mounted() {
        this.initActionUrl();
    },
    methods: {
        /** 初始化请求地址 */
        initActionUrl: function() {
            this.importURL = this.$store.state.env + this.urlconfig.cmImportCameras;
            this.downloadtURL = this.$store.state.env + this.urlconfig.cmDownloadTemplet;
        },
        uploadSectionFile(param) {

        },
        /** 提交导入文件 */
        submitUpload: function() {
            var param = new FormData();
            param.append("file", this.files);
            param.append("name", "ziguiyu");
            param.append("Content-Type", "multipart/form-data");

            this.$post(this.urlconfig.cmImportCameras, param).then((res) => {
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