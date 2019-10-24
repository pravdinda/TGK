import { post } from 'utils/api'

export function getCities() {
  return post({ url: 'city/all' })
}