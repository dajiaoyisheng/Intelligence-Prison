<template>
  <section class="login-wrap">
    <a href="javascript:;" class="log-close">
      <i class="icons close"></i>
    </a>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="ruleForm2.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('ruleForm2')">登录</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  export default {
    name: 'login',
    data() {
      //   var checkAge = (rule, value, callback) => {
      //     if (!value) {
      //       return callback(new Error('年龄不能为空'));
      //     }
      //     setTimeout(() => {
      //       if (!Number.isInteger(value)) {
      //         callback(new Error('请输入数字值'));
      //       } else {
      //         if (value < 18) {
      //           callback(new Error('必须年满18岁'));
      //         } else {
      //           callback();
      //         }
      //       }
      //     }, 1000);
      //   };
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.username !== '') {
            this.$refs.ruleForm2.validateField('username');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          username: '',
          pass: '',
          //   checkPass: '',
        },
        rules2: {
          username: [{
            validator: validateName,
            trigger: 'blur'
          }],
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          //   checkPass: [{
          //     validator: validatePass2,
          //     trigger: 'blur'
          //   }]
          //   ,
          //   age: [{
          //     validator: checkAge,
          //     trigger: 'blur'
          //   }]
        }
      };
    },
    methods: {
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
<style scoped>
  .login-wrap {
    overflow: hidden;
    position: fixed;
    transform: translate(-50%, -50%);
    left: 50%;
    /* margin-left: -250px; */
    top: 50%;
    /* margin-top: -350px; */
    width: 500px;
    min-height: 355px;
    z-index: 10;
    right: 140px;
    background: #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 3px 16px -5px #070707;
    box-shadow: 0px 3px 16px -5px #070707
  }

  .log-close {
    display: block;
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 1;
  }

  .log-close:hover .icons {
    transform: rotate(180deg);
  }

  .log-close .icons {
    opacity: 1;
    transition: all .3s
  }

  .icons {
    /* background: url('../assets/icons.png') no-repeat; */
    display: inline-block;
  }

  .close {
    height: 16px;
    width: 16px;
    background-position: -13px 0;
  }

</style>
