import { api, formData } from 'utils'

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