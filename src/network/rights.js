import {request} from "./index";

export function getRightList() {
  return request({
    url: '/rights/list',
    method: 'get'
  }).catch(res => res)
}

export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get'
  }).catch(res => res)

}

export function removeRightById(role, rightId) {
  return request({
    url: `roles/${role.id}/rights/${rightId}`,
    method: 'delete'
  }).catch(res => res)
}

export function showSetRightDialog() {
  return request({
    url: `rights/tree`,
    method: 'get'
  }).catch(res => res)
}

export function allotRights(roleId, idStr) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids: idStr
    }
  }).catch(res => res)
}

export function removeUserById(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete',
  }).catch(res => res)
}

export function addRoles(addRolesFrom) {
  return request({
    url: 'roles',
    method: 'post',
    data: {
      roleName: addRolesFrom.roleName,
      roleDesc: addRolesFrom.roleDesc
    }
  }).catch(res => res)
}

export function showEditDialog(id) {
  return request({
    url: `roles/${id}`,
    method: 'get'
  }).catch(res => res)
}

export function modifyUser(editRolesFrom) {
  return request({
    url: `roles/${editRolesFrom.roleId}`,
    method: 'put',
    data: {
      roleName: editRolesFrom.roleName,
      roleDesc: editRolesFrom.roleDesc
    }
  }).catch(res => res)
}




