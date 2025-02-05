import request from '@/utils/request'

// 充值数据
export function dataorderdata(params) {
  return request({
    url: 'dataorderdata',
    method: 'get',
    params
  })
}
export function dataorderexport(params) {
  return request({
    url: 'dataorderexport',
    method: 'get',
    params
  })
}
// 消费数据
export function dataconsumptiondata(params) {
  return request({
    url: 'dataconsumptiondata',
    method: 'get',
    params
  })
}
export function dataconsumptionexport(params) {
  return request({
    url: 'dataconsumptionexport',
    method: 'get',
    params
  })
}
// 网站数据
export function statisticsData(params) {
  return request({
    url: 'statisticsData',
    method: 'get',
    params
  })
}
export function statisticsExport() {
  return request({
    url: 'statisticsExport',
    method: 'get'
  })
}
export function category(params) {
  return request({
    url: 'category/data',
    method: 'get',
    params
  })
}
