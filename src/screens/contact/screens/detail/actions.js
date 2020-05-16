import { QUERIES, QUERIE } from 'constants/types'
import {
  api,
  authApi,
  formData,
  sendAuthedWsMessage
} from 'utils'

export const getQuerie = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/queries/unique/${id}`
    }

    return api(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: QUERIE.QUERIE,
          payload: res.data.messages
        })
        return res
        
      } else {
        throw res
      }     
    }).catch(err => {
      throw err
    })
  }
}

export const getQuerieViaWebsocket = (id) => {
  return (dispatch) => {

      return sendAuthedWsMessage({ event: 'query', uniqid: id }, 'messages').then(messages => {
        dispatch({
          type: QUERIE.QUERIE,
          payload: messages
        })
        return messages
      })
    }
  }

export const replyQuerie = (querie) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/queries/reply`,
      data: formData(querie),
      withoutAuth: true
    }

    return api(data).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
  }
}

export const reopenQuerie = (querie) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/queries/reopen`,
      data: formData(querie),
    }

    return api(data).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
  }
}

export const closeQuerie = (querie) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/queries/close`,
      data: formData(querie)
    }

    return api(data).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
  }
}