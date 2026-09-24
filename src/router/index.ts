import { createRouter, createWebHashHistory } from 'vue-router'
import emitter from '@/composables/emitter'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/home-page.vue'),
        },
    ],
})

// 路由跳转前的监听操作
router.beforeEach((to) => {
    emitter.emit('nprogress-start', {
        type: 'router',
        url: to.path,
    })
    return true
})

// 路由跳转后的监听操作
router.afterEach(() => {
    emitter.emit('nprogress-done', {
        type: 'router',
        url: router.currentRoute.value.path,
    })
})

export default router
