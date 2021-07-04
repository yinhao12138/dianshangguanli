import {request} from "./index";

export function Chart() {
  return request({
    url: 'reports/type/1',
    method: 'get'
  }).catch(err => err)
}