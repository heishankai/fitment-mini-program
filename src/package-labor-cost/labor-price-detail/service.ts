import { request } from '@/utils/request'

/**
 * 获取工价详情
 */
export const getWorkTypeDetailService = (id: string | number): Promise<any> => {
  return request({
    method: 'GET',
    url: `/work-type/${id}`,
  })
}
