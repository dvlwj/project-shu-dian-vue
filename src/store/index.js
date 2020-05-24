
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: {
      username: null,
      UUID: null,
    },
  },
  mutations: {
    ADD_UUID(state, data) {
      state.user.UUID = data;
    },
    ADD_USERNAME(state, data) {
      state.user.username = data;
    },
  },
  actions: {
    setUUID({ commit }, data) {
      commit('ADD_UUID', data);
    },
    setUsername({ commit }, data) {
      commit('ADD_USERNAME', data);
    },
  },
  getters: {
    getUUID: (state) => state.user.UUID,
    getUsername: (state) => state.user.username,
  },
});
