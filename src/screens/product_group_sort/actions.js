import { authApi, formData } from 'utils'


// Save Product Order
export const saveProductGroupOrder = (ids) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: '/groups/sort',
      data: formData(ids)
    }

    return authApi(data).then(res => {
      if(res.status == 200)
        return res
      else throw res
    }).catch(err => {
      throw err
    })
  }
}