import { authApi, formData } from 'utils'

export const createFeedback = (feedback) => () => authApi.post('/feedback/send', formData(feedback))
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