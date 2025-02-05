import request from '@/utils/request'

// 消息管理
export function getMessage(params) {
  return request({
    url: 'message/data',
    method: 'get',
    params
  })
}

export function addMessage(data) {
  return request({
    url: 'message/store',
    method: 'post',
    data
  })
}

export function updateMessage(data) {
  return request({
    url: 'message/update',
    method: 'post',
    data
  })
}
export function delMessage(data) {
  return request({
    url: 'message/destroy',
    method: 'delete',
    data
  })
}
export function sendMessage(data) {
  return request({
    url: 'message/send',
    method: 'post',
    data
  })
}
