import axios from 'axios'
// nprogress
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// message组件
import message from '../message'

let http = axios.create({})

http.interceptors.request.use(config => {
    nprogress.start()
    return config
})
http.interceptors.response.use(config => {
    nprogress.done()
    return config
}, err => {
    nprogress.done()
    message('error', err.response.data.message)
    return err
})

export default http