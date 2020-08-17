<template>
    <div class="priceContent">
        <el-button type="primary" class="toHome" @click="$router.push('/')">返回首页</el-button>
        <el-button type="warning" class="searchHistory" @click="showDrawer">查询历史</el-button>
        <h3 style="text-align:center;color:rgb(102,177,255);margin-top:4.3rem;">各大平台商品历史价格查询</h3>
        <!-- 查询表单 -->
        <div class="formBox">
            <el-form
                @submit.prevent.native="search"
                :rules="formRules"
                :model="formData"
                ref="formRef"
            >
                <el-form-item prop="goodsLink">
                    <el-input
                        placeholder="请输入商品链接网址，暂不支持淘口令"
                        v-model="formData.goodsLink"
                        clearable
                        autofocus
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="primary" v-loading="loading">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="$refs.formRef.resetFields()">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 商品信息 -->
        <div class="itemBox" v-if="recvData.spname">
            <div class="itemWrapper">
                <div class="sppic">
                    <img :src="recvData.sppic" />
                </div>
                <div class="title">
                    <span>
                        <span class="source">【{{recvData.cusitename}}】</span>
                        {{recvData.spname}}
                    </span>
                    <span style="color:#666">销量：{{recvData.tmp.commentCount}}</span>
                    <div class="curprice">
                        <span>
                            <span class="keywords">￥{{recvData.spprice}}</span>
                        </span>
                        <el-button
                            size="small"
                            type="danger"
                            @click="findCoupon"
                            v-loading="getCouponLoading"
                            style="border:none;"
                        >点击查券</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 优惠券信息 -->
        <div class="couponInfo" v-if="couponInfo.category_id">
            <el-card>
                <div class="infoTitle">
                    <h3 style="text-align:center;font-size:16px;margin:0.5rem 0;">
                        商品/
                        优惠券信息
                    </h3>
                </div>
                <div class="infoBox">
                    <p>
                        店铺名称:
                        <span>{{couponInfo.shop_title}}</span>
                    </p>
                    <p>
                        店铺地址:
                        <span>{{couponInfo.provcity}}</span>
                    </p>
                    <p>
                        一级分类:
                        <span>{{couponInfo.level_one_category_name}}</span>
                    </p>
                    <p>
                        商品分类:
                        <span>{{couponInfo.category_name}}</span>
                    </p>
                    <p>
                        满减信息:
                        <span>{{couponInfo.coupon_info}}</span>
                    </p>
                    <p>
                        优惠券金额:
                        <span>{{couponInfo.coupon_amount}}</span>
                    </p>
                    <p>
                        优惠券总量:
                        <span>{{couponInfo.coupon_total_count}}</span>
                    </p>
                    <p>
                        优惠券剩余:
                        <span>{{couponInfo.coupon_remain_count}}</span>
                    </p>
                    <p>
                        开始时间:
                        <span>{{couponInfo.coupon_start_time}}</span>
                    </p>
                    <p>
                        结束时间:
                        <span>{{couponInfo.coupon_end_time}}</span>
                    </p>
                    <el-button type="danger" size="large" @click="jump2getCoupon">点击领券</el-button>
                </div>
            </el-card>
        </div>
        <!-- 历史价格图表 -->
        <div class="chartsBox" v-if="recvData.spname">
            <div class="trend">
                <span>趋势：</span>
                <span class="keywords" v-html="recvData.spzhoushi"></span>
                <br />
                <span>
                    最低价格：
                    <span class="keywords">￥{{recvData.zdprice}}</span>
                    ({{recvData.zdtime}})
                </span>
            </div>
            <div class="typeControl">
                <ve-line :data="chartData" width="100%" height="350px" v-if="chartsControl=='line'"></ve-line>
                <ve-histogram
                    :data="chartData"
                    width="100%"
                    height="350px"
                    v-if="chartsControl=='histogram'"
                ></ve-histogram>
                <ve-scatter
                    :data="chartData"
                    width="100%"
                    height="350px"
                    v-if="chartsControl=='scatter'"
                    :settings="scatterChartSettings"
                ></ve-scatter>
                <div class="typeBtn">
                    <el-button @click="chartsControl='line'" type="primary" size="mini" round>折线图</el-button>
                    <el-button
                        @click="chartsControl='histogram'"
                        type="primary"
                        size="mini"
                        round
                    >柱状图</el-button>
                    <el-button @click="chartsControl='scatter'" type="primary" size="mini" round>散点图</el-button>
                </div>
            </div>
        </div>
        <!-- 历史价格列表 -->
        <div class="priceList" v-if="priceList">
            <el-table :data="priceList" stripe>
                <el-table-column label="日期">
                    <template slot-scope="scope">
                        <el-tag type="warning">{{scope.row.日期}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="价格">
                    <template slot-scope="scope">
                        <el-tag>￥{{scope.row.价格}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 返回顶部按钮 -->
        <div id="backTop">
            <div class="backTopBox" v-scroll="showTop">
                <div @click="gotop" class="go-top" :class="goTop?'active':''">^</div>
            </div>
        </div>
        <!-- 查询历史记录 -->
        <div class="drawerBox">
            <el-drawer
                title="查询历史"
                :visible.sync="drawerVisible"
                direction="ltr"
                :before-close="handleDrawerClose"
            >
                <div class="clearHistory" v-show="searchList.length>0">
                    <span @click="clearHistory">删除历史记录</span>
                </div>
                <ul class="historyItem">
                    <li v-for="(i,index) in searchList" :key="index" @click="searchFromList(i)">
                        <div>{{index+1}}. {{i.spname}}</div>
                    </li>
                </ul>
            </el-drawer>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
import Vue from 'vue'
import md5 from "js-md5"
import { setStorage, getStorage, removeStorage } from '@/utils/cusLocStorage'
Vue.directive('scroll', {
    bind: function (el, binding) {
        window.addEventListener('scroll', () => {
            let fnc = binding.value;
            fnc(el);
        })
    }
})
function objKeySort(obj) { //排序的函数
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    let newArray = Object.keys(obj).sort()
    let newObj = {}
    for (let i = 0; i < newArray.length; ++i) {
        newObj[newArray[i]] = obj[newArray[i]]
    }
    return newObj
}
export default {
    data() {
        var checkGoodsLink = (rule, val, callback) => {
            if (!val.trim()) {
                return callback(new Error("请输入商品链接！"));
            }
            let urlReg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
            if (urlReg.test(val)) {
                //   网址合法
                return callback();
            }
            callback(new Error("请输入正确的链接！"));
        }
        return {
            scatterChartSettings: {
                symbolSize: [5, 5]
            },
            formData: {
                goodsLink: ''
            },
            formRules: {
                goodsLink: [{
                    required: true,
                    trigger: 'change',
                    validator: checkGoodsLink
                }]
            },
            recvData: {},
            loading: false,
            getCouponLoading: false,
            chartData: {
                columns: ['日期', '价格'],
                rows: []
            },
            priceList: null,
            goTop: false,
            scrollTop: '',
            chartsControl: 'line',
            couponInfo: {},
            drawerVisible: false,
            searchList: [],
            tkl: ''
        }
    },
    mounted() { },
    methods: {
        search() {
            this.$refs.formRef.validate(async valid => {
                if (!valid) {
                    return
                } else {
                    this.loading = true
                    this.couponInfo = {}
                    let { data: res } = await this.$http.get(`https://api.rambuild.cn/tools/priceHistory?url=${this.formData.goodsLink}`)
                    if (res.data.ok == 1) {
                        this.$msg('success', '获取成功')
                        this.loading = false
                        // 添加到历史记录
                        let pushFlag = true
                        this.searchList.forEach(i => {
                            // 如果查询的内容与数组中的某项一致则不添加
                            if (i.spname == res.data.spname) {
                                return pushFlag = false
                            }
                        })
                        if (pushFlag) {
                            this.searchList.push({
                                spname: res.data.spname,
                                url: this.formData.goodsLink
                            })
                            setStorage('queryGoodsHistory', this.searchList)
                        }
                        this.recvData.tmp = { commentCount: 0 } // 有的商品无此属性，添加默认值
                        this.recvData = Object.assign(this.recvData, res.data)
                        this.solvePriceTrends()
                    } else {
                        this.loading = false
                        this.$msg('error', '未知错误，请重试')
                    }
                }
            })
            // console.log(this.$refs)

        },
        solvePriceTrends() {
            let rawData = this.recvData.jsData
            let tmpData = rawData.split('[')
            for (let i = 0; i < tmpData.length; ++i) {
                let index = tmpData[i].indexOf('],')
                tmpData[i] = tmpData[i].slice(0, index).split(',')
            }
            tmpData.splice(0, 1)
            let finalData = tmpData.map(i => {
                return {
                    "日期": dayjs(parseInt(i[0])).format('YY/MM/DD'),
                    "价格": i[1]
                }
            })
            let priceList = tmpData.map(i => {
                return {
                    "日期": dayjs(parseInt(i[0])).format('YYYY-MM-DD'),
                    "价格": i[1]
                }
            })
            this.chartData.rows = finalData
            this.priceList = priceList.reverse()
        },
        gotop() {
            let speed = 10;
            let timer = setInterval(function () {
                this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if (this.scrollTop > 0) {
                    this.scrollTop = (this.scrollTop - speed > 0) ? (this.scrollTop - speed) : 0;
                    speed += 20;
                    window.scrollTo(0, this.scrollTop);
                } else {
                    clearInterval(timer);
                }
            }, 20)
        },
        showTop() {
            this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if (this.scrollTop > 300) {
                this.goTop = true;
            } else {
                this.goTop = false;
            }
        },
        // 查券
        async findCoupon() {
            this.couponInfo = {}
            let queryUrl = this.recvData.spurl
            // 只查淘宝链接
            if (queryUrl.includes('taobao') || queryUrl.includes('tmall')) {
                this.getCouponLoading = true
                let { data: res } = await this.$http.get(`https://api.rambuild.cn/tools/tbk/getCoupon?queryStr=${this.recvData.spurl}`)
                this.getCouponLoading = false
                // 如果该商品有优惠券
                if (res.data.tbk_dg_material_optional_response) {
                    if (res.data.tbk_dg_material_optional_response.result_list.map_data[0].coupon_share_url) {
                        this.$msg('success', '优惠券查询成功')
                        this.couponInfo = res.data.tbk_dg_material_optional_response.result_list.map_data[0]
                        // 将二合一链接转换成淘口令
                        let { data: res2 } = await this.$http.get(`https://api.rambuild.cn/tools/tbk/getTkl?url=https:${this.couponInfo.coupon_share_url}`)
                        this.tkl = res2.data.tbk_tpwd_create_response.data.model ? res2.data.tbk_tpwd_create_response.data.model : ''
                        this.copy2clipboard(this.tkl)
                    } else {
                        this.$msg('info', '该商品没有优惠券')
                    }
                } else {
                    this.$msg('error', '未知错误，请换个商品重试')
                }
            } else {
                this.$msg('warning', '目前暂时只支持淘宝/天猫优惠券查询', 3000)
            }
        },
        copy2clipboard(val) {
            this.$copyText(val).then((e) => { }, (e) => { })
        },
        handleDrawerClose(done) {
            done()
        },
        searchFromList(i) {
            this.drawerVisible = false
            // 选择的商品不一样才搜索
            if (i.url != this.formData.goodsLink) {
                this.formData.goodsLink = i.url
                this.search()
                this.couponInfo = {}
            }
        },
        jump2getCoupon() {
            this.$msg('success', '正在跳转至淘宝领券。。。')
            // 复制淘口令
            this.copy2clipboard(this.tkl)
            window.open(`taobao:${this.couponInfo.coupon_share_url}`, '_self')
            // 某些浏览器可能复制不成功的解决方法
            this.copy2clipboard(this.tkl)
        },
        showDrawer() {
            this.drawerVisible = true
            // 载入搜索历史记录
            let queryGoodsHistory = getStorage('queryGoodsHistory')
            if (queryGoodsHistory) {
                this.searchList = queryGoodsHistory
            }
        },
        clearHistory() {
            this.$confirm('确定删除历史记录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 清除搜索历史
                this.searchList = []
                removeStorage('queryGoodsHistory')
                this.$msg('success', '删除成功')
            }).catch(() => { })


        }
    }
}
</script>
<style lang="scss" scoped>
.priceContent {
    .searchHistory {
        position: absolute;
        top: 2%;
        right: 3%;
        width: 80px !important;
        padding: 10px !important;
    }
    .formBox {
        display: flex;
        justify-content: center;
        /deep/ .el-form {
            width: 95%;
            .el-input {
                input {
                    line-height: 14px;
                }
            }
        }
        .el-button {
            width: 100%;
        }
    }
    .itemBox {
        color: #000;
        display: flex;
        justify-content: center;
        .itemWrapper {
            width: 95%;
            padding: 0.6rem;
            box-sizing: border-box;
            background-color: rgb(250, 250, 250);
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            .sppic {
                img {
                    width: 100px;
                    border-radius: 5px;
                }
            }
            .title {
                padding: 0.3rem 0 0.3rem 1rem;
                text-align: justify;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .source {
                    color: red;
                    font-weight: bold;
                }
                .curprice {
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .keywords {
                        color: red;
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .chartsBox {
        width: 95%;
        padding-bottom: 0.6rem;
        margin: 1rem auto;
        border-radius: 6px;
        background-color: rgb(250, 250, 250);
        .trend {
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            padding: 0.3rem 0;
            .keywords {
                color: rgb(233, 27, 61);
                font-weight: bold;
            }
        }
        .typeControl {
            .typeBtn {
                display: flex;
                justify-content: center;
                .el-button {
                    outline: none;
                    border: none;
                }
            }
        }
    }
    .priceList {
        width: 95%;
        margin: 1rem auto;
        border-radius: 6px;
        overflow: hidden;
        /deep/ .el-table {
            thead th,
            tbody td {
                text-align: center;
            }
        }
    }
    .couponInfo {
        display: flex;
        justify-content: center;
        border-radius: 6px;
        overflow: hidden;
        margin: 1rem 0;
        /deep/ .el-card {
            width: 95%;
            font-size: 12px;
            .el-card__body {
                padding: 0.2rem 1rem 0.5rem;
                .infoBox {
                    display: flex;
                    flex-wrap: wrap;
                    p {
                        width: 50%;
                        text-align: left;
                        margin: 0.3rem 0;
                        span {
                            color: rgb(233, 27, 61);
                            font-weight: bold;
                        }
                    }
                }
                .el-button {
                    width: 100%;
                    margin: 0.3rem 0;
                }
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
            li {
                margin-bottom: 0.6rem;
                line-height: 18px;
                cursor: pointer;
            }
        }
    }
}
/deep/ .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.5);
}
.go-top {
    width: 40px;
    height: 40px;
    line-height: 45px;
    font-size: 25px;
    font-weight: bold;
    border-radius: 50%;
    background: rgb(65, 185, 131);
    position: fixed;
    right: 30px;
    bottom: 30px;
    opacity: 0;
    transition: all ease 1s;
    -webkit-transition: all ease 1s;
    text-align: center;
    color: #fff;
    cursor: pointer;
    border: none;
    outline: none;
    &.active {
        opacity: 1;
    }
}
</style>