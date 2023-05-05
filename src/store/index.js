import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);
const config = {
  plugins: [createPersistedState()],
  state: {
    isLogin: false,
    username: "",
    token: "",
    user: [],
    resume: [],
    prompt: undefined,
  },
  getters: {
    isLogin: (state) => state.isLogin,
    token: (state) => state.token,
    username: (state) => state.username,
  },
  mutations: {
    updateLogin(state, payload) {
      state.isLogin = payload;
    },
    updateToken(state, payload) {
      state.token = payload;
    },
    updateUsername(state, payload) {
      state.username = payload;
    },
    //保存数据
    CHANGE_ACTIVE_LI(state, data) {
      state.token = data;
    },
    //保存resume
    saveResume(state, { info }) {
      state.resume = info;
    },
    //保存prompt配置信息
    SET_PROMPT(state, prompt) {
      state.prompt = prompt;
    },
    //保存用户信息
    SET_USER(state, user) {
      state.user = user;
    },
  },
  actions: {
    //保存数据
    changeSetting({ commit }, data) {
      commit("CHANGE_ACTIVE_LI", data);
    },
    //更新token
    updateToken({ commit }, data) {
      commit("updateToken", { token: data.token });
    },
    //保存resume
    setResumeInfo({ commit }, data) {
      commit("saveResume", data);
    },
    //获取prompt信息
    getPrompt({ commit }, data) {
      commit("SET_PROMPT", data);
    },
    //获取用户信息
    getUserInfo({ commit }, data) {
      commit("SET_USER", data);
    },
  },
};
const store = new Vuex.Store(config);
export default store;
