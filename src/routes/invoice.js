import {
    Invoice,
    EmbededInvoice
} from 'screens'
  
const invoiceRoutes = [
  {
    path: '/ivembed/:id',
    name: 'EmbedInvoice',
    component: EmbededInvoice.screen
  },
  {
    path: '/invoice/:id',
    name: 'Bitcoin',
    component: Invoice.screen,
    exact: true
  },
  {
    path: '/payment/:id',
    name: 'Bitcoin',
    component: Invoice.screen,
    exact: true
  }
]
  
export default invoiceRoutes