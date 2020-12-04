<template>
    <div class="content">
        <el-button type="warning" class="addInviteCode" @click="addInviteCode">添加推荐码</el-button>
        <el-row>
            <el-col :span="4" v-loading="loading"></el-col>
        </el-row>
        <div class="formBox">
            <el-select
                v-model="selectValue"
                placeholder="选择推荐码"
                filterable
                remote
                :remote-method="filterInviteCode"
            >
                <el-option v-for="item in options" :key="item.value" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" @click="sendRequest" :disabled="buttonDisabled">手动开始</el-button>
            <el-button type="primary" @click="sendTimes(10)" :disabled="buttonDisabled">自动10次</el-button>
            <el-button type="primary" @click="sendTimes(20)" :disabled="buttonDisabled">自动20次</el-button>
            <el-button type="primary" @click="sendTimes(50)" :disabled="buttonDisabled">自动50次</el-button>
            <el-button
                type="danger"
                @click="infiniteTimes"
                :disabled="loopButtonDisabled"
            >{{ loopNow ? "取消无限循环" : "无限循环" }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options: [],
            codeList: [],
            selectValue: "",
            buttonDisabled: false,
            loopButtonDisabled: false,
            loopNow: false,
            interval: "",
            loading: false
        };
    },
    mounted() {
        this.getInviteCode()
    },
    methods: {
        async getInviteCode() {
            let { data: res } = await this.$http.get('https://api.rambuild.cn/tools/bali/inviteCode')
            console.log(res)
            this.codeList = res.codeList.map(i => {
                return { value: i }
            })
            this.options = this.codeList
        },
        filterInviteCode(v) {
            this.options = this.codeList.filter(i => {
                return i.value.toLowerCase().indexOf(v.toLowerCase()) > -1
            })
        },
        addInviteCode() {
            this.$prompt('请输入要添加的推荐码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[A-Z]{6}$/,
                inputErrorMessage: '只允许6位大写字母'
            }).then(async ({ value }) => {
                let { data: res } = await this.$http.post('https://api.rambuild.cn/tools/bali/inviteCode', {
                    inviteCode: value
                })
                if (res.status == 200) {
                    this.getInviteCode()
                    this.$msg('success', `添加成功`)
                } else {
                    this.$msg('error', res.msg)
                }
            }).catch((v) => { });
        },
        sendTimes(setTimes) {
            if (this.selectValue == "") {
                this.$message({
                    message: "未选择推荐码",
                    center: true,
                    duration: 1500,
                    type: "warning"
                });
            } else {
                var times = 0;
                this.interval = setInterval(() => {
                    this.sendRequest();
                    this.buttonDisabled = true;
                    this.loopNow !== true ? (this.loopButtonDisabled = true) : "";
                    times++;
                    if (times == setTimes) {
                        clearInterval(this.interval);
                        this.buttonDisabled = false;
                        this.loopButtonDisabled = false;
                    }
                }, 300);
            }
        },
        infiniteTimes() {
            if (!this.loopNow) {
                this.$confirm("确认无限循环？", "提示", {
                    type: "warning",
                    customClass: "confirmClass",
                    center: true
                })
                    .then(() => {
                        if (this.selectValue !== "") {
                            this.loopNow = !this.loopNow;
                        }
                        this.sendTimes(1000000);
                        this.loopButtonDisabled = false;
                    })
                    .catch(() => { });
            } else {
                clearInterval(this.interval);
                this.$message({
                    message: "取消无限循环",
                    center: true,
                    duration: 1500,
                    type: "warning"
                });
                this.loopNow = !this.loopNow;
                this.buttonDisabled = false;
            }
        },
        async sendRequest() {
            let params = {
                token: "eyJ1c2VyX2lkIjoyMzUxMjA2NSwibGFzdGxvZ2luIjoxNTkzMTQzMzY1fQ.374c6e355316491501294de319c49de3.dab7bff70a08936d6a83221378a52438516c76bb426f27429692b8a1",
                lang: "cn",
                promote_code: this.selectValue,
                captcha: 36,
                key: "$2y$10$H1/dIv7cASNxFZOCvDDOF.UgW5EFyTWRcRMAaIUyHnGEkoyM16ycW"
            };
            if (this.selectValue == "") {
                this.$message({
                    message: "未选择推荐码",
                    center: true,
                    duration: 1500,
                    type: "warning"
                });
            } else {
                this.loading = true;
                let { data: res } = await this.$http({
                    method: "POST",
                    url: "https://api.cchzkj.cn/v1/user/promote/insert",
                    data: params,
                    headers: {
                        platform: "pwa"
                    }
                });
                this.loading = false;
                if (res.status.code == 200) {
                    let { data: biliRecRes } = await this.$http.get(`https://api.rambuild.cn/tools/baliInvite?inviteCode=${this.selectValue}`) //计次api
                    let current = this.options.filter(
                        i => i.value == this.selectValue
                    )[0];
                    current.count++;
                    this.$message({
                        message: `${this.selectValue}，成功`,
                        type: "success",
                        center: true,
                        duration: 1500
                    });
                } else {
                    this.$message({
                        message: res.status.message,
                        type: "error",
                        center: true,
                        duration: 1500
                    });
                }
            }

        }
    }
};
</script>

<style scoped lang="scss">
.content {
    .addInviteCode {
        position: absolute;
        top: 2%;
        right: 3%;
        width: 100px !important;
        padding: 10px !important;
        white-space: pre-wrap;
    }
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .el-row {
        width: 30px;
        height: 30px;
        position: absolute;
        bottom: 8%;
        left: 50%;
        transform: translateX(-80%);
    }
    .formBox {
        padding-top: 10%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 90%;
        .el-select,
        button {
            width: 100%;
            margin-left: 0;
            margin-bottom: 30px;
        }
    }
    ::-webkit-scrollbar {
        width: 0 !important;
    }
    ::-webkit-scrollbar {
        width: 0 !important;
        height: 0;
    }
}
</style>
