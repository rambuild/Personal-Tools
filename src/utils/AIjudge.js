let ocrClass = [
	"general_basic",
	"idcard",
	"bankcard",
	"license_plate",
	"driving_license",
	"vehicle_license",
	"business_license",
	"vat_invoice",
	"taxi_receipt",
	"train_ticket",
	"handwriting",
	"numbers",
	"quota_invoice"
]

let imgClass = ["object_detect", "plant", "animal", "dish", "landmark", "redwine", "currency", "advanced_general", 'logo']

let v2Class = ["dish", "advanced_general", 'logo', 'detect']

let faceClass = ['detect']

function judgeClassify(item) {
	if (ocrClass.indexOf(item) > -1) {
		return "ocr"
	}
	if (imgClass.indexOf(item) > -1) {
		return "image-classify"
	}
	if (faceClass.indexOf(item) > -1) {
		return 'face'
	}
	return null
}
function judgeVersion(item) {
	if (v2Class.indexOf(item) > -1) {
		return "v2"
	} else {
		return "v1"
	}
}
export { judgeClassify, judgeVersion }
