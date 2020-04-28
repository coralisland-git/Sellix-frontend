import { PRODUCT_GROUP } from 'constants/types'

const initState = {
  all_product_groups: []
}

const ProductGroupReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {
    case PRODUCT_GROUP.ALL_PRODUCT_GROUPS:
      return {
        ...state,
        all_product_groups: Object.assign([], payload)
      }

    // case PRODUCT.PRODUCT_LIST:
    //   return {
    //     ...state,
    //     product_list: Object.assign([], payload.data)
    //   }

    default:
      return state
  }
}

export default ProductGroupReducer