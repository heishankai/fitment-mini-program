import { request } from '@/utils/request'

/** 登录参数 */
interface LoginParams {
  code: string
}

/**
 * 登录
 */
export const loginService = (params: LoginParams): Promise<any> => {
  return request({
    method: 'GET',
    url: '/wechat/wechat-user/login',
    data: params,
  })
}

/** 获取手机号参数 */
interface GetPhoneParams {
  code: string
  openid?: string
  encryptedData?: string
  iv?: string
}

/**
 * 获取用户手机号码
 */
export const getUserPhoneNumberService = (params: GetPhoneParams): Promise<any> => {
  return request({
    method: 'POST',
    url: '/wechat/wechat-user/phone',
    data: params,
  })
}
