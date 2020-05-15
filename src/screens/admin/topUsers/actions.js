import { TOP_USERS } from 'constants/types'
import {
  api,
  authApi,
  formData
} from 'utils'

export const getTopUsers = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/admin/users/top`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: TOP_USERS.TOP_USERS,
          payload: res.data.users
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
