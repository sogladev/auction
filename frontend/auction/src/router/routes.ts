import { RouteRecordRaw } from 'vue-router';


const routes: RouteRecordRaw[] = [
  {
    path: '/room',

    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        //path: ':roomId(\\w{5})',
        path: ':id',
        component: import('pages/RoomPage.vue'),
        props: (route) => ({ id: route.params.id }),
      },
    ],
  },
  {
    path: '/',

    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: 'about',
        component: import('pages/AboutPage.vue'),
      },
      {
        path: '',
        component: import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
