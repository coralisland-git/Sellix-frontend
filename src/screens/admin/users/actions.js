import { USERS } from 'constants/types'
import { authApi } from 'utils'


export const getUsers = () => (dispatch) =>
    authApi.get(`/admin/users`)
        .then(res => {
          if (res.status === 200) {
            dispatch({
              type: USERS.USERS,
              payload: res.data.users
            });
            return res
          } else {
            throw res
          }
        })
        .catch(err => {
          throw err
        })