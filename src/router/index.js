import Vue from 'vue'
import Router from 'vue-router'
import { getStorage } from '@/utils/cusLocStorage'

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: () => import('@/components/home')
        },
        {
            path: '/bali',
            component: () => import('@/components/tools/baliInvite')
        },
        {
            path: '/veee',
            component: () => import('@/components/tools/veeeInvite')
        },
        {
            path: '/v2box',
            component: () => import('@/components/tools/v2boxInvite')
        },
        {
            path: '/priceCompare',
            component: () => import('@/components/tools/tbPriceCompare'),
            meta: {
                title: '各大电商平台历史价格查询'
            }
        },
        {
            path: '/biliVideo',
            component: () => import('@/components/tools/biliVideo'),
            meta: {
                title: '资源下载'
            }
        }
    ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
    // 动态更改title
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = 'Tools'
    }
    if (to.path !== '/') {
        let flag = getStorage('verifyFlag')
        if (flag) {
            return next()
        } else {
            Vue.prototype.$msg('warning', '未登录')
            return next('/')
        }
    }
    next()
})
export default router;