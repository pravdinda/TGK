import * as api from 'api/cities'
import { loadCities } from 'actions/common'

export function getCities() {
  return async dispatch => {
    const res = await api.getCities()
    const { response: { cities } } = await res.json()
    dispatch(loadCities(cities))
  }
  
}