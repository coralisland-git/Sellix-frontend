import { authApi, formData } from 'utils'


export const getSettings = () => () => (
    authApi.get(`/admin/settings`).then(res => {
      if (res.status === 200) {
        return res.data.settings
      } else if (res.status === 401) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
)

export const updateSettings = (data) => () => {

    return authApi.post(`/admin/settings/update`, formData(data)).then(res => {
      if (res.status === 200) {
        return res
      } else if (res.status === 401) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
}

export const updateStatus = (data) => () => {
    return authApi.post(`/admin/status/update`, formData(data)).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
}

export const getStatus = () => () => {

    return authApi.get(`/status`).then(res => {
      if (res.status === 200) {
        return res
      } else {
        throw res
      }
    }).catch(err => {
      throw err
    })
}
