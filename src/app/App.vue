<template>
  <div class="container">

    <md-toolbar>
      <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>

      <h1 class="md-title">Empappathy!</h1>
    </md-toolbar>
    <md-sidenav class="md-left" ref="leftSidenav">
      <md-toolbar class="md-large">
        <div class="md-toolbar-container">
          <h3 class="md-title">Menu</h3>
        </div>
      </md-toolbar>

      <!-- <router-link exact to="/">Home</router-link>
      <router-link exact to="sign-up">Sign Up</router-link>
      <router-link exact to="sign-in">Sign In</router-link>
      <router-link exact to="recover-password">Recover Password</router-link>
      <router-link exact to="about">About</router-link> -->

      <md-list class="md-dense">
        <md-list-item>
          <md-icon>home</md-icon>
          <span><router-link exact to="/">Home</router-link></span>
        </md-list-item>

        <md-list-item>
          <md-icon>person</md-icon>
          <span><router-link exact to="sign-in">Sign In</router-link></span>
        </md-list-item>

        <md-list-item>
          <md-icon>info</md-icon>
          <span><router-link exact to="about">About</router-link></span>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .main-content {
    padding: 16px;
  }
</style>

<script>
  export default {
    name: 'app',
    methods: {
      toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle();
      }
    }
  }
</script>
