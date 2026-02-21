import { request } from '@/utils/request'

/**
 * 获取辅材商品详情（参考 fitment-wechat product-detail）
 */
export const getCommodityDetailService = (id: string | number): Promise<any> => {
  return request({
    method: 'GET',
    url: `/commodity-config/${id}`,
  })
}
