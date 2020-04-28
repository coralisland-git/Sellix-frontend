import {
    ShopProductDetail,
    ShopGroupDetail
  } from 'screens'
  
  const paymentRoutes = [
    {
      path: '/product/:id',
      name: 'ShopProductDetail',
      component: ShopProductDetail.screen
    },
    {
      path: '/group/:id',
      name: 'ShopGroupDetail',
      component: ShopGroupDetail.screen
    }
  ]
  
  export default paymentRoutes