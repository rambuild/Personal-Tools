import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: () => import('@/components/home')
        },
        {
            path: '/bili',
            component: () => import('@/components/tools/biliInvite')
        },
        {
            path: '/veee',
            component: () => import('@/components/tools/veeeInvite')
        },
        {
            path: '/v2box',
            component: () => import('@/components/tools/v2boxInvite')
        }
    ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.path !== '/') {
        let flag = window.sessionStorage.getItem('verifyFlag')
        if (flag) {
            return next()
        }else{            
            return next('/')
        }
    }
    next()
})
export default router;