function delay(time) {
    return new Promise(resolve => {
        setInterval(() => {
            resolve()
        }, time)
    })
}
export default delay