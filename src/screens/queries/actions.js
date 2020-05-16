import { QUERIES, QUERIE } from 'constants/types'
import { authApi, formData } from 'utils'


export const getQueries = () => (dispatch) =>
    authApi.get(`/self/queries`).then(res => {
      if (res.status === 200) {
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

export const getQuery = (id) => (dispatch) =>
    authApi.get(`/queries/unique/${id}`).then(res => {
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

export const replyToQuery = (query) => () =>
  authApi.post(`/queries/reply`, formData(query)).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })


export const closeQuery = (querie) => () =>
    authApi.post(`/queries/close`, formData(querie)).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })

export const reOpenQuery = (query) => () =>
    authApi.post(`/queries/reopen`, formData(query)).then(res => {
        if (res.status === 200) {
            return res
        } else {
            throw res
        }
    }).catch(err => {
        throw err
    })