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
        <md-button class="md-primary" @click.native="closeDialog('commentDialog')">Cancel</md-button>
        <md-button class="md-primary" @click.native="commentItem">Create</md-button>
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

    <md-card v-for="item in sortPosts(posts)" md-with-hover>
      <md-card-media md-ratio="4:3">
        <md-image :md-src="item.imageUrl"></md-image>
      </md-card-media>

      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{item.message}}</div>
          <div class="md-subhead">2043 empoints, {{item.likesCount}} likes e 4 comments</div>
        </md-card-header-text>

        <md-menu md-size="4" md-direction="bottom left">
          <md-button class="md-icon-button" md-menu-trigger>
            <md-icon>more_vert</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item @click.native="removeItem(item)">
              <span>Delete</span>
              <md-icon>delete</md-icon>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </md-card-header>

      <md-card-expand>
        <md-card-actions>
          <md-card-actions>
            <md-button class="md-icon-button" @click.native="likeItem(item)" v-if="!hasLiked(item)">
              <md-icon>favorite</md-icon>
            </md-button>
            <md-button class="md-icon-button md-accent" @click.native="likeItem(item)" v-if="hasLiked(item)">
              <md-icon>favorite</md-icon>
            </md-button>
            <md-button class="md-icon-button" @click.native="openCommentDialog(item)">
              <md-icon>message</md-icon>
            </md-button>
          </md-card-actions>

          <md-button class="md-icon-button" md-expand-trigger @click.native="loadComments(item)">
            <md-icon>keyboard_arrow_down</md-icon>
          </md-button>
        </md-card-actions>

        <md-card-content>
          <md-list class="custom-list md-double-line md-dense">
            <md-list-item v-for="c in commentsList(item)">
              <md-avatar>
                <img src="https://placeimg.com/40/40/people/1" alt="People">
              </md-avatar>

              <div class="md-list-text-container">
                <span>{{c.user}}</span>
                <p>{{c.comment}}</p>
              </div>

              <md-divider class="md-inset"></md-divider>
            </md-list-item>
          </md-list>
        </md-card-content>
      </md-card-expand>
    </md-card>

  </div>
</template>

<style lang="scss" scoped>
  .md-card {
    margin-bottom: 15px;
  }

  .fixed-action-btn {
    position: fixed;
    right: 23px;
    bottom: 23px;
    padding-top: 15px;
    margin-bottom: 0;
    z-index: 998;
  }
</style>

<script>
  import config from '../../config.js'

  // Substituir quando tiver auth
  var userId = 'sidharta'

  var postsRef = config.firebaseDb.ref('posts')
  var commentsRef = config.firebaseDb.ref('user-comments')
  var imagesRef = config.firebaseStorage.ref('user-images')

  export default {
    name: 'home',
    firebase: {
      posts: postsRef.orderByChild('date').limitToLast(25)
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
          postsRef.child(this.subjectItem).remove()
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
            updates['/user-posts/' + userId + '/' + newPostKey] = self.post

            config.firebaseDb.ref().update(updates).then(() => {
              this.loading = false;
            })
          }
        );
      },
      openCommentDialog: function(item) {
        this.subjectItem = item
        this.$refs.commentDialog.open()
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
      },
      commentsList: function(item) {
        return this[item['.key'] + '_comments']
      },
      loadComments: function(item) {
        if (this.$firebaseRefs[item['.key'] + '_comments'] === undefined) {
          this.$bindAsArray(item['.key'] + '_comments', commentsRef.child(item['.key']))
        }

        this.$forceUpdate()
      },
      commentItem: function() {
        var cObj = {
          comment: this.comment,
          user: userId,
          date: Date.now()
        }

        commentsRef.child(this.subjectItem['.key']).push(cObj)
        this.$refs.commentDialog.close()
      }
    }
  }
</script>
