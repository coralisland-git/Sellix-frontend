import { ORDER } from 'constants/types'

const initState = {
  order_list : [],
  live_order_display: 'all'
}

const InvoiceReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case ORDER.ALL_ORDERS:
      return {
        ...state,
        order_list: Object.assign([], payload)
      }

    case ORDER.LIVE_ORDER_DISPLAY:
      return {
        ...state,
        live_order_display: payload
      }

    default:
      return state
  }
}

export default InvoiceReducer