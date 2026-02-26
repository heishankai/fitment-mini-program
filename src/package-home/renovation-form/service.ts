import { request } from '@/utils/request'

/**
 * 获取逆地理编码
 */
export const getReverseGeocodeService = (params: Record<string, unknown>): Promise<any> => {
  return request({
    method: 'POST',
    url: '/geolocation/reverse-geocode',
    data: params,
  })
}

/**
 * 获取报价
 */
export const getQuoteService = (params: {
  phone: string
  location: string
  houseType: string
  roomType: string
  area: string
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/get-price',
    data: params,
  })
}
