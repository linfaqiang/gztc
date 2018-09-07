// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueAxios from 'vue-axios'
import Http from './http.js'
import store from './store'
import VueClipboard from 'vue-clipboard2'
import '../static/css/flexible.css'
import '../static/css/page.css'

Vue.use(Vuex)
Vue.use(VueAxios, Http)
Vue.use(VueClipboard)
Vue.config.productionTip = false
// 先开启支付页面的支付功能（已经注释）
// Http.defaults.baseURL = '//h5.tongchuang.morejoin.com' // dist2 测试环境
// Http.defaults.baseURL = '//tongchuang.morejoin.com/h5' // dist3
// Http.defaults.baseURL = '//m.topchainspace.com' // 客户

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
