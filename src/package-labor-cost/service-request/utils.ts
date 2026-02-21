/**
 * 填写服务需求 - 表单校验工具
 */

/** 校验结果 */
export interface ValidateResult {
  valid: boolean
  message?: string
}

/** 手机号正则（1开头，11位数字） */
const PHONE_REG = /^1[3-9]\d{9}$/

/**
 * 校验手机号
 */
export const validatePhone = (phone: string): ValidateResult => {
  const v = String(phone ?? '').trim()
  if (!v) return { valid: false, message: '请输入手机号码' }
  if (!PHONE_REG.test(v)) return { valid: false, message: '请输入正确的手机号码' }
  return { valid: true }
}

/**
 * 校验建筑面积
 */
export const validateArea = (area: string | number): ValidateResult => {
  const v = String(area ?? '').trim()
  if (!v) return { valid: false, message: '请输入建筑面积' }
  const num = parseFloat(v)
  if (Number.isNaN(num)) return { valid: false, message: '建筑面积格式不正确' }
  if (num <= 0) return { valid: false, message: '建筑面积需大于0' }
  if (num > 99999) return { valid: false, message: '建筑面积不能超过99999' }
  return { valid: true }
}

/**
 * 校验户型结构（必填）
 */
export const validateRoomType = (roomType: string): ValidateResult => {
  const v = String(roomType ?? '').trim()
  if (!v) return { valid: false, message: '请输入户型结构' }
  if (v.length > 20) return { valid: false, message: '户型结构不能超过20个字符' }
  return { valid: true }
}

/**
 * 校验称呼（必填）
 */
export const validateContactName = (name: string): ValidateResult => {
  const v = String(name ?? '').trim()
  if (!v) return { valid: false, message: '请输入您的称呼' }
  if (v.length > 20) return { valid: false, message: '称呼不能超过20个字符' }
  return { valid: true }
}

/**
 * 校验期望上门时间（必填）
 */
export const validateServiceTime = (serviceTime: string): ValidateResult => {
  const v = String(serviceTime ?? '').trim()
  if (!v) return { valid: false, message: '请选择期望上门时间' }
  return { valid: true }
}

/**
 * 校验备注（必填）
 */
export const validateRemark = (remark: string): ValidateResult => {
  const v = String(remark ?? '').trim()
  if (!v) return { valid: false, message: '请填写备注说明' }
  if (v.length > 500) return { valid: false, message: '备注不能超过500字' }
  return { valid: true }
}

/** 服务需求表单数据（校验用） */
export interface ServiceRequestFormData {
  address?: string
  houseType?: string
  roomType?: string
  area?: string | number
  contactName?: string
  contactPhone?: string
  serviceTime?: string
  remark?: string
}

/**
 * 校验服务需求表单（全部必填）
 * @returns 校验通过返回 { valid: true }，否则返回 { valid: false, message }
 */
export const validateServiceRequestForm = (data: ServiceRequestFormData): ValidateResult => {
  // 1. 服务地址
  const address = String(data?.address ?? '').trim()
  if (!address) return { valid: false, message: '请选择或获取服务地址' }

  // 2. 房屋类型
  const houseType = String(data?.houseType ?? '').trim()
  if (!houseType) return { valid: false, message: '请选择房屋类型' }

  // 3. 户型结构
  const roomResult = validateRoomType(data?.roomType ?? '')
  if (!roomResult.valid) return roomResult

  // 4. 建筑面积
  const areaResult = validateArea(data?.area ?? '')
  if (!areaResult.valid) return areaResult

  // 5. 称呼
  const nameResult = validateContactName(data?.contactName ?? '')
  if (!nameResult.valid) return nameResult

  // 6. 手机号
  const phoneResult = validatePhone(data?.contactPhone ?? '')
  if (!phoneResult.valid) return phoneResult

  // 7. 期望上门时间
  const timeResult = validateServiceTime(data?.serviceTime ?? '')
  if (!timeResult.valid) return timeResult

  // 8. 备注说明
  const remarkResult = validateRemark(data?.remark ?? '')
  if (!remarkResult.valid) return remarkResult

  return { valid: true }
}
