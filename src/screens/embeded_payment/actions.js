import { PRODUCT, COUPONS } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}

export const getCoupons = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `self/coupons`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: COUPONS.COUPONS,
          payload: res.data.coupons
        })
        return res
      } else {
        throw res
      }     
    }).catch(err => {
      throw err
    })
  }
}
