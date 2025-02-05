import request from '@/utils/request'

// 作者管理
export function getAuthor(params) {
  return request({
    url: 'author/data',
    method: 'get',
    params
  })
}
export function updateAuthor(data) {
  return request({
    url: 'author/update',
    method: 'put',
    data
  })
}
export function authordel(data) {
  return request({
    url: 'authordel',
    method: 'delete',
    data
  })
}

// 作者审核
export function getAuthorAudit(params) {
  return request({
    url: 'authoraudit/data',
    method: 'get',
    params
  })
}

export function addAuthorAudit(data) {
  return request({
    url: 'author/store',
    method: 'post',
    data
  })
}
export function auditAuthor(data) {
  return request({
    url: 'doauthoraudit',
    method: 'put',
    data
  })
}
export function authorauditdel(data) {
  return request({
    url: 'authorauditdel',
    method: 'delete',
    data
  })
}
// 作者导入
export function importDo(data) {
  return request({
    url: 'authoraudit/importDo',
    method: 'post',
    data
  })
}
export function logData(params) {
  return request({
    url: 'author/getAuthorLogData',
    method: 'get',
    params
  })
}

// 作者收益
export function getAuthorBookData(params) {
  return request({
    url: 'getAuthorBookData',
    method: 'get',
    params
  })
}
export function updateThirdPartyProfit(data) {
  return request({
    url: 'updateThirdPartyProfit',
    method: 'post',
    data
  })
}

export function getThirdProfit(params) {
  return request({
    url: 'getThirdProfit',
    method: 'get',
    params
  })
}
export function addThirdProfit(data) {
  return request({
    url: 'addThirdProfit',
    method: 'post',
    data
  })
}
export function updateThirdProfit(data) {
  return request({
    url: 'updateThirdProfit',
    method: 'post',
    data
  })
}
export function getProfit(params) {
  return request({
    url: 'getProfit',
    method: 'get',
    params
  })
}
export function doAuthorAuditAll(data) {
  return request({
    url: 'doAuthorAuditAll',
    method: 'post',
    data
  })
}
