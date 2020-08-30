import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'bootstrap'

import zh from 'vee-validate/dist/locale/zh_TW.json'
import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import App from './App.vue'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'
import store from './store'
localize({
  zh: {
    names: {
      email: '電子信箱',
      name: '姓名',
      address: '地址'
    }
  }
})
localize('zh', zh)
extend('required', required)
extend('email', email)

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
axios.defaults.withCredentials = true
Vue.config.productionTip = false

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('Loading', Loading)
Vue.filter('currency', currencyFilter)
Vue.use(require('vue-moment'))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  console.log(to, from)
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check`
    axios.post(api).then((response) => {
      if (response.data.success) {
        next()
      } else {
        console.log('尚未驗證')
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})
