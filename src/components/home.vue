<template>
    <div class="homeContent">
        <div class="wraper" v-show="wrapperFlag">
            <el-button type="danger" @click="initToken">请输入正确的验证码</el-button>
        </div>
        <div class="buttonContent" v-show="!wrapperFlag">
            <el-button type="primary" class="buttons" @click="navTo('/bili')">bili</el-button>
            <el-button type="primary" class="buttons" @click="navTo('/veee')">Veee</el-button>
            <el-button type="primary" class="buttons v2box" @click="navTo('/v2box')">V2box</el-button>
        </div>
    </div>
</template>

<script>
import { genRanStr } from '@/utils/getRandomStr'
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
            let flag = window.sessionStorage.getItem('verifyFlag')
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
                        window.sessionStorage.setItem('verifyFlag', 'true')
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
    }
}
</script>

<style lang='scss' scoped>
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
.homeContent {
    overflow: hidden;
    height: 100%;
    .buttonContent {
        width: 100%;
        padding: 0 25px;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
    }
    .buttons {
        border-radius: 10px;
        width: 40%;
        height: 80px;
        padding: 10px;
        font-size: 1.2rem;
        margin: 0 10px 20px;
    }
}
</style>