import { request } from '@/utils/request'

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

export const getConstructionProgressByOrderId = (
  orderId: number | string,
): Promise<{ success: boolean; data: any[] }> => {
  return request({
    method: 'GET',
    url: `/construction-progress/order/${orderId}`,
  })
    .then((res: any) => {
      const ok = res?.success === true || res?.code === 200 || res?.code === '0'
      const raw = res?.data ?? res
      const list = Array.isArray(raw) ? raw : raw?.list ?? []
      return { success: !!ok, data: list }
    })
    .catch(() => ({ success: false, data: [] }))
}

export const getSubWorkPricesByOrderId = (
  orderId: number | string,
): Promise<{ success: boolean; data: any[] }> => {
  return request({
    method: 'GET',
    url: `/order/${orderId}/sub-groups`,
  })
    .then((res: any) => {
      const ok = res?.success === true || res?.code === 200 || res?.code === '0'
      const raw = res?.data ?? res
      const list = Array.isArray(raw) ? raw : raw?.list ?? []
      return { success: !!ok, data: list }
    })
    .catch(() => ({ success: false, data: [] }))
}

export const cancelOrderService = (params: {
  orderId: number
}): Promise<{ success: boolean; message?: string }> => {
  return request({
    method: 'POST',
    url: `/order/cancel`,
    data: params,
  })
    .then((res: any) => ({
      success: res?.success === true || res?.code === 200 || res?.code === '0',
      message: res?.message,
    }))
    .catch(() => ({ success: false, message: '取消失败' }))
}

/** 根据订单ID获取辅材列表 */
export const getMaterialsByOrderId = (orderId: number | string): Promise<any> => {
  return request({
    method: 'GET',
    url: `/materials/order/${orderId}`,
  })
}

/** 根据工价项ID和工匠ID获取辅材列表 */
export const getMaterialsByWorkPriceItemIdAndCraftsman = (
  workPriceItemId: number | string,
  assignedCraftsmanId: number | string,
): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-price-item/${workPriceItemId}/materials/craftsman/${assignedCraftsmanId}`,
  })
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

/** 验收辅材清单 */
export const acceptOrderMaterialsService = (params: { materialsId: number }): Promise<any> => {
  return request({
    method: 'POST',
    url: `/materials/accept`,
    data: params,
  })
}

/** 批量验收辅材清单 */
export const batchAcceptOrderMaterialsService = (params: {
  materialsIds: number[]
}): Promise<any> => {
  return request({
    method: 'POST',
    url: `/materials/batch-accept`,
    data: params,
  })
}
