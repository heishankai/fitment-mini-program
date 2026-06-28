import { WEBVIEWURL } from './request'

/** 拼接 web-view 完整地址，并在控制台输出 */
export function buildWebViewUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${WEBVIEWURL}${normalizedPath}`
  console.log('[webView跳转] 完整地址:', url)
  return url
}
