import {
    Invoice,
    EmbededInvoice
} from 'screens'
  
const invoiceRoutes = [
  {
    path: '/ivembed/:id',
    name: 'EmbedInvoice',
    component: EmbededInvoice
  },
  {
    path: '/invoice/:id',
    name: 'Bitcoin',
    component: Invoice,
    exact: true
  },
  {
    path: '/payment/:id',
    name: 'Bitcoin',
    component: Invoice,
    exact: true
  }
]
  
export default invoiceRoutes