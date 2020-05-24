import { api } from 'utils'


export const getInvoiceInfo = (id) => () => {

    let secret = localStorage.getItem(id);

    return api.get(`/invoices/info/${id}/${secret}`)
        .then(res => {
            if(res && res.status === 200) {
              return res
            } else {
              throw res
            }
          }).catch(err => {
              throw err
          })
}

export const downloadInvoice = (id) => (dispatch) => {

    let secret = localStorage.getItem(id);

    return api.get(`/invoices/download/${id}/${secret}`)
        .then(res => {
            if(res && res.status === 200) {
              return res
            } else {
              throw res
            }
          }).catch(err => {
              throw err
          })
}
