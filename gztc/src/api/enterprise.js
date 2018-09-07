import request from '@/http.js'
/**
 * 获取服务类型接口
 */
export function getService () {
  return request({
    url: '/api/qyorder/getService',
    method: 'POST'
  })
}
/**
 * 获取服务类型接口
 */
export function getServiceOrderList (data) {
  return request({
    url: '/api/qyorder/getServiceOrderList',
    method: 'POST',
    data
  })
}
/**
 * 获取服务订单详情接口
 */
export function getServiceOrderDetails (data) {
  return request({
    url: '/api/qyorder/getServiceOrder',
    method: 'POST',
    data
  })
}
/**
 * 员工接单/员工服务/完成接口
 */
export function updateOrderStatus (data) {
  return request({
    url: '/api/qyorder/updateOrderStatus',
    method: 'POST',
    data
  })
}
/**
 * 员工报价
 */
export function quotedPrice (data) {
  return request({
    url: '/api/qyorder/quotedPrice',
    method: 'POST',
    data
  })
}
