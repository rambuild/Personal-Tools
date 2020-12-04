import Vue from "vue"
import Router from "vue-router"
import { getStorage } from "@/utils/cusLocStorage"

Vue.use(Router)

const router = new Router({
	mode: "hash",
	routes: [
		{
			path: "/",
			component: () => import("@/views/home")
		},
		{
			path: "/bali",
			component: () => import("@/views/baliInvite")
		},
		{
			path: "/veee",
			component: () => import("@/views/veeeInvite")
		},
		{
			path: "/v2box",
			component: () => import("@/views/v2boxInvite")
		},
		{
			path: "/priceCompare",
			component: () => import("@/views/tbPriceCompare"),
			meta: {
				title: "各大电商平台历史价格查询"
			}
		},
		{
			path: "/biliVideoDownload",
			component: () => import("@/views/biliVideoDownload"),
			meta: {
				title: "资源下载"
			}
		},
		{
			path: "/recoAbbr",
			component: () => import("@/views/recoAbbr"),
			meta: {
				title: "缩写识别"
			}
		},
		{
			path: "/ai",
			component: () => import("@/views/ai/index"),
			meta: {
				title: "人工智能"
			}
		},
		{
			path: "/ai/image/:title/:method",
			component: () => import("@/views/ai/imageTec")
		}
	]
})
// 路由守卫
router.beforeEach((to, from, next) => {
	// 动态更改title
	if (to.meta.title) {
		document.title = to.meta.title
	} else {
		document.title = "Tools"
	}
	// if (to.path !== "/") {
	// 	let flag = getStorage("verifyFlag")
	// 	if (flag) {
	// 		return next()
	// 	} else {
	// 		Vue.prototype.$msg("warning", "未登录")
	// 		return next("/")
	// 	}
	// }
	next()
})
export default router
