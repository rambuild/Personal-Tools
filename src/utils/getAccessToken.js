import Vue from "vue"

let text_apiKey = "hFAiLk5izTrL6eNqdV105ibG"
let text_secretKey = "E2qhf8iGzt3SRrKY8PC33wH6ahjAcPaH"

async function getToken() {
	let a = await Vue.prototype.$http({
		url: "https://aip.baidubce.com/oauth/2.0/token",
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		data: {
			grant_type: "client_credentials",
			client_id: text_apiKey,
			client_secret: text_secretKey
		}
	})
	console.log(a)
}

export default getToken
