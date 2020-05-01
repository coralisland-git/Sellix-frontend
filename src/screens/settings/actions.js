import { SETTINGS } from 'constants/types'
import { authApi } from 'utils'


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
      } else if (res.status === 401) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
  }
}
