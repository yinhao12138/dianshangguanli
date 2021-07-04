import {request} from "./index";


export function User(queryInfo) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      query: queryInfo.query,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize
    }
  }).catch(res => res)
}

export function status(userInfo) {
  return request({
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: 'put'
  }).catch(res => res)
}

export function addUser(addFrom) {
  // console.log(addFrom);
  return request({
    url: '/users',
    method: 'post',
    data: {
      username: addFrom.username,
      password: addFrom.password,
      email: addFrom.email,
      mobile: addFrom.mobile
    }
  }).catch(res => res)
}

export function deleteUser(id) {
  return request({
    url: `users/${id}`,
    method: 'get'
  }).catch(res => res)
}

export function modifyUser(editFrom) {
  return request({
    url: `users/${editFrom.id}`,
    method: 'put',
    data: {
      email: editFrom.email,
      mobile: editFrom.mobile
    }
  }).catch(res => res)
}

export function delUser(id) {
  return request({
    url: `users/${id}`,
    method: 'delete',
  }).catch(res => res)
}

export function setRole() {
  return request({
    url: 'roles',
    method: 'get',
  }).catch(res => res)
}
export function savaRoleInfo(userInfo,selectedRoleId) {
  return request({
    url: `users/${userInfo.id}/role`,
    method: 'put',
    data:{
      rid:selectedRoleId
    }
  }).catch(res => res)
}