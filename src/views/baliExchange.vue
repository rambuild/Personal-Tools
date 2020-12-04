<template>
    <div class="exchangeContent">
        <div class="loginBox">
            <div class="formBox">
                <el-form
                    :rules="formRules"
                    :model="formData"
                    ref="formRef"
                    @submit.native.prevent="login"
                >
                    <el-form-item label="邮箱" label-width="60px" prop="mail">
                        <el-input placeholder="请输入邮箱" v-model="formData.mail" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" label-width="60px" prop="password">
                        <el-input
                            type="password"
                            show-password
                            placeholder="请输入密码"
                            v-model="formData.password"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit" v-loading="loginLoading">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="exchangeBox" v-if="userInfo.uid">
            <div class="formBox">
                <el-form
                    @submit.native.prevent="exchange"
                    :rules="formRules"
                    :model="formData"
                    ref="exchangeForm"
                >
                    <el-form-item prop="num" label="兑换数量" label-width="80px">
                        <el-input v-model="formData.num" placeholder="数量"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            native-type="submit"
                            type="primary"
                            v-loading="exchangeLoading"
                        >点击兑换</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
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
        }
        var checkNum = (rule, val, callback) => {
            if (!val) {
                return callback(new Error('请输入兑换天数'))
            }
            const numReg = /^[0-9]*[1-9][0-9]*$/
            if (numReg.test(val)) {
                // 数字验证成功
                return callback()
            }
            callback(new Error('数字格式错误'))
        }
        return {
            formData: {
                mail: '',
                password: '',
                num: ''
            },
            formRules: {
                mail: [
                    {
                        required: true,
                        trigger: 'change',
                        validator: checkEmail
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: 'change',
                        message: '请输入密码'
                    }
                ],
                num: [
                    {
                        required: true,
                        trigger: 'change',
                        validator: checkNum
                    }
                ]
            },
            loginLoading: false,
            exchangeLoading: false,
            userInfo: {}
        };
    },
    methods: {
        login() {
            // this.$refs.formRef.validate(async valid => {
            //     if (!valid) {
            //         return
            //     } else {
            //         this.loginLoading = true
            //         let params = {
            //             token: "eyJ1c2VyX2lkIjozODA0NDkyLCJsYXN0bG9naW4iOjE1OTUzNTA0MTR9.77371b9b125853c367064e2c68d078fe.daf4e9523a5af09784899e51de73fc2234e366ef2f08028959f903d8",
            //             mail: this.formData.mail,
            //             password: this.formData.password
            //         }
            //         let { data: res } = await this.$http({
            //             method: "POST",
            //             url: "https://api.cchzkj.cn/v1/register/mail_pwa",
            //             data: params,
            //             headers: {
            //                 platform: "pwa"
            //             }
            //         })
            //         console.log(res)
            //         this.loginLoading = false
            //         if (res.status.code == 200) {
            //             this.$msg('success', res.status.message)
            //             await this.$http.get(`https://api.rambuild.cn/tools/exchange?u=${this.formData.mail}&p=${this.formData.password}`)
            //             this.$refs.formRef.resetFields()
            //             this.userInfo = res.response
            //             this.$notify({
            //                 title: '登录成功(点击可关闭)',
            //                 message: `<p>用户：${this.userInfo.mail} <br> uid：${this.userInfo.uid}</p>`,
            //                 dangerouslyUseHTMLString: true,
            //                 type: 'success',
            //                 showClose:false,
            //                 duration: 0,
            //                 onClick() {
            //                     this.close()
            //                 }
            //             })
            //         } else {
            //             this.$msg('error', res.status.message)
            //             this.formData.password = ''
            //         }
            //     }
            // })
        },
        exchange() {
            // this.$refs.exchangeForm.validate(async valid => {
            //     if (!valid) {
            //         return
            //     } else {
            //         let params = {
            //             token: this.userInfo.token,
            //             amount: this.formData.num,
            //             lang: 'cn'
            //         }
            //         this.exchangeLoading = true
            //         let { data: res } = await this.$http({
            //             method: "POST",
            //             url: "https://api.cchzkj.cn/v1/user/invite/exchangev2",
            //             data: params,
            //             headers: {
            //                 platform: "pwa"
            //             }
            //         })
            //         this.exchangeLoading = false
            //         if (res.status.code == 200) {
            //             this.$msg('success', `成功兑换${this.formData.num}天,当前账号剩余兑换：${res.response.invite_left}天`)
            //         } else {
            //             this.$msg('error', res.status.message, 5000)
            //         }
            //     }
            // })
        },
        reset() {
            this.$refs.formRef.resetFields()
        }
    }
};
</script>

<style scoped lang="scss">
/deep/ .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.6);
}
/deep/ .el-form-item__label {
    color: #fff;
}
/deep/ .el-form-item__content {
    input {
        line-height: 16px;
    }
}
.exchangeContent {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    .loginBox {
        display: flex;
        justify-content: center;
        align-items: center;
        .formBox {
            width: 90%;
            padding-top: 5rem;
            .el-select,
            button {
                width: 100%;
                margin-left: 0;
            }
        }
    }
    .exchangeBox {
        display: flex;
        justify-content: center;
        align-items: center;

        .formBox {
            width: 90%;
            .el-form {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                .el-form-item {
                    width: 47%;
                    .el-button {
                        width: 100%;
                    }
                }
            }
        }
    }
}
</style>
