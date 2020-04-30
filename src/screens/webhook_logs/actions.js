import { WEBHOOK } from 'constants/types'
import {
  api,
  authApi,
  formData
} from 'utils'

export const getWebhookLogList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/self/webhooks/queue`
    }

    return authApi(data).then(res => {
      dispatch({
        type: WEBHOOK.WEBHOOK_LOG_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const createWebhookSimulator = (simulator) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/webhooks/try`,
      data: formData(simulator)
    }

    return authApi(data).then(res => {
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

export const retryWebhook = (webhook) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/webhooks/retry`,
      data: formData(webhook)
    }

    return authApi(data).then(res => {
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