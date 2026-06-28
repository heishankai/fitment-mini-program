const SHARE_IMAGE_URL =
  'https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1774710271414_danpki_logo.png'

/**
 * 微信小程序：默认「转发给好友 / 分享到朋友圈」。
 * 页面内仍可用 onShareAppMessage / onShareTimeline 覆盖默认配置。
 */
type ShareAppMessageResult = {
  title: string
  path: string
  imageUrl: string
}

type ShareTimelineResult = {
  title: string
  query: string
  imageUrl: string
}

export default {
  onShareAppMessage(): ShareAppMessageResult {
    return {
      title: '智惠装｜装修直连工匠与工长',
      path: getSharePagePath(),
      imageUrl: SHARE_IMAGE_URL,
    }
  },
  onShareTimeline(): ShareTimelineResult {
    return {
      title: '智惠装｜装修直连工匠与工长',
      query: getShareTimelineQuery(),
      imageUrl: SHARE_IMAGE_URL,
    }
  },
}

type PageWithRoute = { $page?: { fullPath?: string } }

function getSharePagePath(): string {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as PageWithRoute
  const fullPath = page?.$page?.fullPath
  if (fullPath) {
    return fullPath.startsWith('/') ? fullPath : `/${fullPath}`
  }
  return '/pages/home/index'
}

function getShareTimelineQuery(): string {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as PageWithRoute
  const fullPath = page?.$page?.fullPath ?? ''
  const queryIndex = fullPath.indexOf('?')
  return queryIndex >= 0 ? fullPath.slice(queryIndex + 1) : ''
}
