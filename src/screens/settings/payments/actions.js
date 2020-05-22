import { formData, authApi } from 'utils'

// Save Notification
export const savePayments = (settings) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/settings/payments`,
      data: formData(settings)
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

// Stripe authorize
export const stripeAuthorize = (code) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/stripe/connect`,
      data: formData({
        code
      })
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

// Stripe deauthorize
export const stripeDeauthorize = () => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/stripe/deauthorize`
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