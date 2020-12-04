<template>
	<div class="ai">
		<div class="content">
			<div class="tabsBox">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="图像技术" name="imageTec">
						<v-render :renderData="renderImageData"></v-render>
					</el-tab-pane>
					<el-tab-pane label="人脸与人体识别" name="faceRec">
						<v-render :renderData="renderFaceRecData"></v-render>
					</el-tab-pane>
					<el-tab-pane label="语音技术" name="voiceTec">
						<v-render :renderData="renderVoiceData"></v-render>
					</el-tab-pane>
					<el-tab-pane label="知识与语义" name="knowledgeTec">
						<v-render :renderData="renderKnowledgeTecData"></v-render>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
import vRender from "@/components/renderAIData.vue"
export default {
	components: {
		vRender
	},
	data() {
		return {
			activeName: "imageTec",
			renderImageData: [
				{
					title: "文字识别",
					items: [
						{
							title: "通用文字识别",
							hot: true,
							iconfont: "icon-wenzishibie___",
							method: "general_basic"
						},
						{
							title: "身份证识别",
							iconfont: "icon-ziyuan",
							method: "idcard"
						},
						{
							title: "银行卡识别",
							iconfont: "icon-yinxingqia",
							method: "bankcard"
						},
						{
							title: "车牌识别",
							iconfont: "icon-chepaishibie",
							method: "license_plate"
						},
						{
							title: "驾驶证识别",
							iconfont: "icon-jiashizheng",
							method: "driving_license"
						},
						{
							title: "行驶证识别",
							iconfont: "icon-buhuanhangshizheng",
							method: "vehicle_license"
						},
						{
							title: "营业执照识别",
							iconfont: "icon-yingyezhizhao",
							method: "business_license"
						},
						{
							title: "增值税发票",
							iconfont: "icon-fapiao1",
							method: "vat_invoice"
						},
						{
							title: "出租车票识别",
							iconfont: "icon-wodefapiao",
							method: "taxi_receipt"
						},
						{
							title: "火车票识别",
							iconfont: "icon-huochepiao",
							method: "train_ticket"
						},
						{
							title: "手写识别",
							iconfont: "icon-iconzhengli_shouxieqianpi",
							method: "handwriting"
						},
						{
							title: "数字识别",
							iconfont: "icon-shuzi",
							method: "numbers"
						},
						{
							title: "定额发票识别",
							iconfont: "icon-fapiao",
							method: "quota_invoice"
						},
						{
							title: "通用机打发票",
							iconfont: "icon-fapiaodayin",
							method: "notAvaliable"
						},
						{
							title: "机动车销售发票",
							iconfont: "icon-fapiao1",
							method: "notAvaliable"
						},
						{
							title: "银行回单识别",
							iconfont: "icon-dianzihuidan",
							method: "notAvaliable"
						}
					]
				},
				{
					title: "图像识别",
					items: [
						{
							title: "图像主体检测",
							hot: true,
							iconfont: "icon-Image",
							method: "object_detect"
						},
						{
							title: "植物识别",
							hot: true,
							iconfont: "icon-zhiwu",
							method: "plant"
						},
						{
							title: "动物识别",
							hot: true,
							iconfont: "icon--xiaogou",
							method: "animal"
						},
						{
							title: "菜品识别",
							iconfont: "icon-caipin-",
							method: "dish"
						},
						{
							title: "车型识别",
							hot: true,
							iconfont: "icon-cheliang",
							method: "notAvaliable"
						},
						{
							title: "地标识别",
							iconfont: "icon-dibiao",
							method: "landmark"
						},
						{
							title: "红酒识别",
							iconfont: "icon-hongjiu",
							method: "redwine"
						},
						{
							title: "货币识别",
							iconfont: "icon-shuzihuobi",
							method: "currency"
						},
						{
							title: "通用物体场景识别",
							iconfont: "icon-Dwuti",
							method: "advanced_general"
						},
						{
							title: "logo识别",
							iconfont: "icon-changjingguanli",
							method: "logo"
						},
						{
							title: "果蔬识别",
							iconfont: "icon-shuiguoshucai",
							method: "notAvaliable"
						},
						{
							title: "图像多主体检测",
							iconfont: "icon-tuxiangweiyi",
							method: "notAvaliable"
						},
						{
							title: "车辆检测",
							new: true,
							iconfont: "icon-cheliangzhuapai",
							method: "notAvaliable"
						},
						{
							title: "车辆外观损伤识别",
							iconfont: "icon-icon_quchechaxun-copy",
							method: "notAvaliable"
						}
					]
				},
				{
					title: "图像效果增强",
					items: [
						{
							title: "黑白图像上色",
							iconfont: "icon-tuxiang1",
							method: "notAvaliable"
						},
						{
							title: "图像去雾",
							iconfont: "icon-wu",
							method: "notAvaliable"
						},
						{
							title: "图像对比度增强",
							iconfont: "icon-tuxiangshibie",
							method: "notAvaliable"
						},
						{
							title: "拉伸图像恢复",
							iconfont: "icon-tuxiangweiyi",
							method: "notAvaliable"
						},
						{
							title: "图像风格转换",
							iconfont: "icon-tuxiangshibie___",
							method: "notAvaliable"
						},
						{
							title: "图像无损放大",
							new: true,
							iconfont: "icon-tuxiang",
							method: "notAvaliable"
						},
						{
							title: "图像清晰度增强",
							iconfont: "icon-tuxingtuxiangchuli",
							method: "notAvaliable"
						},
						{
							title: "人像动漫化",
							new: true,
							iconfont: "icon-renlianshibie1",
							method: "notAvaliable"
						},
						{
							title: "天空分割",
							new: true,
							iconfont: "icon-tuxiangshibie",
							method: "notAvaliable"
						}
					]
				},
				{
					title: "图像审核",
					items: [
						{
							title: "图像审核",
							hot: true,
							iconfont: "icon-tuxiangshibie___",
							method: "notAvaliable"
						}
					]
				}
			],
			renderFaceRecData: [
				{
					title: "人脸识别",
					items: [
						{
							title: "人脸检测",
							hot: true,
							iconfont: "icon-renlianshibie2",
							method: "detect"
						},
						{
							title: "人脸对比",
							hot: true,
							iconfont: "icon-renlianshibie4"
						},
						{
							title: "情绪识别",
							hot: true,
							iconfont: "icon-qingxu"
						}
					]
				},
				{
					title: "人体分析",
					items: [
						{
							title: "人体属性识别",
							hot: true,
							iconfont: "icon-rentijiansuo"
						},
						{
							title: "人体关键点",
							iconfont: "icon-icon-renxiang"
						},
						{
							title: "手势识别",
							iconfont: "icon-anzhuo-"
						},
						{
							title: "人像分割",
							iconfont: "icon-jiashiyuanfenxi"
						},
						{
							title: "人流量统计",
							new: true,
							iconfont: "icon-4"
						},
						{
							title: "驾驶行为分析",
							new: true,
							iconfont: "icon-cheliang"
						},
						{
							title: "手部关键点",
							new: true,
							iconfont: "icon-shoushimima"
						},
						{
							title: "指尖检测",
							new: true,
							iconfont: "icon-finger-rotate-"
						}
					]
				}
			],
			renderVoiceData: [
				{
					title: "语音识别",
					items: [
						{
							title: "语音识别",
							hot: true,
							iconfont: "icon-yuyin1"
						}
					]
				},
				{
					title: "语音合成",
					items: [
						{
							title: "语音合成",
							hot: true,
							iconfont: "icon-laba"
						}
					]
				}
			],
			renderKnowledgeTecData: [
				{
					title: "自然语言基础技术",
					items: [
						{
							title: "词法分析",
							hot: true,
							iconfont: "icon-cifatixing"
						},
						{
							title: "情感倾向分析",
							hot: true,
							iconfont: "icon-qingxu"
						},
						{
							title: "短文本相似度",
							iconfont: "icon-duanwenbenxiangsi"
						},
						{
							title: "文章标签",
							iconfont: "icon-biaoqian"
						},
						{
							title: "评论观点抽取",
							iconfont: "icon-pinglun"
						}
					]
				},

				{
					title: "文本审核",
					items: [
						{
							title: "文本审核",
							iconfont: "icon-wenbenshenhewancheng"
						}
					]
				},

				{
					title: "知识理解",
					items: [
						{
							title: "实体标注",
							iconfont: "icon-shitimoxing"
						}
					]
				}
			]
		}
	},
	methods: {
		handleClick() {}
	}
}
</script>

