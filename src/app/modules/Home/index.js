const Home = (r) => require.ensure([], () => r(require('./Home')), 'core')
const MyPosts = (r) => require.ensure([], () => r(require('./MyPosts')), 'core')
const Comments = (r) => require.ensure([], () => r(require('./Comments')), 'core')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/my',
    name: 'my-posts',
    component: MyPosts
  },
  {
    path: '/comments/:key',
    name: 'comments',
    component: Comments
  }
]

export { routes }
