import { authApi } from 'utils'

export const getAnalyticsData = (start, end) => () => {

    let data = {
      method: 'GET',
      url: `/self/analytics?from=${start}&to=${end}&year=true`
    };

    return authApi(data)
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
}


export const geLastInvoices = () => (dispatch) => {

    return authApi.get('self/invoices/last')
        .then(res => {
            if (res.status === 200) {
                return res
            } else {
                throw res
            }
        }).catch(err => {
            throw err
        })
}