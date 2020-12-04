<template>
	<div>
		<div class="itemsContent" v-for="i in renderData" :key="i.title">
			<h2 class="itemTitle">{{ i.title }}</h2>
			<div class="itemsBox">
				<div class="item" v-for="j in i.items" :key="j.title" @click="$router.push(`/ai/image/${j.title}/${j.method}`)">
					<span>
						<i :class="'iconfont ' + j.iconfont"></i>
						<span>{{ j.title }}</span>
						<i class="hot" v-if="j.hot == true">HOT</i>
						<i class="new" v-if="j.new == true">NEW</i>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "renderAIData",
	props: {
		renderData: {
			type: Array
		}
	}
}
</script>

<style lang="scss" scoped></style>
