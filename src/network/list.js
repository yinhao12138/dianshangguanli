import {request} from "./index";

export function getGoodsList(queryInfo) {
  return request({
    url: '/goods',
    method: 'get',
    params: {
      query: queryInfo.query,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize,
    }
  }).catch(err => err)

}
export function removeById(id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  }).catch(err => err)

}