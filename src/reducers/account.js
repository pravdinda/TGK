import { 
  ACCOUNTS_LOADED, ACCOUNT_LOADED, DOCS_VISIBILITY, READING_DEVICE_SELECTED,
  DEVICES_LOADING, OLD_DEVICES_VISIBILITY, REQUESTS_LOADING, OBJECTS_LOADING,
  CONFIRM_EMAIL_VISIBILITY
 } from 'actions/account'

export const accounts = (state = null, action) => {
  if (action.type === ACCOUNTS_LOADED) {
    return action.payload
  }
  return state
}

export const account = (state = null, action) => {
  if (action.type === ACCOUNT_LOADED) {
    return action.payload
  }
  return state
}

export const docsShowed = (state = false, action) => {
  if (action.type === DOCS_VISIBILITY) {
    return action.payload
  }
  return state
}

export const oldDevicesShowed = (state = false, action) => {
  if (action.type === OLD_DEVICES_VISIBILITY) {
    return action.payload
  }
  return state
}

export const confirmEmailShowed = (state = false, action) => {
  if (action.type === CONFIRM_EMAIL_VISIBILITY) {
    return action.payload
  }
  return state
}

export const selectedReadingsDevice = (state = null, action) => {
  if (action.type === READING_DEVICE_SELECTED) {
    return action.payload
  }
  return state
}

export const devices = (state = null, action) => {
  if (action.type === DEVICES_LOADING) {
    return action.payload
  }
  return state
}

export const objects = (state = null, action) => {
  if (action.type === OBJECTS_LOADING) {
    return action.payload
  }
  return state
}



export const requests = (state = null, action) => {
  if (action.type === REQUESTS_LOADING) {
    return action.payload
  }
  return state
}