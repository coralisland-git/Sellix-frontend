import { authApi } from 'utils'

export const getAnalyticsData = (start, end) => () => {

    let isAdmin = window.location.pathname.includes('admin/dashboard');
    let url = `/${isAdmin ? 'admin' : 'self'}/analytics?last_hours=true`;
    if(start) {
        url = `/${isAdmin ? 'admin' : 'self'}/analytics?from=${start}&to=${end}&year=true`;
    }

    return authApi.get(url)
        .then(res => {
            if (res.status === 200) {
                return res
            } else if (res.status === 401) {
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