import {request} from './index'

export function Login(form) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username: form.username,
      password: form.password,
    }
  }).catch(res => res)
}