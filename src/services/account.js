import * as api from 'api/account'
import { loadAccountsAction, loadAccountAction } from 'actions/account'

export function getAccounts() {
  return async dispatch => {
    const res = await api.getAccounts()
    const { response } = await res.json()
    dispatch(loadAccountsAction(response.accounts))
  }
}

export function deleteAccount(item) {
  return async dispatch => {
    const res = await api.deleteItem(item)
    const { response } = await res.json()
    dispatch(loadAccountsAction(response.accounts))
  }
}

export function getAccount(number) {
  return async dispatch => {
    const res = await api.getAccounts()
    const { response: { accounts } } = await res.json()
    const account = accounts.find(i => i.number === number)
    if (account) {
      await dispatch(loadAccountAction(account))
    }
    return account
  }
}

export function clearAccount() {
  return dispatch => dispatch(loadAccountAction(null))
}