import { INVOICES } from 'constants/types'
import { authApi } from 'utils'

export const getInvoices = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/admin/invoices`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: INVOICES.INVOICES,
          payload: res.data.invoices
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
