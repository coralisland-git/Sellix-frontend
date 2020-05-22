import { Invoice } from 'screens'
  
const invoiceRoutes = [
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