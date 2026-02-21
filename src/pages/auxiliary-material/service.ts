import { request } from '@/utils/request'

/**
 * 获取辅材品类列表（不分页，直接获取全部）
 */
export const getCategoryListService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/category-config',
  })
}

/**
 * 获取辅材商品列表（参考 fitment-wechat materials）
 */
export const getCommodityListService = (params: {
  pageIndex: number
  pageSize: number
  category_id?: number | null
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/commodity-config/page',
    data: params,
  })
}
