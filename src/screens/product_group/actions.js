import { PRODUCT_GROUP } from 'constants/types'
import {
  authApi,
  formData
} from 'utils'


// Get Product List
export const getProductGroupList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/self/groups'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PRODUCT_GROUP.ALL_PRODUCT_GROUPS,
        payload: res.data.groups
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Product By ID
export const getProductGroupByID = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `groups/unique/${id}`
    }

    return authApi(data).then(res => {
      if (res.status === 200) {
        // dispatch({
        //   type: PRODUCT.CURRENT_PRODUCT,
        //   payload: res.data.product
        // })
        return res
      } else {
        throw res
      }     
    }).catch(err => {
      throw err
    })
  }
}


// Create New Product Group
export const createProductGroup = (product) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `groups/create`,
      data: formData(product)
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


// Save Product
export const editProductGroup = (product) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `groups/edit`,
      data: formData(product)
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



// // Duplicate Product
// export const duplicateProduct = (product) => {
//   return (dispatch) => {
//     let data = {
//       method: 'POST',
//       url: `/products/duplicate`,
//       data: formData(product)
//     }

//     return authApi(data).then(res => {
//       if (res.status === 200) {
//         return res
//       } else {
//         throw res
//       }
//     }).catch(err => {
//       throw err
//     })
//   }
// }


// Delete Product
export const deleteProductGroup = (product) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `groups/delete`,
      data: formData(product)
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