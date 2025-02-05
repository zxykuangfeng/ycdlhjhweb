// testingExcel
// testingTxt

import request from '@/utils/request'

export function testingExcel(params) {
  return request({
    url: 'testingExcel',
    method: 'get',
    params
  })
}
export function testingTxt(data) {
  return request({
    url: 'testingTxt',
    method: 'post',
    data
  })
}
export function addExcelError(data) {
  return request({
    url: 'addExcelError',
    method: 'post',
    data
  })
}
