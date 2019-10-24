import { post } from 'utils/api'

export function getUserInfo() {
  return post({ url: 'user/' })
}