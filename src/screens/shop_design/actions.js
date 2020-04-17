import { CONTACT } from 'constants/types'
import {
  formData,
  authApi
} from 'utils'

// Save saveShopSettings
export const saveShopSettings = (settings) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/settings/shop`,
      data: formData(settings)
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