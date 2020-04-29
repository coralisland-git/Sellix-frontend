import { SETTINGS } from 'constants/types'

const initState = {
  settings: {},
}


const Settings = (state = initState, action) => {
  const { type, payload} = action
  switch(type) {
    case SETTINGS.SETTINGS:
      return {
        ...state,
        settings: payload
      }
    default:
      return state
  }
}

export default Settings