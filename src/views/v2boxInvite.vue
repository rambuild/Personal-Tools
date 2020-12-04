<template>
    <div class="veeeContent">
        <div class="box">
            <el-alert title="密码均为12345678，验证码会自动输入" type="warning" :closable="false" show-icon></el-alert>
            <el-form :rules="formRules" :model="formData" ref="emailForm">
                <el-form-item prop="email">
                    <el-input
                        placeholder="请点击随机生成邮箱"
                        v-model="formData.email"
                        ref="inpuBox"
                        clearable
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item class="email_code" prop="email_code">
                    <el-input
                        v-model="formData.email_code"
                        placeholder="验证码"
                        clearable
                        maxlength="6"
                        show-word-limit
                    ></el-input>
                    <el-button
                        type="primary"
                        @click="sendEmailCode"
                        v-loading="codeLoading"
                        :disabled="codeBthDisabled"
                    >发送验证码</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="ranRegEmail">随机生成邮箱</el-button>
            <el-button type="danger" @click="register" v-loading="loading">注册V2box</el-button>
            <el-button
                type="primary"
                v-clipboard:copy="formData.email"
                v-clipboard:success="onCopy"
                v-clipboard:error="copyOnError"
            >复制邮箱到剪切板</el-button>
            <el-button
                type="danger"
                @click="toSR"
                :disabled="!jumpFlag"
                v-loading="loginLoading"
            >跳转到Shadowrocket</el-button>
        </div>
    </div>
</template>

