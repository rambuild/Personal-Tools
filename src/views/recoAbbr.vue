<template>
	<div class="recoAbbr">
		<div class="content">
			<el-form @submit.native.prevent="search">
				<el-form-item>
					<el-alert title="本工具可查询网络缩写字母的含义" type="info" :closable="false" show-icon></el-alert>
				</el-form-item>
				<el-form-item>
					<el-input placeholder="请输入缩写字母" v-model="form.text" ref="inputRef" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" native-type="submit" v-loading="loading">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="resultBox">
			<div class="itemBox">
				<div class="item" v-for="(i, index) in result" :key="index">
					<p>
						<span class="keywords">{{ i.name }}</span>
					</p>
					<div class="tagBox">
						<el-tag v-for="(j, index2) in i.trans" :key="index2" :type="genRandomType()">
							<span @click="baiduSearch(j)">
								{{ j }}
							</span>
						</el-tag>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				text: ""
			},
			result: [],
			loading: false
		}
	},
	mounted() {
		this.$refs.inputRef.focus()
	},
	methods: {
		async search() {
			let params = {
				text: "qnmd"
			}
			this.loading = true
			let { data: res } = await this.$http({
				method: "POST",
				data: {
					text: this.form.text
				},
				url: "https://lab.magiconch.com/api/nbnhhsh/guess",
				headers: {
					"Content-Type": "application/json"
				}
			})
			if (res) {
				this.result = res
			} else {
				this.$msg("error", "发生错误")
			}
			this.loading = false
		},
		genRandomType() {
			let types = ["", "success", "info", "warning", "danger"]
			let randomNum = Math.floor(Math.random() * 5)
			return types[randomNum]
		},
		baiduSearch(word) {
			window.open(`https://www.baidu.com/s?wd=${word}`, "_blank")
		}
	}
}
</script>

<style lang="scss" scoped>
.content {
	padding: 4rem 0 0;
	display: flex;
	justify-content: center;
	/deep/ .el-form {
		width: 90%;
		input {
			line-height: 16px;
		}
		.el-button {
			width: 100%;
		}
	}
}
.resultBox {
	padding-bottom: 3rem;
	display: flex;
	justify-content: center;
	.itemBox {
		width: 90%;
		.item {
			.keywords {
				color: #fff;
				font-size: 24px;
				background-color: #f56c6c;
				padding: 0.5rem 0.6rem;
				border-radius: 6px;
				display: inline-block;
				text-align: center;
				font-weight: bold;
				width: 100%;
			}
			.tagBox {
				padding: 0 0.5rem;
				.el-tag {
					margin: 0.3rem;
					cursor: pointer;
					font-family: "microsoft yahei";
				}
			}
		}
	}
}
</style>
