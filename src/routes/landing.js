import {
    Home,
    Fees,
    Terms
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
    { path: '/:notexists', name: '404', component: NotFound },
    {
      path: '/',
      component: Home.screen,
      name: 'Home'
    },
  ]
  
  export default landingRoutes