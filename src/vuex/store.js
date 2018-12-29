import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        loading: false,
        isFullNavWrap: false,
        env: "",
        loginUsername: ""
    },
    mutations: {
        env(state) {
            // 开发环境配置
            if (process.env.NODE_ENV === "development") {
                // 车
                state.env = "http://10.2.20.82:80/bi/hawkeye";
                // state.env = "http://10.2.20.85:9797/hawkeye";
            }
            // 生产环境配置
            else if (process.env.NODE_ENV === "production") {
                state.env = "/bi/hawkeye";
            }
            return state.env
        },
        showLoading(state) {
            state.loading = true
        },
        hideLoading(state) {
            state.loading = false
        },
        playvideo() {
            this.$el.querySelector(".movie-wrap").scrollIntoView();
        },
        setUsername(state, name) {
            state.loginUsername = name
        }
    }
})
export default store;