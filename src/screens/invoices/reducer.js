import { INVOICES} from 'constants/types'

const initState = {
  invoices:[]
}


const Invoices = (state = initState, action) => {
  const { type, payload} = action
  switch(type) {
    case INVOICES.INVOICES:
      return {
        ...state,
        invoices: Object.assign([], payload)
      }
    default:
      return state
  }
}

export default Invoices