<style lang="scss" scoped>
.ai {
	margin: 4rem auto;
	color: #fff;
	max-width: 760px;
	.content {
		width: 95%;
		margin: 0 auto;
		/deep/ .tabsBox {
			.el-tabs__header {
				background-color: #409eff;
				border-radius: 5px;
			}
			.el-tabs__item {
				color: #000;
				padding: 0 10px;
				height: 50px;
				font-size: 15px;
				line-height: 50px;
			}
			.el-tabs__item:hover,
			.el-tabs__item.is-active {
				color: #fff;
				cursor: pointer;
				font-weight: bold;
			}
			.el-tabs__nav-next,
			.el-tabs__nav-prev {
				color: #fff;
			}
			.el-tabs__nav-wrap::after {
				background-color: transparent;
			}
			// 单个项目样式
			.itemsBox {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.item {
					cursor: pointer;
					width: 48%;
					height: 50px;
					line-height: 50px;
					padding-left: 1rem;
					border: solid 1px #aaa;
					border-radius: 3px;
					margin-bottom: 0.5rem;
					& > span {
						font-size: 14px;
						i.iconfont {
							font-size: 20px;
							position: relative;
							top: 2px;
							padding-right: 0.3rem;
						}
						i.hot {
							color: rgb(245, 69, 69);
							font-size: 13px;
							font-style: normal;
						}
						i.new {
							color: rgb(42, 173, 73);
							font-size: 13px;
							font-style: normal;
						}
					}
				}
				.item:hover {
					background-color: rgb(64, 158, 255);
					border-color: rgb(64, 158, 255);
				}
			}
		}
	}
}
</style>
