import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '/src/assets/styles/app.scss'
Vue.config.productionTip = false
window.axios = require('axios');
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
