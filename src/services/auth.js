import * as api from 'api/auth'
import { userInfoLoaded } from 'actions/auth'

export function loadUserInfo() {
  return async dispatch => {
    const res = await api.getUserInfo()
    const { response: data, success } = await res.json()
    if (success) {
      return dispatch(userInfoLoaded(data))
    }
    return Promise.reject()
  }
}