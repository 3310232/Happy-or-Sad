import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '../components/explore/ExploreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: ExploreView },
    { 
      path: '/about', 
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    // 你可以新增这些页面路由：
    { path: '/chat', name: 'chat', component: () => import('../components/chat/ChatView.vue') },
    { path: '/settings', name: 'settings', component: () => import('../components/settings/SettingsView.vue') }
  ],
})

export default router
