<template>
    <div class="homeContent">
        <div class="wraper" v-show="wrapperFlag">
            <el-button type="danger" @click="initToken">请输入正确的验证码</el-button>
        </div>
        <div class="buttonContent" v-show="!wrapperFlag">
            <div class="logOff">
                <el-button type="danger" size="small" @click="logOff">注销</el-button>
            </div>
            <div class="btnBox">
                <el-button type="primary" @click="navTo('/bali')">bali</el-button>
            </div>
            <div class="btnBox">
                <el-button type="primary" @click="navTo('/veee')">Veee</el-button>
            </div>
            <div class="btnBox">
                <el-button type="primary" class="v2box" @click="navTo('/v2box')">V2box</el-button>
            </div>
            <div class="btnBox">
                <el-button type="primary" @click="navTo('/priceCompare')">电商比价</el-button>
            </div>
            <div class="btnBox">
                <el-button type="primary" @click="navTo('/biliVideo')">B站视频下载</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { genRanStr } from '@/utils/getRandomStr'
import { setStorage, getStorage, removeStorage } from '@/utils/cusLocStorage'
export default {
    data() {
        return {
            wrapperFlag: true
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
            let flag = getStorage('verifyFlag')
            if (!flag) {
                this.$prompt(`输入验证码：${genRanStr(4)}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'prompt',
                    inputType: 'password',
                    showClose: false
                }).then(res => {
                    if (res.value == 'qq') {
                        this.wrapperFlag = false
                        setStorage('verifyFlag', 'true')
                    } else {
                        this.$message.error({ message: "验证码错误", center: true, duration: 1500 })
                        this.initToken()
                    }
                }).catch(res => {
                    this.$message.error({ message: "请输入验证码", center: true, duration: 1500 })
                })
            } else {
                this.wrapperFlag = false
            }
        },
        logOff() {
            this.$confirm(`确定注销？`, '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                roundButton: true
            }).then(() => {
                removeStorage('verifyFlag')
                window.location.reload()
            }).catch(() => { })
        }
    }
}
</script>

<style lang='scss' scoped>
.homeContent {
    height: 100%;
    .wraper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(82, 82, 136, 1);
        z-index: 2001;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-button {
            width: 60%;
            padding: 15px;
        }
    }
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