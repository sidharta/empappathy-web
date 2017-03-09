/* Third Party */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import VueFire from 'vuefire'

/* App */
import App from './App'
import routes from './routes.js'
import Auth from './modules/Auth/AuthService.js'
import './core'

Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(VueFire)

let router = new VueRouter({
  hashbang: false,
  routes
})

router.beforeEach(function(to, from, next) {
  if (!Auth.isAuthenticated() && to.name !== 'sign-in') {
    next({
      path: '/sign-in',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  name: 'root',
  el: '#app',
  router,
  render: mount => mount(App)
})

export default {
  router: router
}
