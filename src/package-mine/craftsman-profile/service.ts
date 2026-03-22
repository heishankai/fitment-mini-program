import { request } from '@/utils/request'

/**
 * 获取工匠用户信息
 */
export const getCraftsmanUserInfoService = (id: number): Promise<any> => {
  return request({
    method: 'GET',
    url: `/craftsman-user/${id}`,
  })
}

/**
 * 获取工匠审核通过的作品
 */
export const getCraftsmanPublishedWorksListService = (id: number): Promise<any> => {
  return request({
    method: 'GET',
    url: `/home-page-audit/user/${id}/published`,
  })
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