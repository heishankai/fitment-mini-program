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