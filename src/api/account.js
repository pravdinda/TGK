import { post } from 'utils/api'

export function addAccount({ number, code, name, city_id }) {
  const data = { number }
  if (name) {
    data.name = name
  }

  if (code) {
    data.code = code
  }

  if (city_id) {
    data.city_id = city_id
  }

  return post({ url: 'account/new', data })
}


export function getAccounts() {
  return post({ url: 'account/all' })
}

export function deleteItem(item) {
  return post({ url: 'account/delete', data: { type: item.type, id: item.id } })
}

export function updateItemName(item, name) {
  return post({ url: 'account/name/new', data: { type: item.type === 1 ? 1 : 2, id: item.id, name } })
}