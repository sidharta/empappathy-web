<template>
  <div class="main-content">
    <md-button id="fab" class="md-fab md-fab-bottom-right fixed-action-btn" @click.native="openPhoto">
      <md-icon>photo_camera</md-icon>
      <input ref="imageInput" type="file" accept="image/*"
        capture="camera" style="display:none" @change="onFileChange">
    </md-button>

    <md-spinner v-if="loading" md-indeterminate></md-spinner>

    <md-dialog md-open-from="#fab" md-close-to="#fab" ref="dialog">
      <md-dialog-title>Create new post</md-dialog-title>

      <md-dialog-content>
        <img :src="image" />
        <form>
          <md-input-container>
            <label>Message</label>
            <md-textarea v-model="message"></md-textarea>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('dialog')">Cancel</md-button>
        <md-button class="md-primary" @click.native="addItem">Create</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog-confirm
      :md-title="confirm.title"
      :md-content-html="confirm.message"
      :md-ok-text="confirm.ok"
      :md-cancel-text="confirm.text"
      @close="confirmRemoveItem"
      ref="confirmRemove">
    </md-dialog-confirm>

     <md-layout md-column-xsmall>
      <md-layout md-flex-small="50" md-flex="33" v-for="item in sortPosts(posts)">
        <md-card md-with-hover class="md-flex">
          <md-card-media md-ratio="4:3">
            <md-image :md-src="item.imageUrl"></md-image>
          </md-card-media>

          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{item.message}}</div>
              <div class="md-subhead">{{item.empoints || 0}} empoints, {{item.likesCount || 0}} likes e {{item.commentsCount || 0}} comments</div>
            </md-card-header-text>
          </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button" @click.native="removeItem(item)">
              <md-icon>delete</md-icon>
            </md-button>
            <md-button class="md-icon-button" @click.native="likeItem(item)" v-if="!hasLiked(item)">
              <md-icon>favorite</md-icon>
            </md-button>
            <md-button class="md-icon-button md-accent" @click.native="likeItem(item)" v-if="hasLiked(item)">
              <md-icon>favorite</md-icon>
            </md-button>
            <md-button class="md-icon-button" @click.native="openComments(item)">
              <md-icon>message</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
      </md-layout>
    </md-layout>
  </div>
</template>

<style lang="scss" scoped>
  .fixed-action-btn {
    position: fixed;
  }
  .md-card {
    margin: 8px;
  }
</style>

<script>
  import config from '../../config.js'
  import auth from '../Auth/AuthService.js'

  var userId = auth.user.email
  var postsRef = config.firebaseDb.ref('posts')
  var imagesRef = config.firebaseStorage.ref('user-images')

  export default {
    name: 'home',
    firebase: {
      posts: postsRef.orderByChild('empoints').limitToLast(25)
    },
    data: () => {
      return {
        post: {},
        message: '',
        image: '',
        file: null,
        loading: false,
        confirm: {
          title: 'Confirm',
          message: 'Do you want to remove this item?',
          ok: 'Remove',
          cancel: 'Cancel'
        },
        subjectItem: {},
        comment: ''
      }
    },
    methods: {
      sortPosts: (posts) => {
        return posts.slice().reverse()
      },
      removeItem: function(post) {
        this.subjectItem = post;
        this.$refs.confirmRemove.open()
      },
      confirmRemoveItem: function(answer) {
        if ( answer === 'ok' ) {
          postsRef.child(this.subjectItem['.key']).remove()
        }
      },
      addItem: function() {
        var self = this;
        var metadata = {
          customMetadata: {
            author: userId
          }
        }

        var uploadTask = imagesRef.child(this.file.name).put(this.file, metadata)

        this.loading = true;
        this.$refs.dialog.close()

        uploadTask.on('state_changed', () => {}, () => {},
          () => {
            self.post = {
              imageUrl: uploadTask.snapshot.downloadURL,
              user: userId,
              date: Date.now(),
              message: self.message,
              likesCount: 0
            }

            var newPostKey = postsRef.push().key
            var updates = {}

            updates['/posts/' + newPostKey] = self.post

            config.firebaseDb.ref().update(updates).then(() => {
              var newMetadata = { customMetadata: { postKey: newPostKey } }

              imagesRef
                .child(this.file.name)
                .updateMetadata(newMetadata)
                .then(() => {
                  self.loading = false
                })
            })
          }
        );
      },
      openComments: function(item) {
        this.$router.push({ name: 'comments', params: { key: item['.key'] }})
      },
      closeDialog: function(dialog) {
        this.$refs[dialog].close()
      },
      openPhoto: function() {
        this.$refs.imageInput.click()
      },
      onFileChange: function(e) {
        var files = e.target.files || e.dataTransfer.files
        var self = this

        if (!files.length) {
          return;
        }

        var reader = new FileReader()

        reader.onload = (e) => {
          self.image = e.target.result
          self.file = files[0]
          self.$refs.dialog.open()
        }

        reader.readAsDataURL(files[0])
      },
      likeItem: function(p) {

        postsRef.child(p['.key']).transaction(function(post) {
          if (post) {
            if (post.likes && post.likes[userId]) {
              post.likesCount--
              post.likes[userId] = null
            } else {
              post.likesCount++
              if (!post.likes) {
                post.likes = {}
              }
              post.likes[userId] = true
            }
          }
          return post
        })
      },
      hasLiked: (item) => {
        return item.likes !== undefined && item.likes[userId]
      }
    }
  }
</script>
