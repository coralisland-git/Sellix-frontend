import { QUERIES, QUERIE } from 'constants/types'
import {
  api,
  authApi,
  formData
} from 'utils'

export const getQueries = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/self/queries`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        console.log({res})
        dispatch({
          type: QUERIES.QUERIES_LIST,
          payload: res.data.queries
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

export const getQuerie = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/queries/unique/${id}`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        console.log({result: res})
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

export const replyQuerie = (querie) => {
  console.log({querie})
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/queries/reply`,
      data: formData(querie),
      withoutAuth: true
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

export const reopenQuerie = (querie) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/queries/reopen`,
      data: formData(querie),
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

export const closeQuerie = (querie) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/queries/close`,
      data: formData(querie)
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