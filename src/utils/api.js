import cookie from 'js-cookie';
import { userInfoLoaded } from 'actions/auth'
import store from 'store'

const API_URL = process.env.API_URL

let accessToken = cookie.get('access_token')
let refreshToken = cookie.get('refresh_token')

export function setToken(token) {
  accessToken = token
  cookie.set('access_token', token)
}

export function setRefreshToken(token) {
  refreshToken = token
  cookie.set('refresh_token', token)
}

export function getToken() {
  return accessToken
}

export function getRefreshToken() {
  return refreshToken
}

export async function request({ url, method, data, options = {}, headers = {} }) {
  const response = await _request({ url, method, data, options, headers })
  if (response.status === 401) { 
    if (refreshToken) {
      const isSuccessRefresh = await refreshTokens()
      if (isSuccessRefresh) {
        return await _request({ url, method, data, options, headers })
      }
      await store.dispatch(userInfoLoaded(null))
    }
    return null 
  }
  return response
}

async function _request({ url, method, data, options = {}, headers = {} }) {
  const opts = Object.assign({
    method,
    cache: 'no-cache',
    headers: Object.assign({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }, headers)
  }, options)
  if (accessToken) {
    opts.headers['Authorization'] = `Bearer ${accessToken}`
  }
  if (data) {
    opts.body = JSON.stringify(data)
  }
  return await fetch(`${API_URL}/${url}`, opts)
}

async function refreshTokens() {
  const res = await post({ url: 'user/access_token/new', data: { refresh_token: refreshToken } })
  const { success, response: { access_token, refresh_token } } = await res.json()
  if (success) {
    cookie.set('access_token', access_token)
    cookie.set('refresh_token', refresh_token)
    accessToken = access_token
    refreshToken = refresh_token
    return true
  }
  cookie.remove('access_token')
  cookie.remove('refresh_token')
  accessToken = null
  refreshToken = null
  return false
}

export async function authRequest({ url, method, data, options = {}, headers = {} }) {
  const response = await request({ url, method, data })
  if (response.status === 401) {
    if (refreshToken) {
      if (await refreshTokens()) {
        const response = await request({ url, method, data })
        return response
      } else {
        // clear store
      }
    } else {
      return false
    }
  }
}

export async function get({ url, options, headers }) {
  return await request({ url, options, headers, method: 'GET' })
}

export async function post({ url, data, options, headers }) {
  return await request({ url, data, options, headers, method: 'POST' })
}

export async function del({ url, options, headers }) {
  return await request({ url, options, headers, method: 'DELETE' })
}

export function getNewToken() {

}

export async function checkIsLoggedIn() {
  if (!accessToken) {
    return false
  }
  await post({ url: 'user/' })
  const res = await post({ url: 'account/all' })
  if (res.status === 401) {
    const res = await post({ url: 'user/access_token/new', data: { refresh_token: refreshToken } })
    const { success, response: { access_token, refresh_token } } = await res.json()
    if (success) {
      cookie.set('access_token', access_token)
      cookie.set('refresh_token', refresh_token)
      accessToken = access_token
      refreshToken = refresh_token
      return true
    }
    cookie.remove('access_token')
    cookie.remove('refresh_token')
    accessToken = null
    refreshToken = null
    return false
    
  } 
  return true
}

export function logout() {
  cookie.remove('access_token')
  cookie.remove('refresh_token')
  accessToken = null
  refreshToken = null
}