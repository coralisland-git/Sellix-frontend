import {
    ShopProductDetail,
    ShopGroupDetail
} from 'screens'
  
const paymentRoutes = [
  {
    path: '/product/:id',
    name: 'ShopProductDetail',
    component: ShopProductDetail.screen,
    exact: true
  },
  {
    path: '/group/:id',
    name: 'ShopGroupDetail',
    component: ShopGroupDetail.screen,
    exact: true
  }
]
  
export default paymentRoutes