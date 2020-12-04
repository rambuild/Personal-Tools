<template>
	<div class="content">
		<el-button type="warning" class="searchHistory" @click="showDrawer">查询历史</el-button>
		<el-form :rules="formRules" :model="formData" ref="formRef">
			<el-form-item label="网址：" label-width="65px" prop="videLinks">
				<el-input v-model="formData.videLinks" clearable ref="inputRef"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="sendRequest" v-loading="loading">确定</el-button>
			</el-form-item>
		</el-form>
		<div class="receiveContent">
			<div class="imgBox">
				<img :src="videoDetails.coverPic" />
			</div>
			<div class="videoTitle">{{ videoDetails.title }}</div>
			<div class="videoSrc">
				<el-link type="primary" :href="videoDetails.lowQualitySrc" target="_blank" download="360P.mp4">{{
					videoDetails.lowQualityInfo
				}}</el-link>
				<el-link type="warning" :href="videoDetails.highQualitySrc" target="_blank" download="1080P.mp4">{{
					videoDetails.highQualityInfo
				}}</el-link>
			</div>
		</div>
		<!-- 查询历史记录 -->
		<div class="drawerBox">
			<el-drawer title="查询历史" :visible.sync="drawerVisible" direction="ltr">
				<div class="clearHistory" v-show="searchList.length > 0">
					<span @click="clearHistory">删除历史记录</span>
				</div>
				<ul class="historyItem">
					<li v-for="(i, index) in searchList" :key="index" @click="searchFromList(i)">
						<div>{{ index + 1 }}. {{ i.videoName }}</div>
					</li>
				</ul>
			</el-drawer>
		</div>
	</div>
</template>
<script>
import { setStorage, getStorage, removeStorage } from "@/utils/cusLocStorage"
export default {
	data() {
		var checkvideoLink = (rule, val, callback) => {
			if (!val.trim()) {
				return callback(new Error("请输入视频网址！"))
			}
			let urlReg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
			if (urlReg.test(val)) {
				// 网址合法
				return callback()
			}
			callback(new Error("请输入正确的网址"))
		}
		return {
			formData: {
				videLinks: ""
			},
			formRules: {
				videLinks: [
					{
						required: true,
						trigger: "change",
						validator: checkvideoLink
					}
				]
			},
			videoDetails: {
				coverPic: "",
				title: "",
				lowQualitySrc: "",
				lowQualityInfo: "",
				highQualitySrc: "",
				highQualityInfo: ""
			},
			loading: false,
			drawerVisible: false,
			searchList: []
		}
	},
	mounted() {
		this.$refs.inputRef.focus()
	},
	methods: {
		sendRequest() {
			this.$refs.formRef.validate(async valid => {
				if (!valid) {
					return
				} else {
					this.loading = true
					let { data: res } = await this.$http({
						method: "POST",
						url: "https://api.rambuild.cn/tools/biliVideoDownload",
						data: {
							url: this.formData.videLinks
						}
					})
					this.loading = false
					if (res.code == 0) {
						// 添加到历史记录
						let pushFlag = true
						this.searchList.forEach(i => {
							// 如果查询的内容与数组中的某项一致则不添加
							if (i.videoName == res.name) {
								return (pushFlag = false)
							}
						})
						if (pushFlag) {
							this.searchList.push({
								videoName: res.name,
								url: this.formData.videLinks
							})
							setStorage("queryBiliVideo", this.searchList)
						}
						this.$msg("success", res.msg)
						let listAttr = Object.keys(res.list)
						listAttr.forEach(i => {
							if (i.indexOf("流畅") > -1) {
								this.videoDetails.lowQualitySrc = res.list[i].url
								this.videoDetails.lowQualityInfo = res.list[i].name
							} else if (i.indexOf("高清") > -1) {
								this.videoDetails.highQualitySrc = res.list[i].url
								this.videoDetails.highQualityInfo = res.list[i].name
							}
						})
						this.videoDetails.coverPic = res.list.视频封面.url
						this.videoDetails.title = res.name
					} else {
						this.$msg("error", res.msg)
					}
				}
			})
		},
		showDrawer() {
			this.drawerVisible = true
			// 载入搜索历史记录
			let queryBiliVideo = getStorage("queryBiliVideo")
			if (queryBiliVideo) {
				this.searchList = queryBiliVideo
			}
		},
		clearHistory() {
			this.$confirm("确定删除历史记录？", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					// 清除搜索历史
					this.searchList = []
					removeStorage("queryBiliVideo")
					this.$msg("success", "删除成功")
				})
				.catch(() => {})
		},
		searchFromList(i) {
			this.drawerVisible = false
			// 选择的链接不一样才搜索
			if (i.url != this.formData.goodsLink) {
				this.formData.videLinks = i.url
				this.sendRequest()
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.content {
	.searchHistory {
		position: absolute;
		top: 2%;
		right: 3%;
		width: 80px !important;
		padding: 10px !important;
	}
	padding: 4rem 0;
	/deep/ .el-form {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		.el-form-item {
			width: 90%;
			position: relative;
			label {
				color: #fff;
			}
			.el-button {
				width: 100%;
			}
			.el-input {
				input {
					line-height: 16px;
				}
			}
		}
	}
	.receiveContent {
		width: 90%;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.imgBox {
			overflow: hidden;
			img {
				width: 100%;
				border-radius: 10px;
				// box-shadow: 0 0 5px #999;
			}
		}
		.videoTitle {
			padding-top: 0.5rem;
			color: #fff;
			text-align: center;
			width: 100%;
		}
		.videoSrc {
			padding-top: 0.5rem;
			text-align: center;
			/deep/ span {
				margin: 0.3rem;
				font-size: 20px;
			}
		}
	}
	.drawerBox {
		/deep/ .el-drawer {
			width: 60% !important;
			outline: none;
			overflow-y: scroll;
			overflow-x: hidden;
			background-color: rgba(255, 255, 255, 1);
			.clearHistory {
				text-align: right;
				padding: 0 1rem;
				font-size: 13px;
				color: rgb(233, 27, 61);
				cursor: pointer;
			}
			.el-drawer__header {
				padding: 20px 5px 0 20px;
			}
			.el-drawer__header > span {
				outline: none;
				text-align: center;
				text-indent: 20px;
			}
		}
		.historyItem {
			font-size: 14px;
			list-style: none;
			padding: 0 1rem;
			text-align: justify;
			padding-bottom: 1rem;
			li {
				margin-bottom: 0.6rem;
				line-height: 18px;
				cursor: pointer;
			}
		}
	}
}
</style>
