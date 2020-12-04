// 自定义localStorage，实现设置存储的有效期

function setStorage(key, val) {
    let curDate = new Date().getTime()
    window.localStorage.setItem(key, JSON.stringify({ val, ctime: curDate }))
}

function getStorage(key) {
    let valObj = JSON.parse(window.localStorage.getItem(key))
    if (valObj) {
        let effectTime = 2592000000 // 有效时间30天
        let ctime = valObj.ctime
        let nowTime = new Date().getTime()
        if (nowTime - ctime > effectTime) { // 过期
            window.localStorage.removeItem(key) // 删除过期的item
            return
        } else {
            return valObj.val
        }
    }
}

function removeStorage(val) {
    window.localStorage.removeItem(val)
}
export { setStorage, getStorage, removeStorage }