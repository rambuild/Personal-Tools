<template>
	<div class="homeContent">
		<div class="buttonContent">
			<div class="logOff">
				<el-button type="danger" size="small" @click="showMore">点击</el-button>
			</div>
			<!-- <div class="btnBox" v-if="showMoreFlag == true">
				<el-button type="primary" @click="navTo('/bali')">bali</el-button>
			</div> -->
			<div class="btnBox" v-if="showMoreFlag == true">
				<el-button type="primary" @click="navTo('/veee')">Veee</el-button>
			</div>
			<!-- <div class="btnBox" v-if="showMoreFlag == true">
				<el-button type="primary" class="v2box" @click="navTo('/v2box')">V2box</el-button>
			</div> -->
			<!-- <div class="btnBox">
				<el-button type="primary" @click="navTo('/priceCompare')">电商比价</el-button>
			</div> -->
			<!-- <div class="btnBox" v-if="showMoreFlag == true">
				<el-button type="primary" @click="navTo('/bili')">B站视频下载</el-button>
			</div> -->
			<div class="btnBox">
				<el-button type="primary" @click="navTo('/recoAbbr')">缩写识别</el-button>
			</div>
			<div class="btnBox">
				<el-button type="primary" @click="navTo('/ai')">人工智能OCR</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { genRanStr } from "@/utils/getRandomStr"
import { setStorage, getStorage, removeStorage } from "@/utils/cusLocStorage"
export default {
	data() {
		return {
			showMoreFlag: false
		}
	},
	mounted() {
		this.initToken()
	},
	methods: {
		navTo(path) {
			this.$router.push(path)
		},
		initToken() {
            let showMoreFlag = getStorage('showMoreFlag')
            if(showMoreFlag){
                this.showMoreFlag = showMoreFlag
            }
		},
		showMore() {
			this.$prompt("", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消"
			})
				.then(({ value }) => {
					if (value == "qq") {
                        setStorage("showMoreFlag", true)
                        this.showMoreFlag = true
					}
				})
				.catch(() => {})
		}
	}
}
</script>

<style lang="scss" scoped>
.homeContent {
	background-image: url("https://api.bingdou.net/pic/bing/");
	background-size: cover;
	background-repeat: no-repeat;
	background-position: 50% 50%;
	height: 100%;
	.buttonContent {
		height: 100%;
		padding: 2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-content: center;
		position: relative;
		.logOff {
			text-align: right;
			position: absolute;
			top: 0.8rem;
			right: 0.8rem;
			font-style: 1rem;
		}
		.btnBox {
			width: 50%;
			height: 100px;
			overflow: hidden;
			padding: 10px;
			.el-button {
				width: 100%;
				height: 100%;
				border-radius: 10px;
				font-size: 1.2rem;
				white-space: pre-wrap;
				padding: 10px;
			}
		}
	}
}
</style>
