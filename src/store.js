import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducers from 'reducers'

const loggerMiddleware = createLogger()

const middlewares = [
  thunkMiddleware,
  loggerMiddleware
]

const finalCreateStore = applyMiddleware(...middlewares)(createStore)

function configureStore(initialState = {}) {
  let devtools
  if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    devtools = window.__REDUX_DEVTOOLS_EXTENSION__()
  }

  return finalCreateStore(
    combineReducers(reducers),
    initialState,
    devtools
  )
}

const store = configureStore()

export default store