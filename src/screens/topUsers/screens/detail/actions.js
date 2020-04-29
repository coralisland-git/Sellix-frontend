import { USER } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}


export const getUser = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/admin/users/view/${id}`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: USER.USER,
          payload: res.data.user
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