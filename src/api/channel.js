import request from '@/utils/request'

// 渠道管理
export function getPushdata(params) {
  return request({
    url: 'pushdata',
    method: 'get',
    params
  })
}

export function doPush(data) {
  return request({
    url: 'dopush',
    method: 'post',
    data
  })
}

export function doPushWy(data) {
  console.log(222)
  console.log(data)
  return request({
    url: '/wangyi/addBook',
    method: 'post',
    data
  })
}

export function pushchapterdata(params) {
  return request({
    url: 'pushchapterdata',
    method: 'get',
    params
  })
}
export function dopushchapter(data) {
  return request({
    url: 'dopushchapter',
    method: 'post',
    data
  })
}

export function dopushchapterwy(data) {
  return request({
    url: '/wangyi/addChapter',
    method: 'post',
    data
  })
}
export function channelExport(params) {
  return request({
    url: 'book/export',
    method: 'get',
    params
  })
}

// 定时任务

// getChannelData
// editChannel
// addBookChannelTask
// getBookTaskByBookId
export function getChannelData(params) {
  return request({
    url: 'getChannelData',
    method: 'get',
    params
  })
}
export function editChannel(data) {
  return request({
    url: 'editChannel',
    method: 'post',
    data
  })
}
export function addBookChannelTask(data) {
  return request({
    url: 'addBookChannelTask',
    method: 'post',
    data
  })
}
export function delBookChannelTask(params) {
  return request({
    url: 'delBookChannelTask',
    method: 'get',
    params
  })
}
export function updateBookChannelTask(data) {
  return request({
    url: 'updateBookChannelTask',
    method: 'post',
    data
  })
}
export function doTaskImport(data) {
  return request({
    url: 'doTaskImport',
    method: 'post',
    data
  })
}
export function getTaskBookList(params) {
  return request({
    url: 'getTaskBookList',
    method: 'get',
    params
  })
}
export function delBookTask(data) {
  return request({
    url: 'delBookTask',
    method: 'post',
    data
  })
}
export function doPushImport(data) {
  return request({
    url: 'doPushImport',
    method: 'post',
    data
  })
}
export function getChannelBook(data) {
  return request({
    url: 'getChannelBook',
    method: 'post',
    data
  })
}

