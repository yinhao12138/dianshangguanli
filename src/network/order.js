import {request} from "./index";

export function getOrderList(queryInfo) {
  return request({
    url: '/orders',
    method: 'get',
    params: {
      query: queryInfo.query,
      pagenum: queryInfo.pagenum,
      pagesize: queryInfo.pagesize
    }
  }).catch(res => res)
}


