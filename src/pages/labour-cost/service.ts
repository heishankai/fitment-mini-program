import { request } from '@/utils/request'

/**
 * 获取工种列表
 */
export const getWorkKindListService = (): Promise<any> => {
  return request({
    method: 'GET',
    url: '/work-kind',
  })
}

/**
 * 获取工价列表
 */
export const getPriceListService = (params: {
  pageIndex: number
  pageSize: number
  work_kind_id?: number
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/work-type/page',
    data: params,
  })
}
