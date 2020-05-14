import { EmbededPayment } from 'screens'
  
const paymentRoutes = [
    {
        path: '/prembed/:id',
        name: 'EmbededPayment',
        component: EmbededPayment.screen
    }
]

export default paymentRoutes