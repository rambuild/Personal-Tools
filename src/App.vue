<template>
	<div id="app">
		<div class="toHomeBox">
			<el-button
				type="primary"
				class="toHome"
				@click="$router.push('/')"
				v-show="$route.path != '/'"
				>返回首页</el-button
			>
		</div>
		<router-view />
	</div>
</template>

<script>
import home from "./views/home"

export default {
	name: "App",
	components: {
		home
	},
	methods: {}
}
</script>

<style lang="scss">
@import url("./assets/css/base");
body {
	background-color: rgb(71, 81, 100);
	max-width: 600px;
	margin: 0 auto;
}
#app {
	height: 100vh;
	/* max-width: 1366px; */
	/* margin: 0 auto; */
	min-width: 375px;
}
.el-message {
	min-width: 55% !important;
	width: 55% !important;
}
.el-message-box {
	width: 60% !important;
}
.toHomeBox {
	width: 95%;
	margin: 0 auto;
    height: 1px;
	.toHome {
        position: relative;
		top: 15px;
		left: 0;
		width: 80px !important;
		padding: 10px !important;
		z-index: 1000;
	}
}
.el-loading-mask {
	background-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
