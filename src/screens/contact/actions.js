import { api, formData, sendAuthedWsMessage } from 'utils'

export const createQuery = (query) => () =>
    api.post(`/queries/create`, formData(query))
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


export const getQuery = (id) => () =>
    api.get(`/queries/unique/${id}`).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })

export const getQuerieViaWebsocket = (id) => {
  return (dispatch) => {

      return sendAuthedWsMessage({ event: 'query', uniqid: id }, 'messages').then(messages => {
        return messages
      })
    }
  }

export const replyToQuery = (query) => () =>
    api.post(`/queries/reply`, formData(query)).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })


export const closeQuery = (query) => () =>
    api.post(`/queries/close`, formData(query)).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })

export const reOpenQuery = (query) => () =>
    api.post(`/queries/reopen`, formData(query)).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })