import { PRODUCT, COUPONS } from 'constants/types'
import {
  api,
  authApi,
  formData
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

export const validateCoupon = (params) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `coupons/check`,
      data: formData(params)
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
  }
}
