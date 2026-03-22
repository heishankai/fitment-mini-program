import { getWechatUserRooms, createOrGetRoomByCraftsman } from './service'

interface CraftsmanUser {
  id: number | string
  nickname?: string
  [key: string]: unknown
}

/**
 * 联系工匠 - 进入聊天房间
 * @param craftsman_user 工匠用户信息
 */
export const handleContactUser = async (craftsman_user: CraftsmanUser): Promise<void> => {
  const { id, nickname } = craftsman_user ?? {}
  if (!id) return

  try {
    uni.showLoading({ title: '加载中...', mask: true })

    const roomsRes = await getWechatUserRooms()

    if (!roomsRes?.success) {
      uni.hideLoading()
      return
    }

    const existingRoom = (roomsRes?.data ?? []).find((room: any) => room?.craftsman_user?.id === id)

    if (existingRoom) {
      uni.hideLoading()
      uni.navigateTo({
        url: `/package-mine/craftsman-service/index?room_id=${existingRoom.id}&craftsmanUserId=${id}&craftsmanUserName=${encodeURIComponent(nickname || '')}`,
      })
      return
    }

    const createRes = await createOrGetRoomByCraftsman({
      craftsman_user_id: Number(id),
    })

    uni.hideLoading()

    if (!createRes?.success || !createRes?.data) {
      uni.showToast({
        title: createRes?.message || '创建聊天房间失败',
        icon: 'none',
      })
      return
    }

    uni.navigateTo({
      url: `/package-mine/craftsman-service/index?room_id=${createRes.data.id}&craftsmanUserId=${id}&craftsmanUserName=${encodeURIComponent(nickname || '')}`,
    })
  } catch (error: any) {
    uni.hideLoading()
    console.error('联系工匠失败:', error)
  }
}
