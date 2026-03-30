import { createRouter, createWebHistory } from 'vue-router';
import QingmingHome from '../views/QingmingHome.vue';
import TributeView from '../views/TributeView.vue';
import WishesView from '../views/WishesView.vue';
import TimelineView from '../views/TimelineView.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'QingmingHome',
      component: QingmingHome,
    },
    {
      path: '/tribute',
      name: 'Tribute',
      component: TributeView,
    },
    {
      path: '/wishes',
      name: 'Wishes',
      component: WishesView,
    },
    {
      path: '/timeline',
      name: 'Timeline',
      component: TimelineView,
    },
  ],
});

export default router;

