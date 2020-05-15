import { TOP_USERS } from 'constants/types'

const initState = {
  topUsers: [],
}


const TopUsers = (state = initState, action) => {
  const { type, payload} = action
  switch(type) {
    case TOP_USERS.TOP_USERS:
      return {
        ...state,
        topUsers: Object.assign([], payload)
      }
    default:
      return state
  }
}

export default TopUsers