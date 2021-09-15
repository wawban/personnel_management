import {serialize, noEmptyOfObject} from '@/util/util'
import {getStore} from '../util/store'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import router from "@/router/router"
import {Message} from 'element-ui'
import 'nprogress/nprogress.css'
import store from "@/store"; // progress bar style
axios.defaults.timeout = 30000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const isToken = (config.headers || {}).isToken === false
  // let token =  store.getters.access_token
  let token =  store.getters.access_token
  token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiNHE1ZTZna3E5b3U4IiwiY2xpZW50SWQiOiJabkpoYldVPSIsImxvZ2luVHlwZSI6InBhc3N3b3JkIiwidXNlcl9uYW1lIjoicXpBZG1pbiIsInJvbGVzIjpbXSwiZGF0YVNjb3BlIjp7ImNyZWF0ZUJ5SWRzIjpbIjI0ZTVjNTM3ZDk5ZWZiMWE5ZThiMGYyNWNhNWE2Y2NhIiwiNDAwZTdkYjhiYmE4YTE5ZDIyMzZiOWQ5NDI5ODFjMmYiLCJhZDkyZjlmMzljZDBkNGRhN2RjMGViNmI2OTE5YmRjYiJdLCJ1c2VySWQiOiI0MDBlN2RiOGJiYThhMTlkMjIzNmI5ZDk0Mjk4MWMyZiIsImRhdGFTY29wZVR5cGUiOiJjdXJyX2RlcHQiLCJkZXB0SWRzIjpbIjQxNjJkZDllNGM1MTcyYjBkZThjNWUzYTQ0Yzc2ODliIl0sImpvYklkcyI6W10sImN1c3RvbUNvbHVtblBlcm1pc3Npb25zIjpbXX0sInVzZXJEdG8iOnsiaWQiOiI0MDBlN2RiOGJiYThhMTlkMjIzNmI5ZDk0Mjk4MWMyZiIsInJlYWxOYW1lIjoi5beh5qOA566h55CG5ZGYIiwibmlja05hbWUiOiLlt6Hmo4DnrqHnkIblkZgiLCJlbWFpbCI6bnVsbCwidXNlck5hbWUiOiJxekFkbWluIiwiaGVhZEltZyI6Ii9tZ3IvdXBtcy9pbWcvc2V4L21hbGUucG5nIiwicGhvbmUiOiIxODM3NTcyNjcyNSIsInNleCI6Im1hbGUiLCJqb2JJZCI6IjI4NjgxZjMwZmIzYTQwZjQ0ZWFiMjkxMmI3NjUxZmI5Iiwiam9iTmFtZSI6IuWyl-S9jTEiLCJkZXB0SWQiOiI0MTYyZGQ5ZTRjNTE3MmIwZGU4YzVlM2E0NGM3Njg5YiIsImRlcHROYW1lIjoi6LSi5Yqh6L-Q6JCl6YOoIiwiZGVwdExlYWRlciI6ZmFsc2UsInd4T3BlbmlkIjpudWxsLCJyb2xlSWQiOm51bGwsInBhc3N3b3JkIjoiIiwibG9ja0ZsYWciOmZhbHNlLCJ0ZW5hbnRJZCI6IjE0bDQ3cDRsZTZkZW8iLCJhZG1pbkZsYWciOnRydWUsImVtcGxveWVlTm8iOm51bGwsImxldmVsIjpudWxsLCJ0ZW5hbnRJZHMiOlsiMTRsNDdwNGxlNmRlbyJdfSwiY2xpZW50X2lkIjoiZnJhbWUiLCJzY29wZSI6WyJzZXJ2ZXIiXSwiZXhwIjoxNjMxNTYyMTQzLCJqdGkiOiJmMmUxNWI2NS1mZWJiLTRjODQtYmVmOC03ZjA2YTA5MDhkYzcifQ.J_W2YzFGYRVyxKZ5HOPltD3Y8FldiN5s-EHuqdaHYg-GuK8XpDtp3v3J6NNfB9dRb9-hE-fI5JiyFof97q8b_MIvsHF5iPLGUOLFyw4r-3OoAeGOMQrKWrkg2lwgGYf8CcjO4ya8LPGdaq7Qoij_iYo2myVEXpGo1o5TOKOlKTw"
  if (token && !isToken) {
    config.headers['Authorization'] = token // 'Bearer ' + token
  }
  let tenantId = store.getters.userInfo.tenantId
  if(tenantId) {
    config.headers['tenantId'] = tenantId
  }
  // headers中配置serialize为true开启序列化
  if (config.methods === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }
  // 去除空值参数
  if(config.params) {
    config.params = noEmptyOfObject(config.params)
  }
  if(config.data) {
    config.data = noEmptyOfObject(config.data)
  }
  return config
}, error => {
  return Promise.reject(error)
})


// HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401) {
    store.dispatch('FedLogOut').then(() => {
      router.push({path: '/login'})
    })
    return
  }

  if (status !== 200 || res.data.code === 1 || res.data.code === 500) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }

  return res
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default axios
