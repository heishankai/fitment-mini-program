import Decimal from 'decimal.js'

/**
 * 扁平化工价列表：main_work_price_group 有 items 数组，sub_work_price_groups 是组数组（每组有 items）
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const flattenWorkPriceList = (main: any, sub: any[]): any[] => {
  const mainItems = main?.items ?? []
  const subItems = (sub ?? []).flatMap((g) => g?.items ?? [])
  return [...mainItems, ...subItems]
}

/**
 * 单项小计：若设置了最低起步价且 work_price * quantity < minimum_price，则取 minimum_price，否则取 work_price * quantity
 * @param item 工价项
 * @returns 小计金额，保留 2 位小数
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getItemSubtotal = (item: any): string => {
  const workPrice = new Decimal(item?.work_price ?? 0)
  const quantity = new Decimal(item?.quantity ?? 0)
  const rawTotal = workPrice.times(quantity)

  if (item?.is_set_minimum_price === '1') {
    const minimumPrice = new Decimal(item?.minimum_price ?? 0)
    return rawTotal.lt(minimumPrice) ? minimumPrice.toFixed(2) : rawTotal.toFixed(2)
  }

  return rawTotal.toFixed(2)
}

/** 一键支付：有未支付的工价时展示 */
export const showBatchPay = (list: any[]): boolean => {
  return list?.some((item) => !item?.is_paid) ?? false
}

/** 一键验收：全部支付后有未验收的工价时展示 */
export const showBatchAccept = (list: any[]): boolean => {
  if (!list?.length) return false
  const allPaid = list.every((item) => item?.is_paid)
  const hasUnaccepted = list.some((item) => !item?.is_accepted)
  return allPaid && hasUnaccepted
}
