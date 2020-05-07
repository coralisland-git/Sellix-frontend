import { COMMON } from 'constants/types'
import {
  api,
  authApi,
  formData,
  sendWsMessage
} from 'utils'

export const startRequest = () => {
  return (dispatch) => {
    dispatch({
      type: COMMON.START_LOADING
    })
  }
}

export const endRequest = () => {
  return (dispatch) => {
    dispatch({
      type: COMMON.END_LOADING
    })
  }
}


export const checkDiscordChannel = (channel) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: `/discord/try`,
      data: formData(channel)
    }
    return authApi(data).then(res => {
      if(res && res.status == 200) {
        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}



export const getGeneralUserInfo = (username) => {
  return (dispatch) => {

    let data = {
      method: 'get',
      url: `/users/${username}`,
    }

    return api(data)
        .then(res => {
          let { status, data } = res;
          if(status === 200) {
            let { shop_dark_mode } = data.user;
            dispatch({
              type: COMMON.SHOP_THEME,
              payload: shop_dark_mode === '1' ? 'dark' : 'light'
            })
            dispatch({
              type: COMMON.GENERAL_USER_INFO,
              payload: data
            })
            return data
          } else {
            throw res
          }
        }).catch(err => {
          throw err
        })
  }
}


export const createInvoice = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/invoices/create',
      data: formData(obj)
    }
    return api(data).then(res => {
      if(res && res.status == 200) {
        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}

export const getUserReviews = (username) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/feedback/user/${username}`,
    }
    return api(data).then(res => {
      if(res && res.status == 200) {
        dispatch({
          type: COMMON.USER_FEEDBACKS,
          payload: res.data
        })
        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}


export const getFeedbackByUniqid = (uniqid) => (dispatch) => {

    return api.get(`/feedback/unique/${uniqid}`)
        .then(res => {
          if(res && res.status === 200) {
            return res
          } else {
            throw res
          }
        })
        .catch(err => {
          throw err
        })
}


export const getUserProductById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/products/unique/${id}`,
    }
    return api(data).then(res => {
      if(res && res.status == 200) {
        dispatch({
          type: COMMON.SHOP_THEME,
          payload: res.data.product.theme
        })

        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}


export const getInvoice = (id) => (dispatch) => {

    return api.get(`/invoices/unique/${id}`)
        .then(res => {
            if(res && res.status === 200) {
              dispatch({
                type: COMMON.SHOP_THEME,
                payload: res.data.invoice.theme
              })
              return res
            } else {
              throw res
            }
        })
        .catch(err => {
          throw err
        })
}

export const getInvoiceViaWebsocket = (id) => {
  return (dispatch) => {
    return sendWsMessage({ event: 'invoice', uniqid: id }, 'invoice').then(invoice => {
      dispatch({
        type: COMMON.SHOP_THEME,
        payload: invoice.theme
      })
      return invoice
    })
  }
}

export const getPayPalInvoice = (id) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/invoices/paypal/${id}`,
    }
    return api(data).then(res => {
      if(res && res.status == 200) {
        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}

export const getUserCategories = (username) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/categories/user/${username}/listed`,
    }
    return api(data).then(res => {
      if(res && res.status == 200) {
        dispatch({
          type: COMMON.USER_CATEGORY,
          payload: res.data
        })
        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}


export const getUserProducts = (username) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/products/user/${username}`,
    }
    return api(data).then(res => {
      if(res && res.status == 200) {
        dispatch({
          type: COMMON.USER_PRODUCTS,
          payload: res.data
        })
        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}





export const getUserProductsByCategory = (filter) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/categories/unique/${filter}`,
    }
    return api(data).then(res => {
      if(res && res.status == 200) {
        dispatch({
          type: COMMON.USER_PRODUCTS,
          payload: {products: res.data.category.products_bound}
        })
        return res
      } else throw res
    }).catch(err => {
      throw err
    })
  }
}

export const setTostifyAlertFunc = (func) => {
  return (dispatch) => {
    dispatch({
      type: COMMON.TOSTIFY_ALERT_FUNC,
      payload: {
        data: func
      }
    })
  }
}

export const tostifyAlert = (status, message) => {
  return (dispatch) => {
    dispatch({
      type: COMMON.TOSTIFY_ALERT,
      payload: {
        status,
        message
      }
    })
  }
}


