/* Special Configs Here */
import Firebase from 'firebase'

var firebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyAMbff1vih3Pj2kDBGLq-TpLvVq_rdo5Z0',
  authDomain: 'empappathy.firebaseapp.com',
  databaseURL: 'https://empappathy.firebaseio.com',
  storageBucket: 'empappathy.appspot.com',
  messagingSenderId: '965377007346'
})

var db = firebaseApp.database()
var storage = firebaseApp.storage()
var provider = new Firebase.auth.GoogleAuthProvider()
var auth = Firebase.auth()

export default {
  firebaseDb: db,
  firebaseStorage: storage,
  firebaseAuthProvider: provider,
  firebaseAuth: auth,
  user: {}
}
