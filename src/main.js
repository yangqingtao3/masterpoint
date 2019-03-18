import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import './plugins/element.js'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import fabric from 'fabric'

import axios from 'axios'

import $$ from 'jquery'

import './assets/normalize.css'

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.use(fabric)
Vue.use(axios)
Vue.use($$)
Vue.use(contentmenu)
Vue.use(ElementUI)
Vue.config.productionTip = false

window.vueMain = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
