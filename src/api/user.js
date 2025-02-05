import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adminDoLogin',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/getAdminUserInfo',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/adminDoLogout',
    method: 'post'
  })
}

export function getRole() {
  return request({
    url: '/getRoleList',
    method: 'post'
  })
}
export function getUser(data) {
  return request({
    url: '/getUserList',
    method: 'post',
    data
  })
}
export function addRole(data) {
  return request({
    url: '/adminAddRole',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: '/adminAddUser',
    method: 'post',
    data
  })
}
export function updateRole(data) {
  return request({
    url: '/adminUpdateRole',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/adminUpdateUser',
    method: 'post',
    data
  })
}
export function delUser(data) {
  return request({
    url: '/adminDelUser',
    method: 'post',
    data
  })
}
export function delRole(data) {
  return request({
    url: '/adminDelRole',
    method: 'post',
    data
  })
}