<script>
import validTime from '@/utils/getValidTime'
import { genRanStr, genRanEmail } from '@/utils/getRandomStr'
import delay from '@/utils/delay'
export default {
    data() {
        //    邮箱的自定义验证规则
        var checkEmail = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入邮箱！"));
            }
            const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

            if (emailReg.test(value)) {
                //   邮箱合法
                return callback();
            }
            callback(new Error("请输入正确的邮箱！"));
        };
        var checkEmailCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入验证码！"));
            }
            const codeReg = /[0-9]{6}/
            if (codeReg.test(value)) {
                return callback()
            }
            callback(new Error('验证码为6位数字'))
        };
        return {
            emailVerify: false,
            formData: {
                email: '',
                email_code: '666666'
            },
            formRules: {
                email: [{
                    required: true,
                    trigger: 'change',
                    validator: checkEmail
                }],
                email_code: [{
                    required: true,
                    trigger: 'change',
                    validator: checkEmailCode
                }]
            },
            loading: false,
            loginLoading: false,
            jumpFlag: false,
            codeLoading: false,
            codeBthDisabled: false
        }
    },
    methods: {
        onCopy(e) {
            this.$msg('success', '邮箱已复制到剪切板')
        },
        copyOnError() {
            this.$msg('error', '复制失败，请重试')
        },
        register() {
            let params = {
                email: this.formData.email,
                password: '12345678',
                invite_code: "842fcJd7", //zjl@163.com
                email_code: this.formData.email_code
            }
            this.$refs.emailForm.validate(valid => {
                if (!valid) {
                    return
                } else {
                    this.loading = true
                    this.$http({
                        method: 'POST',
                        params,
                        url: 'https://v2box.org/api/v1/passport/auth/register',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(res => {
                        this.loading = false
                        if (res.data.data) {
                            this.$http.get('https://api.rambuild.cn/tools/v2boxTimes') // 计次api
                            this.$message.success({
                                message: `注册成功！有效期至：${validTime()}`,
                                duration: 6000,
                                center: true
                            })
                            this.jumpFlag = true
                        }
                    }).catch(err => {
                        this.loading = false
                        this.$refs.emailForm.resetFields()
                    })
                }
            })
        },
        ranRegEmail() {
            let ranEmail = `${genRanStr(10)}@${genRanEmail('tmpEmail')}`
            this.formData.email = ranEmail
            // this.register()
        },
        async sendEmailCode() {
            if (this.formData.email == '') {
                this.$msg('info', '邮箱不能为空')
            } else {
                this.codeLoading = true
                this.codeBthDisabled = true
                let emailPrefix = (this.formData.email).slice(0, 10)
                // 临时邮箱激活
                let { data: res1 } = await this.$http.get(`https://api.rambuild.cn/tools/v2box/activeEmail?email=${emailPrefix}`)
                if (res1.status == 200) {
                    // 发送v2box邮箱验证码
                    let { data: res2 } = await this.$http({
                        method: 'POST',
                        url: 'https://v2box.org/api/v1/passport/comm/sendEmailVerify',
                        params: {
                            email: this.formData.email
                        }
                    })
                    // 邮箱验证码发送成功
                    if (res2.data == true) {
                        this.$msg('success', '验证码发送成功，将会尝试获取验证码', 2000)
                        // 延迟3秒
                        await delay(3000)
                        this.$msg('info', `第1次尝试获取验证码`, 1000)
                        var { data: res3 } = await this.getEmailState(emailPrefix)
                        for (let i = 0; i < 9; ++i) {
                            if (res3.data.length == 0) {
                                await delay(3000)
                                this.$msg('info', `第${i + 2}次尝试获取验证码`, 1000)
                                var { data: res3 } = await this.getEmailState(emailPrefix)
                            } else {
                                // 接收到邮件
                                let emailID = res3.data[0].id
                                // 获取邮件内容
                                let { data: res4 } = await this.getEmailContent(emailPrefix, emailID)
                                let codeModule = /[0-9]{6}=/
                                // 筛选出验证码
                                let emailCode = res4.data.match(codeModule)[0].slice(0, 6)
                                this.formData.email_code = emailCode
                                this.$msg('success', `验证码获取成功`)
                                this.codeLoading = false
                                this.codeBthDisabled = false
                                return
                            }
                        }
                        if (res3.data.length == 0) {
                            this.codeLoading = false
                            this.codeBthDisabled = false
                            this.$msg('error', '验证码获取超时，请重试')
                        }
                    }
                    this.codeLoading = false
                    this.codeBthDisabled = false
                }
            }
        },
        getEmailState(emailPrefix) {
            return this.$http.get(`https://api.rambuild.cn/tools/v2box/getEmailState?emailPrefix=${emailPrefix}`)
        },
        getEmailContent(emailPrefix, emailID) {
            return this.$http.get(`https://api.rambuild.cn/tools/v2box/getEmailContent?emailPrefix=${emailPrefix}&emailID=${emailID}`)
        },
        async toSR() {
            // 登陆v2box获取token
            this.loginLoading = true
            let token = ''
            let params = {
                email: this.formData.email,
                password: '12345678'
            }
            let { data: res } = await this.$http({
                method: 'POST',
                params,
                url: 'https://v2box.org/api/v1/passport/auth/login',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            // console.log(res)
            if (res) {
                this.loginLoading = false
                token = res.data.token
                let subscribe_url = `https://v2.ymcb.net/api/v1/client/subscribe?token=${token}`

                // 对"subscribe_url"字符串转化base64编码
                var encode = encodeURI(subscribe_url);
                var b64_subscribe_url = btoa(encode)
                // 将base64编码中的'=='截去
                b64_subscribe_url = b64_subscribe_url.substr(0, b64_subscribe_url.length - 2);
                // console.log(b64_subscribe_url)
                let path = `shadowrocket://add/sub://${b64_subscribe_url}?remark=lbwnb!`
                // console.log(path)
                window.open(path, '_self')
            }
            this.loginLoading = false
        }
    }
}
</script>

<style lang='scss' scoped>
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
        /deep/ .el-form-item {
            margin-bottom: 0;
            input {
                line-height: 16px;
            }
        }
        /deep/ .el-loading-mask {
            background-color: rgba(255, 255, 255, 0.3);
        }
        .email_code {
            /deep/ .el-form-item__content {
                display: flex;
                margin-top: 20px;
                .el-input {
                    width: 60%;
                    margin-right:1rem;
                    input {
                        line-height: 16px;
                    }
                }
                .el-button {
                    width: 40%;
                    margin: 0;
                    white-space: pre-wrap;
                }
            }
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