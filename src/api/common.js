import request from '@/utils/request'

export function getBookById(data) {
  return request({
    url: 'pcoperatebookInfo',
    method: 'post',
    data
  })
}
export function operateDetailData(params) {
  return request({
    url: 'operateDetailData',
    method: 'get',
    params
  })
}
export function addoperate(data) {
  return request({
    url: 'addoperate',
    method: 'post',
    data
  })
}
export function operateupdate(data) {
  return request({
    url: 'operateupdate',
    method: 'post',
    data
  })
}
export function spreadDestroy(data) {
  return request({
    url: 'spreadDestroy',
    method: 'delete',
    data
  })
}
export function addoperateimg(data) {
  return request({
    url: 'addoperateimg',
    method: 'post',
    data
  })
}

export function addBannerImg(data) {
  return request({
    url: 'addBannerImg',
    method: 'post',
    data
  })
}
export function bannerupdate(data) {
  return request({
    url: 'bannerupdate',
    method: 'post',
    data
  })
}

export function doOperateImport(data) {
  return request({
    url: 'doOperateImport',
    method: 'post',
    data
  })
}

export function getIndexData() {
  return request({
    url: 'getIndexData',
    method: 'get'
  })
}

