<template>
  <md-layout md-column class="container">

    <md-toolbar>
      <md-button class="md-icon-button" @click.native="$refs.leftSidenav.toggle()" v-if="$route.name === 'home'">
        <md-icon>menu</md-icon>
      </md-button>

      <md-button class="md-icon-button" @click.native="$router.go(-1)" v-if="$route.name !== 'home'">
        <md-icon>arrow_back</md-icon>
      </md-button>

      <h1 class="md-title">Empappathy!</h1>
    </md-toolbar>
    <md-sidenav class="md-left" ref="leftSidenav">
      <md-toolbar class="md-account-header">
        <md-list class="md-transparent" v-if="user">
          <md-list-item class="md-avatar-list">
            <md-avatar class="md-large">
              <img :src="user.imageUrl">
            </md-avatar>
          </md-list-item>

          <md-list-item>
            <div class="md-list-text-container">
              <span>{{user.name}}</span>
              <span>{{user.email}}</span>
            </div>
          </md-list-item>
        </md-list>
      </md-toolbar>

      <md-list class="md-dense" @click.native="$refs.leftSidenav.toggle()">
        <md-list-item>
          <router-link exact to="/">
            <md-icon>home</md-icon>
            <span>Home</span>
          </router-link>
        </md-list-item>

        <md-list-item>
          <router-link exact to="/my">
            <md-icon>star</md-icon>
            <span>My posts</span>
          </router-link>
        </md-list-item>

        <md-list-item>
          <router-link exact to="sign-in">
            <md-icon>person</md-icon>
            <span>Sign In</span>
          </router-link>
        </md-list-item>

        <md-list-item>
          <router-link exact to ="/" @click.native="logout">
            <md-icon>eject</md-icon>
            <span>Sign Out</span>
          </router-link>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <md-layout md-flex class="viewport">
      <router-view></router-view>
    </md-layout>
  </md-layout>
</template>

<style lang="scss" scoped>
  .main-content {
    padding: 8px;
    flex: 1;
  }

  .viewport {
    overflow: auto;
  }
</style>

<style lang="scss" >
   body, .container {
     height: 100%;
   }
</style>

<script>
  import auth from './modules/Auth/AuthService.js'

  export default {
    name: 'app',
    data() {
      return {
        user: auth.user
      }
    },
    methods: {
      logout: function() {
        auth.logout(this)
      }
    }
  }
</script>
