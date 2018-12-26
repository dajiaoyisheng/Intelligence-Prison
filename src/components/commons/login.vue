<template>
  <div class="login-wrap">
    <div class="login-cont">
      <div class="login-form">
        <div class="login-title-wrap">
          <div class="login-text">
            <p class="login-icon-text">
              <img class="login-icon" :src="loginicon" alt="">&nbsp;
              <span>用户登录</span>
              <span>&#124;</span>
              <span class="login-title-en">Admin Login</span>
            </p>
          </div>
          <div class="project-name">
            <p class="login-project-name">
              <span>久其监狱智能监控管理系统</span>
            </p>
          </div>
        </div>
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="80px" class="demo-ruleForm login-container">
          <!-- <h3 class="title">系统登录</h3> -->
          <el-form-item label="用户名:" prop="account">
            <el-input class="login-form-input" type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item class="login-password-wrap" label="密 码:" prop="checkPass">
            <el-input class="login-form-input" type="password" v-model="ruleForm2.checkPass" auto-complete="off"
              placeholder="密码"></el-input>
          </el-form-item>
          <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
          <div class="remember">
            <input id="remember-chekbox" class="remember-chekbox" type="checkbox" v-model="checked" checked>
            <label for="remember-chekbox" class="remember-text">记住密码</label>
            <!-- <span class="remember-text">记住密码</span> -->
          </div>
          <el-form-item class="login-btn-wrap">
            <el-button class="login-btn" type="primary" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import loginicon from '@/assets/login/icon.png';
  export default {
    name: "login",
    data() {
      return {
        logining: false,
        loginicon: loginicon,
        ruleForm2: {
          account: "",
          checkPass: ""
        },
        rules2: {
          account: [{
              required: true,
              message: "请输入账号",
              trigger: "blur"
            }
            //{ validator: validaePass }
          ],
          checkPass: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            }
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    mounted() {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function () {
        history.pushState(null, null, document.URL);
      });
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate(valid => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = {
              username: this.ruleForm2.account,
              password: this._simple_encode(this.ruleForm2.checkPass)
            };
            this.$post(this.urlconfig.login, loginParams)
              .then(res => {
                this.logining = false;
                if (res.status == 0) {
                  this.$store.commit("setUsername", loginParams.username);
                  this.$router.push({
                    path: "/Content"
                  });
                }
              })
              .catch(e => {
                console.log(e);
                this.logining = false;
              });
          } else {
            return false;
          }
        });
      }
    }
  };

</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-image: url("../../assets/login/bg.jpg");
    /* background-size: cover; */
    position: relative;
  }

  .login-wrap .login-cont {
    width: 500px;
    height: 348px;
    background-image: url("../../assets/login/bg1.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .login-wrap .login-cont .login-form {
    width: 468px;
    height: 312px;
    background-image: url("../../assets/login/bg2.png");
    background-size: cover;
  }

  .login-wrap .login-cont,
  .login-wrap .login-cont .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .login-container {
    padding: 20px 15% 15px 15%;
  }

  .login-title-wrap {
    height: 84px;
  }

  .login-text {
    height: 39px;
    line-height: 39px;
  }

  .login-icon-text {
    color: #88BDFA;
    font-family: DFPLiJinHeiW8;
    font-size: 16px;
  }

  .login-title-en {
    font-size: 12px;
  }

  .login-project-name {
    color: #EFEFEF;
    font-family: MicrosoftYaHei;
    /* font-weight: bold; */
    font-size: 20px;
    letter-spacing: 9px;
  }

  .login-icon-text,
  .login-project-name {
    padding-left: 15%;
  }

  .login-text .login-icon {
    vertical-align: middle;
    width: 15px;
    height: 20px;
  }

  .project-name {
    height: 44px;
    line-height: 44px;
  }

  .login-btn {
    width: 224px;
    padding: 0 0;
    height: 30px;
    background-color: #2A76CD;
    border: #2A76CD;
    font-size: 12px;
  }

  .login-container .remember {
    margin: 0px 0px 20px 80px;
  }

  .login-container .remember .remember-chekbox {
    vertical-align: middle;
  }

  .login-container .remember .remember-text {
    font-size: 13px;
    cursor: pointer;
  }

  .el-form-item {
    margin-bottom: 15px;
  }

  .el-form--label-left .el-form-item__label {
    text-align: right
  }

  .el-form-item.is-required .el-form-item__label:before {
    content: ""
  }
</style>
<style>
  .login-wrap .login-form-input {
    width: 224px;
    height: 30px;
  }

  .login-wrap .login-form-input .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  .login-wrap .el-form-item.is-required .el-form-item__label:before {
    content: ""
  }

  .login-wrap .el-form--label-left .el-form-item__label {
    text-align: right;
  }

  .el-form-item.is-success .el-input__inner {
    /* border-color: rgba(136, 139, 145, 1) */
  }

  .login-wrap input:-internal-autofill-previewed,
  .login-wrap input:-internal-autofill-selected,
  textarea:-internal-autofill-previewed,
  textarea:-internal-autofill-selected,
  select:-internal-autofill-previewed,
  select:-internal-autofill-selected {
    background-color: #fff !important;
  }

  .login-wrap .el-form-item__label {
    color: #181819;
  }

  .login-wrap .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    /* background-color: rgba(136, 139, 145, 1) !important; */
    border-color: rgba(136, 139, 145, 1);
  }

</style>
