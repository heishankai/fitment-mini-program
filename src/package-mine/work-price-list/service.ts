import { request } from '@/utils/request'

interface WorkPricePayParams {
  pay_type: 'work_price_single' | 'work_price_batch' | 'work_price_sub_service_fee_batch';
  workPriceItemId?: number;
  workPriceItemIds?: number[];
  order_amount: number;
}

// 获取支付参数
export const getPayParamsForWorkPriceService = (params: WorkPricePayParams): Promise<any> => {
  return request({ method: 'POST', url: `/wx-pay/work-price-items`, data: params, })
}

/** 验收工价 */
export const acceptOrderWorkPriceService = (params: {
  work_price_item_id: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: `/order/accept-single-work-price`,
    data: params,
  })
}

/** 批量验收工价 */
export const acceptOrderWorkPriceBatchService = (params: {
  work_price_item_ids: number[]
}): Promise<any> => {
  return request({
    method: 'POST',
    url: `/work-price-item/batch-accept`,
    data: params,
  })
}

/**
 * 根据工价项ID获取工价列表
 */
export const getWorkPriceListByWorkPriceItemId = (
  workPriceItemId: number | string,
  craftsmanId: number | string,
): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-price-item/${workPriceItemId}/craftsman/${craftsmanId}/work-prices`,
  })
}

/**
 * 根据订单ID获取工价列表
 */
export const getWorkPriceListByOrderId = (orderId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-price-item/order/${orderId}/work-prices`,
  })
}


