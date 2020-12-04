<template>
	<div class="content">
		<el-button type="warning" class="searchHistory" @click="showDrawer">查询历史</el-button>
		<el-form :rules="formRules" :model="formData" ref="formRef">
			<el-form-item label="网址：" label-width="65px" prop="videoLinks">
				<el-input v-model="formData.videoLinks" clearable ref="inputRef"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="sendRequest" v-loading="loading">确定</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="danger" @click="$refs.formRef.resetFields()">清空</el-button>
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
				<ul class="historyItem">
					<li v-for="(i, index) in searchList" :key="index">
						<div class="itemBox">
							<span @click="searchFromList(i)" class="listText">{{ index + 1 }}. {{ i.videoName }}</span>
							<span @click="delItem(i)" class="delText">删除</span>
						</div>
					</li>
				</ul>
			</el-drawer>
		</div>
	</div>
</template>
<script>
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
				videoLinks: ""
			},
			formRules: {
				videoLinks: [
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
		this.getSearchList()
	},
	methods: {
		async sendRequest() {
			this.$refs.formRef.validate(async valid => {
				if (!valid) {
					return
				} else {
					this.loading = true
					let { data: res } = await this.$http({
						method: "POST",
						url: "https://api.rambuild.cn/tools/biliVideoDownload",
						data: {
							url: this.formData.videoLinks
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
							await this.saveSearchItem(res.name)
							await this.getSearchList()
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
						this.$msg("error", "解析失败")
					}
				}
			})
		},
		showDrawer() {
			this.drawerVisible = true
			this.getSearchList()
		},
		// 获取搜索记录
		async getSearchList() {
			let { data: searchList } = await this.$http.get("https://api.rambuild.cn/tools/getBiliVideo")
			this.searchList = searchList
		},
		// 保存搜索结果
		async saveSearchItem(videoName) {
			let { data: res } = await this.$http({
				method: "POST",
				url: "https://api.rambuild.cn/tools/saveBiliVideo",
				data: {
					videoName,
					url: this.formData.videoLinks
				}
			})
			if (res.status == 200) {
				this.$msg("success", "搜索记录存储成功")
			} else {
				this.$msg("error", "搜索记录存储失败")
			}
		},
		// 删除单项搜索记录
		delItem(i) {
			this.$prompt("", "验证码", {
				confirmButtonText: "确定",
				cancelButtonText: "取消"
			})
				.then(async ({ value }) => {
					let { data: res } = await this.$http.delete(
						`https://api.rambuild.cn/tools/delBiliVideo?url=${i.url}&verifyCode=${value}`
					)
					if (res.status == 200) {
						this.$msg("success", "删除成功")
						this.getSearchList()
					} else {
						this.$msg("error", res.msg)
					}
				})
				.catch(() => {})
		},
		searchFromList(i) {
			this.drawerVisible = false
			// 选择的链接不一样才搜索
			if (i.url != this.formData.videoLinks) {
				this.formData.videoLinks = i.url
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
			.itemBox {
				display: flex;
				justify-content: space-between;
				.listText {
					width: 80%;
					text-align: justify;
				}
				.delText {
					width: 15%;
					color: red;
					display: flex;
					justify-content: flex-end;
					align-items: center;
				}
			}
			li {
				margin-bottom: 0.6rem;
				line-height: 18px;
				cursor: pointer;
			}
		}
	}
}
</style>
