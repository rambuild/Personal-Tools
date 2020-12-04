function genRanStr(length) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    let ramdomStr = ''
    for (var i = 0; i < length; ++i) {
        let randomId = Math.floor(Math.random() * 36)
        ramdomStr += chars[randomId]
    }
    return ramdomStr
}

function genRanEmail(type) {
    var chars = ['qq', '163', 'foxmail', 'gmail', 'yahoo', 'msn', 'hotmail', '126', 'sohu','sina']
    var count = 10
    
    if(type == 'tmpEmail'){
        chars = ['linshiyouxiang.net','besttempmail.com','bestlistbase.com','meantinc.com','classesmail.com','powerencry.com','groupbuff.com']
        count = 7
    }    

    let ramdomEmail = ''
    let randomId = Math.floor(Math.random() * count)
    ramdomEmail = chars[randomId]
    return ramdomEmail
}

export { genRanStr, genRanEmail }