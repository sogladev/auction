import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',

    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: 'room', // here it is, route /user/posts
        component: import('pages/RoomPage.vue'), // we reference /src/pages/Posts.vue imported above
      },
      {
        path: '', // here it is, route /user/profile
        component: import('pages/IndexPage.vue'), // we reference /src/pages/Profile.vue imported above
      },

    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
