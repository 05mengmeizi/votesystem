import { createRouter, createWebHistory } from 'vue-router'
import VotePage from '@/pages/VotePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/theback/24poll',
      name: 'vote',
      component: VotePage,
    },
    {
      path: '/theback/24poll/results',
      name: 'results',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/ResultsPage.vue'),
    },
  ],
})

export default router
