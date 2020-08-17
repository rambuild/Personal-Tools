// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import router from './router'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

//复制到剪切板插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// axios.defaults.withCredentials=true;
// import proxy from './api/index'
// Vue.prototype.veeeProxy = proxy
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(ElementUI)

import message from './message'
Vue.prototype.$msg = message

// v-charts
import VCharts from 'v-charts'
Vue.use(VCharts)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})