import { request } from '@/utils/request'

/**
 * 获取逆地理编码
 */
export const getReverseGeocodeService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: `/geolocation/reverse-geocode`,
    data: params,
  })
}

/**
 * 创建订单（HTTP接口）
 */
export const createOrderService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order`,
    data: params,
  })
}
