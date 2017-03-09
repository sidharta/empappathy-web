import config from '../../config'

var provider = config.firebaseAuthProvider
var auth = config.firebaseAuth

export default {
  // authentication status
  isAuthenticated: function() {
    if (localStorage.user) {
      this.user = JSON.parse(localStorage.user);
      this.authenticated = true;
    }

    return this.authenticated;
  },

  authenticated: false,

  user: {},

  // Send a request to the login URL and save the returned JWT
  login: function(context, redirect) {
    var self = this

    auth.signInWithPopup(provider).then(function(result) {
      var data = {
        name: result.user.displayName,
        email: result.user.email,
        imageUrl: result.user.photoURL
      }

      localStorage.setItem('user', JSON.stringify(data))

      self.authenticated = true
      self.user = data

      // Redirect to a specified route
      if (redirect) {
        context.$router.push(redirect)
      }

    })
  },

  // To log out
  logout: function(context) {
    localStorage.removeItem('user');
    this.authenticated = false;
    context.$router.push('/sign-in')
  }
}
