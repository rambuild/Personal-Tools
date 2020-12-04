<template>
	<div class="AiImage">
		<div class="imageBox">
			<div class="title">
				<el-button type="warning" class="back" @click="$router.go(-1)">返回</el-button>
				<h2>{{ title }}</h2>
			</div>
			<div class="contentBox">
				<el-upload
					:action="uploadPath"
					:show-file-list="false"
					:on-success="onSuccess"
					:on-error="onError"
					:before-upload="beforeUpload"
					:auto-upload="true"
					:data="uploadData"
					:disabled="uploadData.method == 'notAvaliable'"
				>
					<el-button
						type="primary"
						class="uploadBtn"
						:disabled="uploadData.method == 'notAvaliable'"
						v-loading="loading"
						>点击上传</el-button
					>
				</el-upload>
				<!-- 未提供识别方法专有组件 -->
				<div class="notAvaliable" v-if="uploadData.method == 'notAvaliable'">
					<h2 style="color:#F56C6C">暂不提供该功能</h2>
				</div>
				<!-- 身份证识别专有组件 -->
				<div class="idCard" v-if="uploadData.method == 'idcard'">
					<el-switch
						style="display: block"
						v-model="id_card_side"
						active-color="#13ce66"
						inactive-color="rgb(255,131,68)"
						active-value="back"
						inactive-value="front"
						active-text="国徽页"
						inactive-text="照片页"
					>
					</el-switch>
				</div>
				<div class="imgBox" v-if="imageUrl !== ''">
					<img :src="imageUrl" />
				</div>
				<v-result :resultData="result" :resultFormat="resFormat.second" v-show="Object.keys(result).length > 0">
				</v-result>
			</div>
		</div>
	</div>
</template>

<script>
import getToken from "@/utils/getAccessToken"
import image2Base64 from "@/utils/image2Base64"
import vResult from "@/components/recoResult"
import { judgeClassify, judgeVersion } from "@/utils/AIjudge"
export default {
	components: {
		vResult
	},
	data() {
		return {
			title: "",
			imageUrl: "",
			result: {},
			method: "",
			uploadData: {
				classify: "",
				apiVersion: "",
				method: "",
				params: ""
			},
			resFormat: {},
			uploadPath: "https://api.rambuild.cn/tools/upload",
			// uploadPath: "http://localhost:9090/upload",
			id_card_side: "",
			loading: false
		}
	},
	created() {
		this.title = this.$route.params.title
		this.uploadData.method = this.$route.params.method
		let curMethod = this.uploadData.method
		// 判断类别
		this.uploadData.classify = judgeClassify(curMethod)
		// 判断api版本
		this.uploadData.apiVersion = judgeVersion(curMethod)
		// 格式化组件数据
		if (this.$store.state.hasOwnProperty(curMethod)) {
			let { resFormat } = this.$store.state[curMethod]
			this.resFormat = resFormat
			// console.log("有", resFormat)
		} else {
			let { resFormat } = this.$store.state.generalFormat
			this.resFormat = resFormat
			// console.log("无", resFormat)
		}
	},
	watch: {
		id_card_side(val) {
			this.uploadData.params = JSON.stringify({
				id_card_side: val
			})
		}
	},
	methods: {
		async getData(base64Str) {
			let token = "24.8218724ff333492df402dc524d2861bd.2592000.1603642114.282335-22758949"
			let params = new URLSearchParams()
			let base64Image = ""
			params.append("image", base64Str)
			// params.append("id_card_side", "front")
			let { data: res } = await this.$http({
				method: "POST",
				url: `https://aip.baidubce.com/rest/2.0/ocr/v1/${this.method}?access_token=${token}`,
				data: params,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			})
			if (!res.error_code) {
				this.result = res.words_result
				this.$msg("success", "识别成功")
			} else {
				this.$msg("error", `${res.error_msg}，${res.error_code}`)
			}
		},
		beforeUpload(file) {
			const isJPG = file.type.includes("image")
			const isLt2M = file.size / 1024 / 1024 < 3
			if (!isJPG) {
				this.$msg("error", "只允许上传图片！")
			}
			if (!isLt2M) {
				this.$msg("error", "上传头像图片大小不能超过 3MB!")
			}
			this.loading = true
			return isJPG && isLt2M
		},
		onSuccess(res) {
			this.imageUrl = res.file.url
			if (!res.baiduOcrRes.error_code) {
				this.result = res.baiduOcrRes[this.resFormat.top]
				this.$msg("success", "识别成功")
				this.loading = false
			} else {
				this.loading = false
				this.$msg("error", `${res.baiduOcrRes.error_msg}，${res.baiduOcrRes.error_code}`, 3000)
			}
		},
		onError() {
			this.loading = false
			this.$msg("error", "上传失败")
		}
	}
}
</script>

<style lang="scss" scoped>
.AiImage {
	color: #fff;
	max-width: 760px;
	margin: 0 auto;
	.imageBox {
		margin: 4rem auto;
		position: relative;
		width: 95%;
		h2 {
			text-align: center;
		}
	}
	.back {
		position: absolute;
		top: 0;
		left: 0;
		width: 80px !important;
		padding: 10px !important;
		z-index: 1000;
	}
	.contentBox {
		.uploadBtn {
			width: 80%;
			border-radius: 20px;
			position: fixed;
			bottom: 5%;
			left: 0;
			right: 0;
			margin: 0 auto;
			z-index: 2000;
		}
		.imgBox {
			text-align: center;
			position: relative;
			top: -20px;
			img {
				width: 100%;
				border-radius: 6px;
			}
		}
		/deep/ .idCard {
			margin-bottom: 2rem;
			.el-switch {
				text-align: center;
				.el-switch__label {
					color: #fff;
					font-weight: bold;
				}
				.el-switch__core {
					width: 45px !important;
				}
				.el-switch__label.is-active {
					color: rgb(64, 158, 255);
				}
				.el-switch__label * {
					font-size: 16px;
				}
			}
		}
	}
	/deep/ .el-loading-mask {
		border-radius: 25px;
	}
}
</style>
