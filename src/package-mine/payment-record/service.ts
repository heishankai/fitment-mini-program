import { request } from '@/utils/request'

export type PaymentType =
  | ''
  | 'materials'
  | 'platform_service_fee'
  | 'gangmaster_cost'
  | 'work_price'
  | 'order'

export interface PaymentRecordQuery {
  pageIndex: number
  pageSize: number
  payment_type?: Exclude<PaymentType, ''>
}

export interface PaymentRecordPage {
  data: any[]
  pageIndex: number
  pageSize: number
  total: number
  pageTotal: number
}

const normalizePage = (payload: any): PaymentRecordPage => {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      pageIndex: 1,
      pageSize: payload.length,
      total: payload.length,
      pageTotal: 1,
    }
  }

  const list = Array.isArray(payload?.data) ? payload.data : []
  const pageIndex = Number(payload?.pageIndex) || 1
  const pageSize = Number(payload?.pageSize) || list.length || 20
  const total = Number(payload?.total) || list.length
  const pageTotal = Number(payload?.pageTotal) || Math.ceil(total / pageSize) || 1

  return {
    data: list,
    pageIndex,
    pageSize,
    total,
    pageTotal,
  }
}

export const getMyPaymentRecordsService = async (
  params: PaymentRecordQuery,
): Promise<{ success: boolean; data: PaymentRecordPage }> => {
  const res: any = await request({
    method: 'GET',
    url: '/payment-record/my',
    data: params,
  })
  const ok =
    res?.success !== false &&
    (res?.code == null || res?.code === 200 || res?.code === '0')
  const payload = res?.data ?? res
  return {
    success: ok,
    data: normalizePage(payload),
  }
}
