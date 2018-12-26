<template>
  <div>
    <nav class="nav-wrap">
      <el-menu
        :default-active="$route.path"
        router
        class="nav-ul clearfix"
        :class="{navWrapFull:isFullNavWrap}"
        mode="horizontal"
        @select="handleSelect"
        background-color="#2f323c"
        text-color="#909399"
        active-text-color="#fff"
      >
        <div class="logoWrap">
          <img class="logo" :src="logo" alt>
          <img class="name" :src="name" alt>
        </div>
        <el-menu-item index="/workbench">
          <router-link to="/workbench">工作台</router-link>
        </el-menu-item>
        <el-menu-item index="/tvmonitor">
          <router-link to="/tvmonitor">视频监控</router-link>
        </el-menu-item>
        <el-menu-item index="/personnelposition">
          <router-link to="/personnelposition">人员定位</router-link>
        </el-menu-item>
        <el-menu-item index="/pointname">
          <router-link to="/pointname">人员点名</router-link>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">查询统计</template>
          <el-menu-item index="/querystats/posunusual">
            <router-link to="/querystats/posunusual">定位异常预警</router-link>
          </el-menu-item>
          <el-menu-item index="/querystats/violation">
            <router-link to="/querystats/violation">违规预警</router-link>
          </el-menu-item>
          <el-menu-item index="/querystats/prewarningstats">
            <router-link to="/querystats/prewarningstats">预警统计</router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">系统设置</template>
          <el-menu-item index="/systemset/prisonmanagement">
            <router-link to="/systemset/prisonmanagement">监区管理</router-link>
          </el-menu-item>
          <el-menu-item index="/systemset/prisonermanagement">
            <router-link to="/systemset/prisonermanagement">服刑人员管理</router-link>
          </el-menu-item>
          <el-menu-item index="/systemset/cameramanagement">
            <router-link to="/systemset/cameramanagement">摄像头管理</router-link>
          </el-menu-item>
          <el-menu-item index="/systemset/servermanagement">
            <router-link to="/systemset/servermanagement">服务地址配置</router-link>
          </el-menu-item>
          <el-menu-item index="/systemset/calendarmanagement">
            <router-link to="/systemset/calendarmanagement">日历管理</router-link>
          </el-menu-item>
          <el-menu-item index="/systemset/sysoptionsmanagement">
            <router-link to="/systemset/sysoptionsmanagement">系统选项</router-link>
          </el-menu-item>
          <el-menu-item index="/systemset/systemmanagement">
            <router-link to="/systemset/systemmanagement">系统管理</router-link>
          </el-menu-item>
        </el-submenu>
        <div class="nav-right-wrap clearfix fr">
          <el-input class="nav-input fl clearfix" size="mini" placeholder="请输入内容" v-model="inputKey">
            <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="search()"></i>
          </el-input>
          <span class="username fl">
            <span>{{username}}</span>
          </span>
          <span index="loginout" class="loginout fl" @click="logout()">
            <span>退出</span><img class="heard-icon-outlogin" :src="loginout">
          </span>
        </div>
      </el-menu>
    </nav>
  </div>
</template>

<script>
import logo from "@/assets/logo.png";
import name from "@/assets/name.png";
import downopen from "@/assets/downopen.png";
import loginout from "@/assets/loginout.png";
import EventUtils from "@/components/commons/eventUtils.js";

export default {
  name: "Header",
  data() {
    return {
      username: this.$store.state.loginUsername ? this.$store.state.loginUsername : "登录", 
      loginout: loginout,
      downopen: downopen,
      logo: logo,
      name: name,
      inputKey: ""
    };
  },
  computed: {
    isFullNavWrap() {
      return this.$store.state.isFullNavWrap;
    }
  },
  methods: {
    handleSelect(key, keyPath) {},
    /** 注销 */
    logout: function() {
      this.$post(this.urlconfig.logout, { username: this.$store.state.loginUsername }).then(res => {
        if (res.status == 0) {
          this.$store.commit("setUsername", "");
          this.$router.push({ path: "/" });
        }
      }).catch(e => {
        console.log(e);
      });
    },
    /** 搜索 */
    search: function() {
      let params = {priCode:'', paiCode:'',  prisoner:this.inputKey, supervisionType:'', criCurstate:''};
      this.$router.push({
        path: "/personnelposition",
        query: {"isSkip":true, "params": params}
      });

      EventUtils.$emit("params", params);
    }
  }
};
</script>

