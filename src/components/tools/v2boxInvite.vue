<template>
    <div class="veeeContent">
        <el-button type="primary" class="toHome" @click="toHome">返回首页</el-button>
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
            <el-alert title="密码均为：12345678" type="warning" :closable="false" show-icon></el-alert>
            <el-button type="primary" @click="ranRegEmail">随机生成邮箱</el-button>
            <el-button type="primary" @click="register" v-loading="loading">注册V2box</el-button>
            <el-button
                type="primary"
                v-clipboard:copy="registedEmail"
                v-clipboard:success="onCopy"
                v-clipboard:error="copyOnError"
                :disabled="!copyFlag"
            >复制邮箱到剪切板</el-button>
            <el-button
                type="danger"
                @click="toSR"
                :disabled="!copyFlag"
                v-loading="loginLoading"
            >跳转到Shadowrocket</el-button>
        </div>
    </div>
</template>

<script>
import validTime from '@/utils/getValidTime'
import { genRanStr, genRanEmail } from '@/utils/getRandomStr'
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

        return {
            emailVerify: false,
            formData: {
                email: ''
            },
            formRules: {
                email: [{
                    required: true,
                    trigger: 'change',
                    validator: checkEmail
                }]
            },
            loading: false,
            loginLoading: false,
            copyFlag: false,
            registedEmail: ''
        }
    },
    methods: {
        toHome() {
            this.$router.push('/')
        },
        onCopy(e) {
            this.$message.success({
                message: '邮箱已复制到剪切板',
                duration: 1500,
                center: true
            })
        },
        copyOnError() {
            this.$message.error({
                message: '复制失败，请重试',
                duration: 1500,
                center: true
            })
        },
        register() {
            let params = {
                email: this.formData.email,
                password: '12345678',
                invite_code: "842fcJd7" //zjl@163.com
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
                            this.registedEmail = this.formData.email
                            this.copyFlag = true
                        }
                    }).catch(err => {
                        this.loading = false
                        let errStr = err.toString()
                        let codeIndex = errStr.indexOf('code') //'code'在errMsg的index
                        let codeNum = errStr.slice(codeIndex + 5, codeIndex + 8) //取错误码的值
                        this.$message.error({
                            message: `错误码：${codeNum}，请换个邮箱重试。`,
                            duration: 6000,
                            center: true
                        })
                        this.formData.email = ''
                    })
                }
            })
        },
        ranRegEmail() {
            let ranEmail = `${genRanStr(8)}@${genRanEmail()}.com`
            this.formData.email = ranEmail
            // this.register()
        },
        async toSR() {
            // 登陆v2box获取token
            this.loginLoading = true
            let token = ''
            let params = {
                email: this.formData.email,
                password: '12345678'
            }
            let { data : res } = await this.$http({
                method: 'POST',
                params,
                url: 'https://v2box.org/api/v1/passport/auth/login',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            console.log(res)
            if (res) {
                this.loginLoading = false
                token = res.data.token
                let subscribe_url = `https://v2.ymcb.net/api/v1/client/subscribe?token=${token}`

                // 对"subscribe_url"字符串转化base64编码
                var encode = encodeURI(subscribe_url);
                var b64_subscribe_url = btoa(encode)
                // 将base64编码中的'=='截去
                b64_subscribe_url = b64_subscribe_url.substr(0, b64_subscribe_url.length - 2);
                console.log(b64_subscribe_url)
                let path = `shadowrocket://add/sub://${b64_subscribe_url}?remark=lbwnb!`
                console.log(path)
                window.open(path, '_self')
            }
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