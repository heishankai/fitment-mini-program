import Decimal from 'decimal.js'
import { ORDER_TYPE_ENUM } from '@/constant'

type FeeAmountDetail = {
  index?: number | string | null
  amount?: number | string | null
}

type OrderCostLike = {
  total_price?: number | string | null
  total_service_fee?: number | string | null
  total_service_fee_details?: FeeAmountDetail[] | null
  order_type?: string | null
  gangmaster_cost?: number | string | null
  gangmaster_cost_details?: FeeAmountDetail[] | null
}

/**
 * 计算最终总价（使用 decimal.js 避免浮点精度问题）
 * 与「费用总计」区块展示一致：
 * 工价合计 + 平台服务费（total_service_fee_details / total_service_fee）
 * + 工长费用（仅工长单：gangmaster_cost_details / gangmaster_cost）
 */
const sumFeeDetailAmounts = (details: unknown): Decimal => {
  if (!Array.isArray(details) || details.length === 0) return new Decimal(0)
  return details.reduce(
    (acc: Decimal, item: any) => acc.plus(new Decimal(Number(item?.amount) || 0)),
    new Decimal(0),
  )
}

/** 按后端 index 排序的费用明细（展示顺序） */
export const sortFeeDetailsByIndex = <T extends { index?: number | string | null }>(
  details: T[],
): T[] => {
  if (!Array.isArray(details)) return []
  return [...details].sort((a, b) => Number(a?.index ?? 0) - Number(b?.index ?? 0))
}

/** 主单：平台服务费合计（与 order-cost 列表展示同源） */
export const sumMainOrderPlatformServiceFee = (
  order_details: OrderCostLike | null | undefined,
): Decimal => {
  const { total_service_fee_details, total_service_fee } = order_details ?? {}
  if (Array.isArray(total_service_fee_details) && total_service_fee_details.length > 0) {
    return sumFeeDetailAmounts(total_service_fee_details)
  }
  return new Decimal(total_service_fee ?? 0)
}

/** 主单：工长费用合计（仅工长订单；与 order-cost 工长区块展示同源） */
export const sumMainOrderGangmasterFeeForDisplay = (
  order_details: OrderCostLike | null | undefined,
): Decimal => {
  const { order_type, gangmaster_cost_details, gangmaster_cost } = order_details ?? {}
  if (order_type !== ORDER_TYPE_ENUM.GANGMASTER) return new Decimal(0)
  if (Array.isArray(gangmaster_cost_details) && gangmaster_cost_details.length > 0) {
    return sumFeeDetailAmounts(gangmaster_cost_details)
  }
  return new Decimal(gangmaster_cost ?? 0)
}

export const calculateFinalTotal = (order_details: OrderCostLike | null | undefined): string => {
  const totalPrice = new Decimal(order_details?.total_price ?? 0)
  const serviceFee = sumMainOrderPlatformServiceFee(order_details)
  const gangmasterCost = sumMainOrderGangmasterFeeForDisplay(order_details)
  return totalPrice.plus(serviceFee).plus(gangmasterCost).toFixed(2)
}

const hasAssignedCraftsman = (item: any): boolean => {
  const cid = item?.assigned_craftsman_id
  return cid != null && cid !== ''
}

const getWorkKindKey = (item: any): string => {
  const key = item?.work_kind_code ?? item?.work_kind_name ?? item?.id
  return key == null ? '' : String(key)
}

const getWorkPriceItemIds = (items: any[]): number[] =>
  items.map((item) => Number(item?.id)).filter((id) => Number.isFinite(id))

const buildConstructionNode = (items: any[]): any => {
  const first = items[0]
  return {
    ...first,
    work_price_item_ids: getWorkPriceItemIds(items),
  }
}

