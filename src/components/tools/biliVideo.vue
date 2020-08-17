<template>
    <div>
        <div>
            <div class="btnGroup">
                <el-button type="primary" @click="start">开始</el-button>
                <el-button type="primary" @click="pause">{{pauseFlag?'继续':'暂停'}}</el-button>
                <el-button type="primary" @click="part">分段</el-button>
                <el-button type="danger" @click="clear">停止</el-button>
            </div>
            <div class="timeList">
                <div class="listBox">
                    <p>总用时：{{curTime | formateTime}}</p>
                    <p>提问时间：{{askTime | formateTime}}</p>
                    <p>思考时间：{{thkTime | formateTime}}</p>
                    <p>回答时间：{{ansTime | formateTime}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            curTime: 0,
            askTime: 0,
            thkTime: 0,
            ansTime: 0,
            tmpTime: 0,
            interval: null,
            pauseFlag: false
        }
    },
    filters: {
        formateTime(val) {
            if (val < 60) {
                let second = (val + '').padStart(2, '0')
                return `00:${second}`
            } else {
                let min = (Math.floor(val / 60) + '').padStart(2, '0')
                let second = ((val % 60) + '').padStart(2, '0')
                return `${min}:${second}`
            }
        }
    },
    methods: {
        start() {
            this.interval = setInterval(() => {
                this.curTime += 1
            }, 1000)
        },
        part() {
            if (this.askTime == 0) {
                this.tmpTime = this.curTime
                this.askTime = this.tmpTime
            } else if (this.thkTime == 0) {
                this.thkTime = (this.curTime - this.tmpTime)
                this.tmpTime = this.curTime
            } else {
                this.ansTime = this.curTime - this.tmpTime
            }
        },
        pause() {
            this.pauseFlag = !this.pauseFlag
            if (this.pauseFlag) {
                clearInterval(this.interval)
            } else {
                this.start()
            }
        },
        clear() {
            clearInterval(this.interval)
            this.curTime = 0
            this.askTime = 0
            this.thkTime = 0
            this.ansTime = 0
            this.tmpTime = 0
        }
    }
}
</script>
<style lang="scss" scoped>
.timeList {
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 1rem;
    p {
        width: 100%;
        text-align: right;
    }
}
.btnGroup {
    margin-top: 8rem;
    display: flex;
    justify-content: center;
}
</style>