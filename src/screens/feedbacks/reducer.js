import { FEEDBACKS } from 'constants/types'

const initState = {
  feedbacks: [],
  currentFeedback: null
}

const Feedbacks = (state = initState, action) => {
  const { type, payload} = action
  switch(type) {
    case FEEDBACKS.FEEDBACKS:
      return {
        ...state,
        feedbacks: Object.assign([], payload)
      }

    case FEEDBACKS.CURRENT_FEEDBACK:
      return {
        ...state,
        currentFeedback: Object.assign([], payload)
      }
    default:
      return state
  }
}



export default Feedbacks