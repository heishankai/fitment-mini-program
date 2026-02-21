import { request } from '@/utils/request'

export interface MaterialSearchItem {
  id: string | number
  name: string
  brand: string
  price: string
  unit: string
  image: string
}

/**
 * 搜索辅材材料（材料名称、品牌、型号）
 */
export const searchMaterialService = (params: {
  pageIndex: number
  pageSize: number
  commodity_name?: string
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/commodity-config/page',
    data: {
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      commodity_name: params.commodity_name,
    },
  })
}
