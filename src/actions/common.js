export const CITIES_LOADED = 'CITIES_LOADED'
export const SUCCESS_PAY_VISIBILITY_TOGGLED = 'SUCCESS_PAY_VISIBILITY_TOGGLED'
export const FAIL_PAY_VISIBILITY_TOGGLED = 'FAIL_PAY_VISIBILITY_TOGGLED'

export const loadCities = (cities) => ({
  type: CITIES_LOADED,
  payload: cities,
})


export const HELP_WINDOW_TOGGLED = 'HELP_WINDOW_TOGGLED'

export const toggleHelpWindow = (cities) => ({
  type: HELP_WINDOW_TOGGLED,
})

export const toggleSuccessPay = (show) => ({
  type: SUCCESS_PAY_VISIBILITY_TOGGLED,
  payload: show,
})

export const toggleFailPay = (show) => ({
  type: FAIL_PAY_VISIBILITY_TOGGLED,
  payload: show,
})