import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import VueAxios from 'vue-axios'
import GAuth from 'vue-google-oauth2'
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'
Vue.config.productionTip = false
Vue.use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance
})
Vue.use(GAuth, { clientId: '373718389469-mt374l9t9l5smd6d4tsmuvu9fejgr8j3.apps.googleusercontent.com', scope: 'email', prompt: 'select_account', fetch_basic_profile: false })

new Vue({
  vuetify,
  router,
  securedAxiosInstance,
  plainAxiosInstance,
  render: h => h(App)
}).$mount('#app')
