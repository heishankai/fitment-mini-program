import Decimal from 'decimal.js'
import { ORDER_TYPE_ENUM } from '@/constant'

/**
 * 计算最终总价（使用 decimal.js 避免浮点精度问题）
 * @param order_details 订单详情
 * @returns 最终总价，保留 2 位小数
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const calculateFinalTotal = (order_details: any): string => {
  const { total_price, gangmaster_cost, total_service_fee, order_type } = order_details ?? {}

  const totalPrice = new Decimal(total_price ?? 0)
  const serviceFee = new Decimal(total_service_fee ?? 0)
  const gangmasterCost =
    order_type === ORDER_TYPE_ENUM.CRAFTSMAN ? new Decimal(gangmaster_cost ?? 0) : new Decimal(0)

  return totalPrice.plus(gangmasterCost).plus(serviceFee).toFixed(2)
}

/**
 * 转为施工节点数据
 * @param orderDetail 订单详情
 * @param order_type 订单类型：工长订单:gangmaster , 工匠订单:craftsman
 * 1. 如果订单是工匠订单，则施工节点只有一个施工节点
 * 2. 如果订单是工长订单，则按 assigned_craftsman_id 分组，相同工匠的多个工价合并为一个施工节点
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const resolveCraftsmanNodeData = (orderDetail: any): any => {
  const { parent_work_price_groups, order_type, ...rest } = orderDetail ?? {}

  const seen = new Set<number>()
  const construction_gangmaster_nodes = (parent_work_price_groups ?? []).filter((item: any) => {
    const id = item?.assigned_craftsman_id
    if (seen?.has?.(id)) return false
    seen?.add?.(id)
    return true
  })

  return {
    ...rest,
    order_type,
    construction_nodes: order_type === ORDER_TYPE_ENUM.CRAFTSMAN ? [parent_work_price_groups?.[0]] : construction_gangmaster_nodes,
    parent_work_price_groups,
  }
}

/**
 * 子工价分组（/order/:id/sub-groups）→ 与主单 construction_nodes 相同维度的施工节点
 * 仅处理已分配工匠的工价项；组内按 assigned_craftsman_id 去重，取该工匠首条作为入口（与工长单主节点一致）
 * 未分配（null/空）的条目不产生节点；接口仍可为多 work_group 数组，无工匠的组会被自然跳过
 */
export const resolveSubWorkConstructionNodes = (subWorkGroups: any[] | null | undefined): any[] => {
  if (!Array.isArray(subWorkGroups)) return []

  const nodes: any[] = []
  for (const group of subWorkGroups) {
    const items = group?.sub_work_price_groups
    if (!Array.isArray(items) || !items.length) continue

    const seenCraftsman = new Set<number>()
    for (const item of items) {
      const cid = item?.assigned_craftsman_id
      if (cid == null || cid === '') continue
      const idNum = Number(cid)
      if (Number.isNaN(idNum) || seenCraftsman.has(idNum)) continue
      seenCraftsman.add(idNum)
      nodes.push({
        ...item,
        work_group_id: group?.work_group_id ?? item?.work_group_id,
      })
    }
  }
  return nodes
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

