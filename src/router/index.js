import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Register from '@/views/Register.vue';
import Chat from '@/views/Chat.vue';
import store from '@/store/';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresLogin: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
];


const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  const UUID = store.getters.getUUID;
  if (
    to.matched.some((record) => record.meta.requiresLogin)
    && UUID === null
  ) {
    next('/');
  } else {
    next();
  }
});

export default router;
