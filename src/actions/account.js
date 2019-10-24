
export const ACCOUNTS_LOADED = 'ACCOUNTS_LOADED'
export const ACCOUNT_LOADED = 'ACCOUNT_LOADED'
export const READING_DEVICE_SELECTED = 'READING_DEVICE_SELECTED'
export const DOCS_VISIBILITY = 'DOCS_VISIBILITY'
export const OLD_DEVICES_VISIBILITY = 'OLD_DEVICES_VISIBILITY'
export const DEVICES_LOADING = 'DEVICES_LOADING'
export const REQUESTS_LOADING = 'REQUESTS_LOADING'
export const OBJECTS_LOADING = 'OBJECTS_LOADING'
export const CONFIRM_EMAIL_VISIBILITY = 'CONFIRM_EMAIL_VISIBILITY'

export const loadAccountsAction = accounts => ({
  type: ACCOUNTS_LOADED,
  payload: accounts,
})

export const loadAccountAction = account => ({
  type: ACCOUNT_LOADED,
  payload: account,
})


export const setDocsVisibilityAction = visibility => ({
  type: DOCS_VISIBILITY,
  payload: visibility,
})

export const setSelectedReadingsDevice = device => ({
  type: READING_DEVICE_SELECTED,
  payload: device,
})


export const loadDevices = devices => ({
  type: DEVICES_LOADING,
  payload: devices,
})

export const loadObjects = objects => ({
  type: OBJECTS_LOADING,
  payload: objects,
})


export const loadRequestsAction = requests => ({
  type: REQUESTS_LOADING,
  payload: requests,
})

export const setOldDeviceVisibilityAction = visibility => ({
  type: OLD_DEVICES_VISIBILITY,
  payload: visibility,
})

export const setConfirmEmailVisibility = visibility => ({
  type: CONFIRM_EMAIL_VISIBILITY,
  payload: visibility,
})
