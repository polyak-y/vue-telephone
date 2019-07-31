import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth'
import addData from './addData'
import shared from './shared'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { //подключаем модули с состоянием
    auth: auth,
    addData: addData,
    shared: shared
  }
})