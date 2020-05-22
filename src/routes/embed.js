import {EmbededInvoice, EmbededPayment} from 'screens'
  
const embedRoutes = [
    {
        path: '/prembed/:id',
        name: 'EmbededPayment',
        component: EmbededPayment
    },
    {
        path: '/ivembed/:id',
        name: 'EmbedInvoice',
        component: EmbededInvoice
    },
]

export default embedRoutes