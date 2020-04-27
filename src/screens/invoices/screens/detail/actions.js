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


export const getUser = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/admin/users/view/${id}`
    }

    return authApi(data).then(res => {
      console.log({data})
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


export const updateUser = (user) => {
    return (dispatch) => {
      let data = {
        method: 'POST',
        url: `admin/users/update`,
        data: formData(user),
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