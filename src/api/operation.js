import request from '@/utils/request'
// 小喇叭
export function getSmallhorn(params) {
  return request({
    url: 'operatesmallhorn/data',
    method: 'get',
    params
  })
}
export function updateSmallHorn(data) {
  return request({
    url: 'updateSmallHorn',
    method: 'post',
    data
  })
}
export function updateSmallHornImg(data) {
  return request({
    url: 'updateSmallHornImg',
    method: 'post',
    data
  })
}

// 限免配置
export function getTimefree(params) {
  return request({
    url: 'timefree/data',
    method: 'get',
    params
  })
}
export function addTimefree(data) {
  return request({
    url: 'doaddtimefree',
    method: 'post',
    data
  })
}
export function updateTimefree(data) {
  return request({
    url: 'doupdatetimefree',
    method: 'post',
    data
  })
}
export function delTimefree(data) {
  return request({
    url: 'doudeltimefree',
    method: 'delete',
    data
  })
}
export function getTimefreeD(params) {
  return request({
    url: 'timefreedetail/data',
    method: 'get',
    params
  })
}
export function addTimefreeD(data) {
  return request({
    url: 'doaddtimefreedetail',
    method: 'post',
    data
  })
}
export function updateTimefreeD(data) {
  return request({
    url: 'doupdatetimefreedetail',
    method: 'post',
    data
  })
}
export function delTimefreeD(data) {
  return request({
    url: 'doudeltimefreedetail',
    method: 'delete',
    data
  })
}

// 礼物配置
export function getGift(params) {
  return request({
    url: 'gift/data',
    method: 'get',
    params
  })
}
export function addGift(data) {
  return request({
    url: 'doaddgift',
    method: 'post',
    data
  })
}
export function updateGift(data) {
  return request({
    url: 'doupdategift',
    method: 'post',
    data
  })
}
export function delGift(data) {
  return request({
    url: 'giftdestroy',
    method: 'delete',
    data
  })
}

export function timeFreeTemplate(params) {
  return request({
    url: 'timeFreeTemplate',
    method: 'get',
    params
  })
} export function doTimeFreeImport(data) {
  return request({
    url: 'doTimeFreeImport',
    method: 'post',
    data
  })
}
