import { SETTINGS } from 'constants/types'
import {
  api,
  authApi,
  formData
} from 'utils'

export const getSettings = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/admin/settings`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SETTINGS.SETTINGS,
          payload: res.data.settings
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
