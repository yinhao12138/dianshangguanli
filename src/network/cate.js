import {request} from "./index";

export function getCateList(queryInfo) {
  return request({
    url: '/categories',
    method: 'get',
    params: {
      type: queryInfo.type,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize
    }
  }).catch(err => err)

}

export function getParentCatList(queryInfo) {
  return request({
    url: '/categories',
    method: 'get',
    params: {
      type: queryInfo.type
    }
  }).catch(err => err)

}

export function addCat(addCateFrom) {
  return request({
    url: '/categories',
    method: 'post',
    data: {
      cat_name: addCateFrom.cat_name,
      cat_pid: addCateFrom.cat_pid,
      cat_level: addCateFrom.cat_level
    }
  }).catch(err => err)

}

export function removeCateById(id) {
  // console.log(id);
  return request({
    url: `categories/${id}`,
    method: 'delete',
  }).catch(err => err)

}

export function showEditDialog(id) {
  return request({
    url: `categories/${id}`,
    method: 'get',
  }).catch(err => err)

}

export function modifyCate(goodCateFrom) {
  return request({
    url: `categories/${goodCateFrom.cat_id}`,
    method: 'put',
    data: {
      cat_name: goodCateFrom.cat_name
    }
  }).catch(err => err)

}