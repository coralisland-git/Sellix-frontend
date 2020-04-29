import { USER } from 'constants/types'
import {
  api,
  authApi,
  formData
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}

export const editSettings = (settings) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/admin/settings/update`,
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