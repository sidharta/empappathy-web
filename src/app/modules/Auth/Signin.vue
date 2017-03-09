<template>
  <div class="main-content">
    <md-layout md-align="center">
      <md-button class="md-raised" @click.native="login">
        <md-icon md-src="https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png"></md-icon>
        Sign-in with Google
      </md-button>
    </md-layout>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>
  import auth from './AuthService.js'

  export default {
    name: 'sign-in',
    methods: {
      login: function() {
        auth.login(this, this.$route.query.redirect)
      }
    }
  }
</script>
