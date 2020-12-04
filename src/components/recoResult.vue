<template>
	<div class="resultBox">
		<slot></slot>
		<div class="header">
			<span class="title">识别结果</span>
		</div>
		<div class="content">
			<div class="item" v-for="(i, index) in Object.keys(resultData)" :key="index">
				<div class="index">
					<span>{{ i }}</span>
				</div>
				<div class="words">
					<div v-if="typeof resultFormat == 'string'">
						<span>{{ resultFormat ? resultData[i][resultFormat] : resultData[i] }}</span>
					</div>
					<div class="multiple" v-else>
						<span v-for="j in resultFormat" :key="j"> {{ j }}：{{ resultData[i][j] }}<br /> </span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		resultData: Array | Object,
		resultFormat: Array | Object | String
	}
}
</script>

<style lang="scss" scoped>
.resultBox {
	background-color: #fff;
	padding: 0 0.5rem 1rem;
	margin-bottom: 5rem;
	border-radius: 5px;
	.header {
		padding: 1rem 0;
		display: flex;
		justify-content: space-between;
		.title {
			font-size: 20px;
			color: #000;
			font-weight: bold;
		}
		.tips {
			font-size: 14px;
			line-height: 26px;
			color: #666;
			cursor: pointer;
		}
	}
	.content {
		color: #000;
		.item {
			padding: 0;
			margin: 0.5rem 0;
			border: solid 1px #aaa;
			border-radius: 5px;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			font-size: 14px;
			.index,
			.words {
				width: 30%;
				display: flex;
				justify-content: center;
				align-items: center;
				overflow: hidden;
				span {
					width: 90%;
					text-align: center;
					padding: 1rem 0;
					overflow: scroll;
				}
			}
			.words {
				color: #409eff;
				width: 65%;
				padding: 0.5rem 1rem 0.5rem 0;
				display: flex;
				justify-content: flex-start;
				span {
					width: 100%;
					text-align: left;
				}
				.multiple {
					text-align: left;
				}
			}
		}
	}
}
</style>
