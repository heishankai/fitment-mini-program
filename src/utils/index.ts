import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
/**
 * 猜你喜欢组合式函数
 */
export const useGuessList = (): { guessRef: any; onScrolltolower: any } => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<any>()

  // 滚动触底事件
  const onScrolltolower = (): void => {
    guessRef.value?.getMore()
  }

  // 返回 ref 和事件处理函数
  return {
    guessRef,
    onScrolltolower,
  }
}

/**
 * 预览图片
 * @param current
 * @param urls
 */
export const previewImage = (current: string, urls: string[]): void => {
  wx.previewImage({
    current,
    urls,
  })
}

/**
 * 格式化金额，保留两位小数
 * @param cost
 * @returns
 */
export const formatCost = (cost: number | string | null | undefined): string => {
  const num = Number(cost)
  if (isNaN(num)) return '-'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * 手机号码加密函数
 * @param phone
 * @returns string
 */
export const formatPhone = (phone: string | undefined): string => {
  if (!phone) return ''

  // 如果是11位手机号，格式化为 138****8888
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  // 如果是其他长度，显示前3位和后4位，中间用*代替
  if (phone.length > 7) {
    const start = phone.slice(0, 3)
    const end = phone.slice(-4)
    const middle = '*'.repeat(phone.length - 7)
    return `${start}${middle}${end}`
  }

  // 如果长度不足，直接返回
  return phone
}

/**
 * 获取用户位置信息
 * @returns Promise<{ latitude: number; longitude: number } | null>
 */
export const getUserLocation = async (): Promise<{
  latitude: number
  longitude: number
} | null> => {
  try {
    // 先检查授权状态
    const authResult = await new Promise<{ authSetting: any }>((resolve) => {
      wx.getSetting({
        success: (res) => resolve(res),
        fail: () => resolve({ authSetting: {} }),
      })
    })

    // 如果未授权，请求授权
    if (!authResult.authSetting['scope.userLocation']) {
      const authRes = await new Promise<{ authSetting: any }>((resolve) => {
        wx.authorize({
          scope: 'scope.userLocation',
          success: () => {
            wx.getSetting({
              success: (res) => resolve(res),
              fail: () => resolve({ authSetting: {} }),
            })
          },
          fail: () => {
            wx.showModal({
              title: '提示',
              content: '需要获取您的位置信息，请在设置中开启位置权限',
              showCancel: true,
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting()
                }
              },
            })
            resolve({ authSetting: {} })
          },
        })
      })

      if (!authRes.authSetting['scope.userLocation']) {
        return null
      }
    }

    // 获取位置信息
    const locationRes: any = await new Promise<any>((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02', // 使用GCJ02坐标系（腾讯地图标准）
        altitude: 'true', // 返回高度信息
        isHighAccuracy: true, // 开启高精度定位
        highAccuracyExpireTime: 4000, // 高精度定位超时时间
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      })
    })

    console.log(locationRes, 'locationRes')

    const location = {
      latitude: locationRes.latitude,
      longitude: locationRes.longitude,
    }

    console.log('获取位置成功:', location)
    return location
  } catch (error: any) {
    console.error('获取位置失败:', error)
    wx.showToast({
      title: error.errMsg || '获取位置失败',
      icon: 'none',
    })
    return null
  }
}

/**
 * 格式化时间 - 显示相对时间或日期
 * @param time 时间字符串
 * @returns 格式化后的时间字符串
 */
export const formatTime = (time: string): string => {
  if (!time) return ''
  
  const date = dayjs(time)
  const now = dayjs()
  const diffDays = now.diff(date, 'day')
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.format('M-D')
  }
}

/**
 * 格式化日期时间范围
 * 如果开始时间和结束时间的日期相同，结束时间只显示时间部分
 * @param startTime 开始时间字符串
 * @param endTime 结束时间字符串（可选）
 * @returns 格式化后的时间范围字符串
 */
export const formatDateTimeRange = (startTime: string, endTime?: string): string => {
  if (!startTime) return ''
  
  if (!endTime) {
    return startTime
  }
  
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  
  // 判断日期是否相同
  const isSameDate = start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')
  
  if (isSameDate) {
    // 日期相同，结束时间只显示时间部分
    return `${startTime} - ${end.format('HH:mm')}`
  } else {
    // 日期不同，都显示完整日期时间
    return `${startTime} - ${endTime}`
  }
}
