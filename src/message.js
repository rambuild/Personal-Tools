import Vue from 'vue'

function cusMessage(type, message, duration) {
    Vue.prototype.$message({
        type,
        message,
        duration: duration || 1500,
        center: true
    })
}
export default cusMessage