import { Home, Fees, Terms, Tickets, Changelog } from 'screens'
import { NotFound } from 'components'

const landingRoutes = [
  {
    path: '/fees',
    component: Fees.screen,
    name: 'Fees'
  },
  {
    path: '/changelog',
    component: Changelog,
    name: 'Changelog'
  },
  {
    path: '/terms',
    component: Terms,
    name: 'Terms'
  },
  {
    path: '/404',
    component: NotFound,
    name: '404'
  },
  {
    path: '/ticket',
    component: Tickets.screen,
    name: 'Tickets'
  },
  {
    path: '/',
    component: Home.screen,
    name: 'Home',
    exact: true
  },
]

export default landingRoutes