<style scoped>
.nav-wrap {
  background-color: rgb(47, 50, 60);
  height: 60px;
  position: fixed;
  z-index: 999;
  width: 100%;
  top: 0;
  left: 0;
}

.nav-wrap .nav-ul {
  margin: 0 auto;
  width: 1200px;
}

.nav-wrap .navWrapFull {
  width: 100%;
  min-width: 1200px;
  padding: 0 2%;
}

.el-menu-item:hover {
  color: #fff !important;
  background-color: #2f323c !important;
}

.el-submenu:hover {
  color: #fff !important;
}

.logoWrap {
  float: left;
  line-height: 60px;
  margin-right: 5%;
}

.logoWrap:focus {
  outline: none;
}

.logoWrap img {
  vertical-align: middle;
}

.logoWrap span {
  color: rgba(255, 255, 255, 1);
}

.logo {
  width: 20px;
  height: 17px;
  margin-right: 10px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}

.el-submenu__title {
  border-bottom-color: none !important;
}

.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: none;
}

.el-submenu.is-active .el-submenu__title {
  border-bottom-color: none;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  outline: 0;
  color: #fff;
}

.nav-wrap .el-menu-item {
  padding: 0 1.3%;
}

.nav-wrap .navWrapFull .nav-left-wrap {
  width: 63%;
}

.nav-wrap .nav-right-wrap {
  outline: none;
  width: 28%;
}

.nav-wrap .navWrapFull .nav-right-wrap {
  padding-left: 2%;
  width: 30%;
}

.nav-wrap .nav-input {
  outline: none;
  width: 50%;
  height: 60px;
  line-height: 64px;
  text-align: right;
}

.nav-wrap .navWrapFull .nav-input {
  width: 200px;
}

.nav-wrap .loginout {
  width: 25%;
  text-align: center;
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  cursor: pointer;
  color: rgb(144, 147, 153);
}

.nav-wrap .username {
  width: 25%;
  text-align: center;
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  color: rgb(144, 147, 153);
}

.nav-wrap .username {
  line-height: 64px;
}

.nav-wrap .loginout {
  line-height: 60px;
}

.nav-wrap .navWrapFull .username,
.nav-wrap .navWrapFull .loginout {
  width: calc((98% - 200px) / 2);
}

.nav-wrap .navWrapFull .username {
  text-align: center;
}

.nav-wrap .navWrapFull .loginout {
  text-align: left;
}

img.heard-icon-arrow {
  width: 11px;
  height: 11px;
}

img.heard-icon-outlogin {
  width: 15px;
  height: 15px;
}
</style>

<style>
.nav-wrap .el-menu--horizontal > .el-submenu .el-submenu__title {
  line-height: 64px;
}

.nav-wrap .el-submenu__title {
  padding: 0;
}

.nav-wrap .navWrapFull .el-submenu__title {
  padding: 0;
}

.nav-wrap .el-submenu__title:hover {
  color: #fff !important;
  background-color: #2f323c !important;
}

.nav-wrap .el-menu--horizontal > .el-submenu {
  padding: 0 1.9%;
}

.nav-wrap .el-input--mini .el-input__inner {
  width: 150px;
  height: 30px;
  border-radius: 15px;
  background-color: rgb(47, 50, 60);
  outline: none;
  color: rgb(144, 147, 153);
  border-color: rgb(144, 147, 153);
}

.nav-wrap .el-submenu__icon-arrow {
  display: none;
}

.el-menu--popup-bottom-start {
  margin-top: 0px;
}

.el-menu--popup {
  min-width: 160px;
  padding: 20px 0;
  border-radius: 0px;
  opacity: 0.95;
}

.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  padding: 0 20px;
}

.el-menu--horizontal .el-menu .el-menu-item a:hover,
.el-menu--horizontal .el-menu .el-submenu__title a:hover {
  color: #fff !important;
}

.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: none;
}
</style>