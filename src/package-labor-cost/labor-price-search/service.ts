import { request } from '@/utils/request'


/**
 * 模糊查询工价
 */
export const searchPriceListService = (params: {
  pageIndex: number
  pageSize: number
  work_title?: string
}): Promise<any> => {
  return request({
    method: 'POST',
    url: '/work-type/page',
    data: params,
  })
}
