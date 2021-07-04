import {request} from "./index";

export function getCateList() {
  return request({
    url: '/categories',
    method: 'get'
  }).catch(err => err)

}

export function tabClick(cateId, activeName) {
  return request({
    url: `categories/${cateId}/attributes`,
    method: 'get',
    params: {
      sel: activeName
    }
  }).catch(err => err)

}

export function addPro(from) {
  return request({
    url: '/goods',
    method: 'post',
    data:{
      from
    }
  }).catch(err => err)

}