import { request } from '@/utils/request'

/**
 * 根据工价项ID和工匠ID获取施工进度
 */
export const getConstructionProgress = (
  workPriceItemId: number | string,
  craftsmanId: number | string,
): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-price-item/${workPriceItemId}/construction-progress/craftsman/${craftsmanId}`,
  })
}

/**
 * 根据订单ID获取施工进度
 */
export const getConstructionProgressByOrderId = (orderId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/construction-progress/order/${orderId}`,
  })
}
