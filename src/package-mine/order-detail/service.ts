import { request } from '@/utils/request'

interface OrderFeePayParams {
  pay_type: 'order_platform_service_fee' | 'order_gangmaster_cost';
  order_id?: number;
  order_amount: number;
}

// 获取订单费用支付参数（平台服务费、工长费用）
export const getPayParamsForOrderService = (params: OrderFeePayParams): Promise<any> => {
  return request({ method: 'POST', url: `/wx-pay/order-fees`, data: params, })
}

interface WorkPricePayParams {
  pay_type: 'work_price_single' | 'work_price_batch' | 'work_price_sub_service_fee_batch';
  workPriceItemId?: number;
  workPriceItemIds?: number[];
  order_amount: number;
}

// 获取子工价支付参数
export const getPayParamsForWorkPriceService = (params: WorkPricePayParams): Promise<any> => {
  return request({ method: 'POST', url: `/wx-pay/work-price-items`, data: params, })
}

const normalize = (res: any): { success: boolean; data: any } => {
  const ok = res?.success === true || res?.code === 200 || res?.code === '0'
  const data = res?.data ?? res
  return { success: !!ok, data }
}

export const getOrderDetailService = (id: number | string): Promise<{ success: boolean; data: any }> => {
  return request({ method: 'GET', url: `/order/${id}` }).then(normalize).catch(() => ({ success: false, data: null }))
}

/** 获取微信用户的所有聊天房间列表 */
export const getWechatUserRooms = (): Promise<any> => {
  return request({
    method: 'GET',
    url: `/craftsman-wechat-chat/rooms/wechat`,
  })
}

/** 创建或获取与工匠的聊天房间 */
export const createOrGetRoomByCraftsman = (params: {
  craftsman_user_id: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: `/craftsman-wechat-chat/rooms`,
    data: { craftsman_user_id: params.craftsman_user_id },
  })
}

// 获取订单子工价列表
export const getSubWorkService = (orderId: number): Promise<any> => {
  return request({ method: 'GET', url: `/order/${orderId}/sub-groups` })
}

// 取消订单
export const cancelOrderService = (params: {
  orderId: number
}): Promise<any> => {
  return request({ method: 'POST', url: `/order/cancel`, data: params, })
}