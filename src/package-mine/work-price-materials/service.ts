import { request } from '@/utils/request'

interface PayParamsType {
    pay_type: 'material_single' | 'material_batch',
    materialId?: number,
    order_amount: number,
    materialsIds?: number[]
}

// 获取支付参数
export const getPayParamsService = (params: PayParamsType): Promise<any> => {
    return request({ method: 'POST', url: `/wx-pay/materials`, data: params, })
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