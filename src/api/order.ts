import { request } from '@/utils/request'

/**
 * 获取用户订单列表（主包可调用，供 mine 等页面使用）
 */
export const getOrderListService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: `/order/user/list`,
  })
}
