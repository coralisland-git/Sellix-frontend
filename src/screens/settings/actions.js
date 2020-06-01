import { SETTINGS } from 'constants/types'
import { authApi, formData } from 'utils'


export const getSettings = () => (dispatch) => (
    authApi.get(`/admin/settings`).then(res => {
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
)

export const updateSettings = (data) => () => {

    return authApi.post(`/admin/settings/update`, formData(data)).then(res => {
      if (res.status === 200) {
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
