import { Home, Fees, Terms, Ticket, Changelog } from 'screens'
import { NotFound } from 'components'

const landingRoutes = [
  {
    path: '/fees',
    component: Fees,
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
    path: '/contact',
    component: Ticket,
    name: 'Contact Us'
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    exact: true
  },
]

export default landingRoutes