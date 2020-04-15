import {
    Contact,
    Contacts,
    ShopProducts,
    ShopFeedback,
    LeaveFeedback,
    ShopProductDetail
  } from 'screens'


  const user = window.localStorage.getItem('userId')
  
  const shopRoutes = [
    {
      path: `/:username/contact/:id`,
      name: 'Contacts',
      component: Contacts
    },
    {
      path: `/:username/contact`,
      name: 'Contact',
      component: Contact.screen
    },


    {
      path: `/:username/query/:id`,
      name: 'Leave Query',
      component: LeaveFeedback.screen
    },

    {
      path: `/:username/feedback/:id`,
      name: 'Leave Feedback',
      component: LeaveFeedback.screen
    },

    {
      path: `/:username/feedback`,
      name: 'Feedback',
      component: ShopFeedback.screen
    },

    {
      path: `/:username/category/:id`,
      name: 'Products',
      component: ShopProducts.screen
    },

    {
      path: `/:username`,
      name: 'Products',
      component: ShopProducts.screen
    },
  ]
  
  export default shopRoutes