/** 工长单：已分配按工匠去重；未分配按工种去重（parent 组可能多条对应同一施工节点） */
const buildGangmasterConstructionNodes = (groups: any[]): any[] => {
  const groupMap = new Map<string, any[]>()

  for (const item of groups) {
    const kindKey = getWorkKindKey(item)
    if (!kindKey) continue
    const groupKey = hasAssignedCraftsman(item)
      ? `craftsman:${item.assigned_craftsman_id}`
      : `kind:${kindKey}`
    const items = groupMap.get(groupKey) ?? []
    items.push(item)
    groupMap.set(groupKey, items)
  }

  return Array.from(groupMap.values()).map(buildConstructionNode)
}

/** 工匠单：整单一个施工节点（工价/辅材/进度均按订单维度跳转） */
const buildCraftsmanConstructionNodes = (groups: any[], orderDetail: any): any[] => {
  if (groups.length > 0) return [buildConstructionNode(groups)]
  const { work_kind_name, id } = orderDetail ?? {}
  if (work_kind_name) return [{ id, work_kind_name }]
  return []
}

/**
 * parent_work_price_groups 为工价分组；施工节点需聚合后展示：
 * - 工匠单：1 个节点
 * - 工长单：已分配工匠各 1 个节点；未分配按工种各 1 个节点
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const resolveCraftsmanNodeData = (orderDetail: any): any => {
  const { parent_work_price_groups, order_type, ...rest } = orderDetail ?? {}
  const groups = Array.isArray(parent_work_price_groups) ? parent_work_price_groups : []

  const construction_nodes =
    order_type === ORDER_TYPE_ENUM.CRAFTSMAN
      ? buildCraftsmanConstructionNodes(groups, orderDetail)
      : buildGangmasterConstructionNodes(groups)

  return {
    ...rest,
    order_type,
    construction_nodes,
    parent_work_price_groups: groups,
  }
}

/** 子工单：所有 sub_work_price_groups 行上 total_service_fee 合计（展示用，保留 2 位小数） */
export const sumSubWorkPriceGroupsLineServiceFee = (
  subWorkGroups: any[] | null | undefined,
): string => {
  if (!Array.isArray(subWorkGroups)) return '0.00'
  let sum = new Decimal(0)
  for (const group of subWorkGroups) {
    const items = group?.sub_work_price_groups
    if (!Array.isArray(items)) continue
    for (const item of items) {
      sum = sum.plus(new Decimal(item?.total_service_fee ?? 0))
    }
  }
  return sum.toFixed(2)
}

/** 子工单：所有 sub_work_price_groups 行的 total_service_fee_is_paid 均为 true */
export const areAllSubWorkLineServiceFeesPaid = (
  subWorkGroups: any[] | null | undefined,
): boolean => {
  if (!Array.isArray(subWorkGroups)) return true
  for (const group of subWorkGroups) {
    const items = group?.sub_work_price_groups
    if (!Array.isArray(items)) continue
    for (const item of items) {
      if (!item?.total_service_fee_is_paid) return false
    }
  }
  return true
}

/**
 * 子工价批量付平台服务费（work_price_sub_service_fee_batch）：
 * `workPriceItemIds` 为各组 sub_work_price_groups 中每一项的 id；
 * `order_amount` 为尚未支付行的 total_service_fee 合计（应付金额）
 */
export const buildSubWorkSubServiceFeeBatchPayParams = (
  subWorkGroups: any[] | null | undefined,
): { workPriceItemIds: number[]; order_amount: number } => {
  const workPriceItemIds: number[] = []
  let unpaidSum = new Decimal(0)
  if (!Array.isArray(subWorkGroups)) return { workPriceItemIds: [], order_amount: 0 }

  for (const group of subWorkGroups) {
    const items = group?.sub_work_price_groups
    if (!Array.isArray(items)) continue
    for (const item of items) {
      const id = item?.id
      if (id != null && !Number.isNaN(Number(id))) {
        workPriceItemIds.push(Number(id))
      }
      if (!item?.total_service_fee_is_paid) {
        unpaidSum = unpaidSum.plus(new Decimal(item?.total_service_fee ?? 0))
      }
    }
  }
  return { workPriceItemIds, order_amount: Number(unpaidSum.toFixed(2)) }
}
