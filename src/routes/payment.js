import { EmbededPayment } from 'screens'
  
const paymentRoutes = [
    {
        path: '/payment/embed/:id',
        name: 'EmbededPayment',
        component: EmbededPayment.screen
    }
]

export default paymentRoutes