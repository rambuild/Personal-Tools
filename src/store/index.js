import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// 通用格式
		generalFormat: {
			resFormat: {
				top: "words_result",
				second: "words"
			},
			params: ""
		},
		// 银行卡识别
		bankcard: {
			resFormat: {
				top: "result",
				second: ''
			},
			params: ""
		},
		// 车牌识别
		license_plate: {
			resFormat: {
				top: "words_result",
				second: ''
			},
			params: ""
		},
		// 增值税发票识别
		vat_invoice: {
			resFormat: {
				top: "words_result",
				second: ''
			},
			params: ""
		},
		// 出租车票识别
		taxi_receipt: {
			resFormat: {
				top: "words_result",
				second: ''
			},
			params: ""
		},
		// 火车票识别
		train_ticket: {
			resFormat: {
				top: "words_result",
				second: ''
			},
			params: ""
		},
		// 定额发票识别
		quota_invoice: {
			resFormat: {
				top: "words_result",
				second: ''
			},
			params: ""
		},
		// 图像主体检测 *************************************
		object_detect: {
			resFormat: {
				top: "result",
				second: ''
			},
			params: ""
		},
		// 植物识别
		plant: {
			resFormat: {
				top: "result",
				second: ['score', 'name']
			},
			params: ""
		},
		// 动物识别
		animal: {
			resFormat: {
				top: "result",
				second: ['score', 'name']
			},
			params: ""
		},
		// 菜品识别
		dish: {
			resFormat: {
				top: "result",
				second: ["calorie", "has_calorie", "name", "probability"]
			},
			params: ""
		},
		// 地标识别
		landmark: {
			resFormat: {
				top: "result",
				second: ''
			},
			params: ""
		},
		// 红酒识别
		redwine: {
			resFormat: {
				top: "result",
				second: ''
			},
			params: ""
		},
		// 货币识别
		currency: {
			resFormat: {
				top: "result",
				second: ''
			},
			params: ""
		},
		// 通用物体和场景识别
		advanced_general: {
			resFormat: {
				top: "result",
				second: ["root", "score", "keyword"]
			},
			params: ""
		},
		// logo识别
		logo: {
			resFormat: {
				top: "result",
				second: ['location', 'name', 'probability', 'type']
			},
			params: ""
		}
	}
})
