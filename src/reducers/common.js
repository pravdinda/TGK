
import { CITIES_LOADED, HELP_WINDOW_TOGGLED, SUCCESS_PAY_VISIBILITY_TOGGLED, FAIL_PAY_VISIBILITY_TOGGLED } from 'actions/common'

export const helpWindowShowed = (state = false, action) => {
  if (action.type === HELP_WINDOW_TOGGLED) {
    return !state
  }
  return state
}

export const cities = (state = [], action) => {
  if (action.type === CITIES_LOADED) {
    return action.payload
  }
  return state
}

export const successPayShowed = (state = false, action) => {
  if (action.type === SUCCESS_PAY_VISIBILITY_TOGGLED) {
    return action.payload
  }
  return state
}

export const failPayShowed = (state = false, action) => {
  if (action.type === FAIL_PAY_VISIBILITY_TOGGLED) {
    return action.payload
  }
  return state
}

