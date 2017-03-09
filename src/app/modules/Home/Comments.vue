<template>
  <div class="main-content">
    <md-button class="md-raised" @click.native="$refs.commentDialog.open()">Add Comment</md-button>
    <md-list class="custom-list md-double-line md-dense">
      <md-subheader>Comments</md-subheader>
      <md-list-item v-for="c in comments">
        <md-avatar>
          <img :src="c.userPhoto">
        </md-avatar>

        <div class="md-list-text-container">
          <span>{{c.userName}}</span>
          <p>{{c.comment}}</p>
        </div>

        <md-divider class="md-inset"></md-divider>
      </md-list-item>
    </md-list>

    <md-dialog ref="commentDialog">
      <md-dialog-title>Post your comment</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-input-container>
            <label>Comment</label>
            <md-textarea v-model="comment"></md-textarea>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="$refs.commentDialog.close()">Cancel</md-button>
        <md-button class="md-primary" @click.native="commentItem">Create</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import config from '../../config.js'
  import axios from 'axios'
  import auth from '../Auth/AuthService.js'

  var userId = auth.user.email
  var commentsRef = config.firebaseDb.ref('user-comments')
  var postsRef = config.firebaseDb.ref('posts')

  export default {
    name: 'comments',
    created() {
      this.$bindAsArray('comments', commentsRef.orderByChild('postKey').equalTo(this.$route.params.key))
    },
    methods: {
      commentItem: function() {
        var postKey = this.$route.params.key
        var cObj = {
          comment: this.comment,
          user: userId,
          userName: auth.user.name,
          userPhoto: auth.user.imageUrl,
          date: Date.now(),
          postKey: postKey
        }

        var key = commentsRef.push().key

        commentsRef.child(key).update(cObj).then( () => {
          postsRef.child(postKey).transaction(function(post) {
            if (post) {
              if (!post.commentsCount) {
                post.commentsCount = 1
              } else {
                post.commentsCount++
              }
            }
            return post
          })
        })

        // call google function
        axios.request(
          {
            url: 'https://us-central1-empappathy.cloudfunctions.net/commentAnalysis',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: '{"commentKey": "' + key + '"}'
          }
        )

        this.$refs.commentDialog.close()
      }
    }
  }
</script>
