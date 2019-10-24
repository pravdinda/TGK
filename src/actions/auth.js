
export const LOGGED_IN = 'LOGGED_IN'
export const LOGGED_OUT = 'LOGGED_OUT'
export const USER_INFO_LOADED = 'USER_INFO_LOADED'

export const loggedIn = () => ({
  type: LOGGED_IN,
})

export const userInfoLoaded = info => ({
  type: USER_INFO_LOADED,
  payload: info
})