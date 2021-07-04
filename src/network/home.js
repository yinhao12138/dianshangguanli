import {request} from "./index";

export function Menus() {
  return request({
    url: '/menus',
    method: 'get',
  }).catch(res => res)
}