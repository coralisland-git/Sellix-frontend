import { WEBHOOK } from 'constants/types'

const initState = {
  webhook_list: [],
}

const WebhookReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case WEBHOOK.WEBHOOK_LIST:
      return {
        ...state,
        webhook_list: Object.assign([], payload.wehbooks)
      }

    default:
      return state
  }
}

export default WebhookReducer