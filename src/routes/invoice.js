import {
    Invoice,
    EmbededInvoice,
    EmbededInvoiceDev
  } from 'screens'
  
  const invoiceRoutes = [
    {
      path: '/ivembed/:id',
      name: 'EmbedInvoice',
      component: EmbededInvoice.screen
    },
    {
      path: '/payment/:id',
      name: 'EmbedInvoiceDev',
      component: EmbededInvoiceDev.screen
    },
    {
      path: '/invoice/:id',
      name: 'Bitcoin',
      component: Invoice.screen
    },

  ]
  
  export default invoiceRoutes