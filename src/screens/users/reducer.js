import { USERS, USER } from 'constants/types'

const initState = {
  users: [],
  user:{}
}


const Users = (state = initState, action) => {
  const { type, payload} = action
  switch(type) {
    case USERS.USERS:
      return {
        ...state,
        users: Object.assign([], payload)
      }
    case USER.USER:
      return {
        ...state,
        user: payload
      }
    case USER.BAN:
      return {
        ...state,
        user: {
          ...state.user,
          banned: payload
        }
      }
    default:
      return state
  }
}

export default Users