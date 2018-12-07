// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
// Vue.prototype.$ajxj = axios;
// 对get,post进行了封装
import { post, get } from './axios'
Vue.prototype.$post = post;
Vue.prototype.$get = get;
import 'es6-promise/auto'
import store from './vuex/store';
// 调用,env根据环境赋值
store.commit("env");
Vue.prototype.storeEnv = store.state.env;
import urlconfig from './axios/urlconfig';
Vue.prototype.urlconfig = urlconfig;

import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';
Vue.use(Element);
// main.css公共样式
import './css/main.css';
import VueLoading from 'vue-loading-template';
Vue.use(VueLoading);
import {
    VePie,
    VeBar,
    VeHistogram
} from 'v-charts/lib';
Vue.component(VePie.name, VePie);
Vue.component(VeBar.name, VeBar);
Vue.component(VeHistogram.name, VeHistogram);

import vueEventCalendar from '@/components/commons/vue-event-calendar/index';
Vue.use(vueEventCalendar)

import Mock from './mock';

import App from './App';
// if (process.env.NODE_ENV === 'development') {
// Mock.bootstrap();
// }
Vue.config.productionTip = false;

Vue.prototype._simple_encode = function(password) {
    var s1 = 97;
    var s2 = 76;
    var len = password.length;
    var maxlength = len;
    var encodePw = "";
    for (var i = 0; i < maxlength; i++) {
        var ch = 0;
        var ch1 = 0;
        var ch2 = 0;
        ch = i >= len || !password ? 0 : password.charCodeAt(i);
        ch = (s1++ + ch) ^ s2++;
        ch1 = Math.floor(ch / 26) + ("I".charCodeAt(0));
        ch2 = ch % 26 + ("A".charCodeAt(0));
        if ((i & 1) == 1) {
            s2 += ch1 & 0xf;
        } else {
            s2 -= ch1 & 0xf;
        }
        var ch1Char = String.fromCharCode(ch1);
        var ch2Char = String.fromCharCode(ch2);
        encodePw = encodePw + ch1Char + ch2Char;
    }
    return encodePw;
}

new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})