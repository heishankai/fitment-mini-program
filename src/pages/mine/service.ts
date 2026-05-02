import { request } from '@/utils/request'

interface UpdateWechatUserInfoPayload {
  nickname?: string
}

// 根据ID更新微信用户信息
export const updateWechatUserInfoService = (id: number, data: UpdateWechatUserInfoPayload): Promise<any> => {
  return request({
    method: 'PUT',
    url: `/wechat/wechat-user/${id}`,
    data,
  })
}