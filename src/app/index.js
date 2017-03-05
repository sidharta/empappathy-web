/* Third Party */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import VueFire from 'vuefire'

/* App */
import App from './App'
import routes from './routes.js'
import './core'

Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(VueFire)

let router = new VueRouter({
  hashbang: false,
  routes
})

/* eslint-disable no-new */
new Vue({
  name: 'root',
  el: '#app',
  router,
  render: mount => mount(App)
})
