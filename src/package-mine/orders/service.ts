import { request } from '@/utils/request'

/**
 * 获取用户订单列表
 */
export const getOrderListService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: `/order/user/list`,
  })
}
