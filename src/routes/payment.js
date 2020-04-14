import {
    PaypalPaying,
    Invoice,
    ShopProductDetail,
    EmbededPayment
  } from 'screens'
  
  const paymentRoutes = [
    {
      path: '/payment/paypal',
      name: 'PaypalPay',
      component: PaypalPaying.screen
    },
    {
      path: '/payment/invoice/:id',
      name: 'Bitcoin',
      component: Invoice.screen
    },
    {
      path: '/payment/checkout/:id',
      name: 'ShopProductDetail',
      component: ShopProductDetail.screen
    },
    {
      path: '/payment/embed/:id',
      name: 'EmbededPayment',
      component: EmbededPayment.screen
    }
  ]
  
  export default paymentRoutes