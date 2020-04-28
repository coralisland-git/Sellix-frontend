import { WEBHOOK } from 'constants/types'

const initState = {
  webhook_log_list: [],
}

const WebhookLogReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case WEBHOOK.WEBHOOK_LOG_LIST:      
      return {
        ...state,
        webhook_log_list: Object.assign([], payload.webhooks)
      }

    default:
      return state
  }
}

export default WebhookLogReducer