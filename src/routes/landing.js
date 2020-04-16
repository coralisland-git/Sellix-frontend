import {
    Home,
    Fees,
    Terms
  } from 'screens'
import {
  Contact,
  Contacts,
  ShopProducts,
  ShopFeedback,
  LeaveFeedback,
  ShopProductDetail
} from 'screens'

import { NotFound } from 'components'

  
  const landingRoutes = [
    {
      path: '/fees',
      component: Fees.screen,
      name: 'Fees'
    },
    {
      path: '/terms',
      component: Terms,
      name: 'Terms'
    },
    {
      path: '/',
      component: Home.screen,
      name: 'Home',
      exact: true
    },
  ]
  
  export default landingRoutes