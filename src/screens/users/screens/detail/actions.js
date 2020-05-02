import { USER } from 'constants/types'
import { authApi, formData } from 'utils'


export const getUser = (id) => (dispatch) => (
    authApi.get(`/admin/users/view/${id}`)
        .then(res => {
          if (res.status === 200) {
            dispatch({
              type: USER.USER,
              payload: res.data.user
            })
            return res
          } else {
            throw res
          }
        })
        .catch(err => {
          throw err
        })
)


export const updateUser = (user) => () => (
      authApi.post(`admin/users/update`, formData(user))
          .then(res => {
            if (res.status === 200) {
              return res
            } else {
              throw res
            }
          })
          .catch(err => {
            throw err
          })
)