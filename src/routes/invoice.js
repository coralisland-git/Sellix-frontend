import {
    Invoice,
    EmbededInvoice
  } from 'screens'
  
  const invoiceRoutes = [
    {
      path: '/invoice/embed/:id',
      name: 'EmbedInvoice',
      component: EmbededInvoice.screen
    },
    {
      path: '/invoice/:id',
      name: 'Bitcoin',
      component: Invoice.screen
    }
  ]
  
  export default invoiceRoutes