import request from '@/utils/request'
// 账号管理
export function getMember(params) {
  return request({
    url: 'member/data',
    method: 'get',
    params
  })
}
export function delMember(data) {
  return request({
    url: 'member/destroy',
    method: 'delete',
    data
  })
}
export function resetMember(data) {
  return request({
    url: 'member/reset',
    method: 'post',
    data
  })
}
export function exportMember(data) {
  return request({
    url: 'member/export',
    method: 'post',
    data
  })
}
// 粉丝等级
export function getFanslevel(params) {
  return request({
    url: 'fanslevel/data',
    method: 'get',
    params
  })
}
export function addFanslevel(data) {
  return request({
    url: 'fanslevel/store',
    method: 'post',
    data
  })
}
export function updateFanslevel(data) {
  return request({
    url: 'fanslevel/update',
    method: 'post',
    data
  })
}
export function delFanslevel(data) {
  return request({
    url: 'fanslevel/destroy',
    method: 'delete',
    data
  })
}
// 会员等级
export function getMemberlevel(params) {
  return request({
    url: 'memberlevel/data',
    method: 'get',
    params
  })
}
export function addMemberlevel(data) {
  return request({
    url: 'memberlevel/store',
    method: 'post',
    data
  })
}
export function updateMemberlevel(data) {
  return request({
    url: 'memberlevel/update',
    method: 'post',
    data
  })
}
export function delMemberlevel(data) {
  return request({
    url: 'memberlevel/destroy',
    method: 'delete',
    data
  })
}
// 忘记密码
export function forgetpassword(params) {
  return request({
    url: 'forgetpassword/data',
    method: 'get',
    params
  })
}

// 充值-充值记录

export function addUserGold(data) {
  return request({
    url: 'addUserGold',
    method: 'post',
    data
  })
}
export function getUserNameByID(params) {
  return request({
    url: 'getUserNameByID',
    method: 'get',
    params
  })
}
export function getRechargeDataByUserId(params) {
  return request({
    url: 'getRechargeDataByUserId',
    method: 'get',
    params
  })
}
export function getAddUserGoldData(params) {
  return request({
    url: 'getAddUserGoldData',
    method: 'get',
    params
  })
}
