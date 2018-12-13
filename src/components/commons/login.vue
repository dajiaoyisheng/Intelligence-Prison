<template>
  <div class="login-wrap">
    <div class="login-cont">
      <div class="login-form">
        <div class="login-title-wrap">
          <div class="login-text">
            <p class="login-icon-text">
              <img class="login-icon" :src="loginicon" alt="">&nbsp;
              <span>用户登陆 | Admin Login</span>
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
            <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
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
          account: "admin",
          checkPass: "123456"
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
    position: relative;
  }

  .login-wrap .login-cont {
    width: 633px;
    height: 445px;
    background-image: url("../../assets/login/bg1.png");
    background-repeat: no-repeat;
  }

  .login-wrap .login-cont .login-form {
    width: 586px;
    height: 393px;
    background-image: url("../../assets/login/bg2.png");
  }

  .login-wrap .login-cont,
  .login-wrap .login-cont .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .login-container {
    padding: 28px 100px 15px 100px;
  }

  .login-title-wrap {
    height: 105px;
  }

  .login-text {
    height: 50px;
    line-height: 50px;
  }

  .login-icon-text {
    color: #88BDFA;
    font-family: DFPLiJinHeiW8;
    font-weight: 400;
  }

  .login-project-name {
    color: #EFEFEF;
    font-family: MicrosoftYaHei;
    font-weight: bold;
    letter-spacing: 20px;
  }

  .login-icon-text,
  .login-project-name {
    padding-left: 87px;
  }

  .login-text .login-icon {
    vertical-align: middle;
  }

  .project-name {
    height: 55px;
    line-height: 55px;
  }

  .login-btn-wrap {
    /* width: 306px; */
    /* text-align: center; */
  }

  .login-btn {
    width: 100%;
    /* margin-left: 82px; */
  }

  .login-container .remember {
    margin: 0px 0px 35px 80px;
  }

</style>
