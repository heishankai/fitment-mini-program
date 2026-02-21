// 从环境变量获取配置
export const BASEURL = import.meta.env.VITE_BASE_URL
export const WEBVIEWURL = import.meta.env.VITE_WEBVIEW_URL

// 上传文件地址
export const uploadFileUrl = BASEURL + '/upload'

type Data<T> = {
  code: string
  message: string
  data: T
  error: any
}

// 添加请求拦截器
const httpInterceptor = {
  invoke(options: UniApp.RequestOptions): UniApp.RequestOptions {
    // 1. 非 http 开头时需要拼接完整路径
    if (!options?.url?.startsWith('http')) {
      options.url = BASEURL + options?.url
    }
    // 2. 设置超时时间 (默认是60s)
    options.timeout = 10000

    // 3. 添加小程序请求头标识
    options.header = {
      ...options.header,
    }

    // 4. 添加token (因为后端用 Basic Auth 进行身份验证)
    const userInfo = wx.getStorageSync('userInfo') ?? {}
    const token = `Bearer ${userInfo?.token}`

    if (token) {
      options.header.Authorization = token
    }

    return options
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 */

export const request = <T>(options: UniApp.RequestOptions): Promise<Data<T>> => {
  // 1. 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        const { statusCode, data } = res ?? {}

        if (statusCode >= 200 && statusCode < 300) {
          resolve(data as Data<T>)
          return
        }

        if (statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          console.log('401错误')
          wx.removeStorageSync('userInfo')
          uni.navigateTo({ url: '/pages/login/index' })
          return
        }

        // 其他错误
        uni.showToast({ icon: 'none', title: (res.data as Data<T>).message || '请求错误' })
        reject(res)
      },
      fail(err) {
        uni.hideLoading()
        uni.showToast({ icon: 'none', title: '网络错误，换个网络试试' })
        reject(err)
      },
    })
  })
}

/**
 * 上传文件服务
 */
export const uploadFileService = (filePath: string): Promise<{ success: boolean; data?: any }> => {
  return new Promise((resolve) => {
    wx.uploadFile({
      url: uploadFileUrl,
      filePath,
      name: 'file',
      success: (res) => {
        try {
          wx.showLoading({ title: '上传中...' })
          const { success, data } = JSON.parse(res?.data)
          if (!success) {
            wx.hideLoading()
            uni.showToast({ title: '上传失败', icon: 'none' })
            resolve({ success: false, data: null })
            return
          }

          wx.hideLoading()
          resolve({ success: true, data: data })
        } catch {
          wx.hideLoading()
          uni.showToast({ title: '上传失败', icon: 'none' })
          resolve({ success: false, data: null })
        }
      },
    })
  })
}
