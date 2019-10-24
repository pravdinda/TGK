import { LOGGED_IN, LOGGED_OUT, USER_INFO_LOADED } from 'actions/auth'

export const isLoggedIn = (state = false, action) => {
  if (action.type === LOGGED_IN) {
    return true
  } else if (action.type === LOGGED_OUT) {
    return false
  }
  return state
}

export const userInfo = (state = null, action) => {
  if (action.type === USER_INFO_LOADED) {
    return action.payload
  }
  return state
}