import request from '@/utils/request'

// 站点配置
export function getSite(params) {
  return request({
    url: 'site',
    method: 'get',
    params
  })
}

export function updateSite(data) {
  return request({
    url: 'site',
    method: 'put',
    data
  })
}

// 充值配置

export function getRecharge(params) {
  return request({
    url: 'rechargeConfigData',
    method: 'get',
    params
  })
}

export function addRecharge(data) {
  return request({
    url: 'rechargeConfig/store',
    method: 'post',
    data
  })
}
export function updateRecharge(data) {
  return request({
    url: '/rechargeConfig/update',
    method: 'post',
    data
  })
}
export function delRecharge(data) {
  return request({
    url: 'rechargeConfig/destroy',
    method: 'delete',
    data
  })
}
export function getScheduledTasksData(data) {
  return request({
    url: 'getScheduledTasksData',
    method: 'post',
    data
  })
}
export function updateScheduledTasks(data) {
  return request({
    url: 'updateScheduledTasks',
    method: 'post',
    data
  })
}
export function getOperationLog(params) {
  return request({
    url: 'getOperationLog',
    method: 'get',
    params
  })
}
