<template>
	<div class="veeeContent">
		<transition name="fade">
			<div class="box">
				<el-form :rules="formRules" :model="formData" ref="emailForm">
					<el-form-item prop="email">
						<el-input
							placeholder="输入或随机生成邮箱"
							v-model="formData.email"
							ref="inpuBox"
							clearable
						></el-input>
					</el-form-item>
				</el-form>
				<el-alert title="密码均为：123456" type="warning" :closable="false" show-icon></el-alert>
				<el-button type="primary" @click="ranRegEmail">随机生成邮箱</el-button>
				<el-button type="danger" @click="register" v-loading="loading">注册Veee</el-button>
				<el-button
					type="primary"
					v-clipboard:copy="formData.email"
					v-clipboard:success="onCopy"
					v-clipboard:error="copyOnError"
					>复制邮箱到剪切板</el-button
				>
			</div>
		</transition>
	</div>
</template>

<script>
import validTime from "@/utils/getValidTime"
import { genRanStr, genRanEmail } from "@/utils/getRandomStr"

export default {
	data() {
		//    邮箱的自定义验证规则
		var checkEmail = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("请输入邮箱！"))
			}
			const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

			if (emailReg.test(value)) {
				//   邮箱合法
				return callback()
			}
			callback(new Error("请输入正确的邮箱！"))
		}

		return {
			emailVerify: false,
			formData: {
				email: ""
			},
			formRules: {
				email: [
					{
						required: true,
						trigger: "change",
						validator: checkEmail
					}
				]
			},
			loading: false,
			// copyFlag: false,
			// registedEmail: ""
		}
	},
	methods: {
		onCopy(e) {
			this.$message.success({
				message: "当前邮箱已复制",
				duration: 1500,
				center: true
			})
		},
		copyOnError() {
			this.$message.error({
				message: "复制失败，请重试",
				duration: 1500,
				center: true
			})
		},
		async register() {
			let fingerPrint = `${genRanStr(8)}-${genRanStr(4)}-${genRanStr(4)}-${genRanStr(4)}-${genRanStr(12)}`
			let params = {
				ref: "199d382",
				account: this.formData.email,
				password: "123456",
				fingerprint: fingerPrint,
				action: "inviteReg"
			}
			this.$refs.emailForm.validate(valid => {
				if (!valid) {
					return
				} else {
					this.loading = true
					this.$http({
						method: "POST",
						params,
						url: "https://api.rambuild.cn/tools/veeeApi",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					}).then(res => {
						this.loading = false
						// console.log(res.data)
						if (res.data.code === 200) {
							this.$message.success({
								message: `注册成功！有效期至：${validTime()}，uid：${res.data.data.userId}。`,
								duration: 6000,
								center: true
							})
							// this.registedEmail = this.formData.email
							// this.copyFlag = true
						} else {
							this.$message.error({
								message: `注册失败,错误码：${JSON.stringify(res.data.code)},请换个邮箱重试。`,
								center: true
							})
							this.formData.email = ""
							this.$refs.inpuBox.focus()
						}
					})
				}
			})
		},
		ranRegEmail() {
			let ranEmail = `${genRanStr(8)}@${genRanEmail()}.com`
			this.formData.email = ranEmail
			// this.register()
		}
	}
}
</script>

<style lang="scss" scoped>
.veeeContent {
	height: 100%;
	background-color: rgb(71, 81, 100);
	.box {
		height: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		align-content: center;
		.el-form,
		.el-button,
		.el-alert {
			width: 80%;
			margin-bottom: 20px;
			margin-left: 0;
		}
		.el-form-item {
			margin-bottom: 0;
		}
		/deep/ .el-loading-mask {
			background-color: rgba(255, 255, 255, 0.3);
		}
	}
}

.fade-enter,
.fade-leave-to {
	transform: scale(1.3);
}
.fade-enter-active {
	transition: transform 0.2s ease-in;
}
</style>
