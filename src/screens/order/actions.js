import { ORDER } from 'constants/types'
import { authApi, formData, sendAuthedWsMessage } from 'utils'

// Get Invoice List
export const getOrderList = () => {
  return (dispatch) => {

    let isAdmin = window.location.pathname.includes('admin')
    let url = `/${isAdmin ? 'admin' : 'self'}/invoices`;

    return authApi.get(url).then(res => {
      dispatch({
        type: ORDER.ALL_ORDERS,
        payload: res.data.invoices
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Live Orders
export const getLiveOrders = () => {
  return (dispatch) => {
    let isAdmin = window.location.pathname.includes('admin')
    let url = `/${isAdmin ? 'admin' : 'self'}/invoices/live`;

    return authApi.get(url).then(res => {
      dispatch({
        type: ORDER.ALL_ORDERS,
        payload: res.data.invoices
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const getLiveOrdersViaWebsocket = () => {
  return (dispatch) => {

      sendAuthedWsMessage({ event: 'orders' }, 'invoices').then(invoices => {
        dispatch({
          type: ORDER.ALL_ORDERS,
          payload: invoices
        })
        return invoices
      })
    }
  }



// Get Invoice By ID
export const getOrderByID = (id) =>  (dispatch) => {
    let isAdmin = window.location.pathname.includes('admin')
    let url = `${isAdmin ? 'admin' : ''}/invoices/unique/${id}`;

    return authApi.get(url).then(res => {
      return res
    }).catch(err => {
      throw err
    })
}


// Resend Invoice
export const resendInvoice = (invoice) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/invoices/resend`,
      data: formData(invoice)
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Process Invoice
export const processOrder = (invoice) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/invoices/process`,
      data: formData(invoice)
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}


export const issueReplacement = (coupon) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/invoices/replacement`,
      data: formData(coupon)
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }}).catch(err => {
      throw err
    })
  }
}