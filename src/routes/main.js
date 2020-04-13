import {
  AuthLayout,
  UserLayout,
  ShopLayout,
  PaymentLayout,
  SettingsLayout,
  InvoiceLayout,
  ProductLayout,
  LandingLayout
} from 'layouts'
import { NotFound } from 'components'

const user = window.localStorage.getItem('userId')

const RedirectToLogin = props => {
  window.location = "/auth/login"
}

const mainRoutes = [
  // Settings
  { path: `/settings`,  name: 'SettingsLayout', component: SettingsLayout },

  // Shop
  { path: `/u/:username`, name: 'ShopLayout', component: ShopLayout },


  { path: '/payment', name: 'PaymentLayout', component: PaymentLayout },
  { path: '/invoice', name: 'InvoiceLayout', component: InvoiceLayout },
  { path: '/product', name: 'ProductLayout', component: ProductLayout },

  // User
  { path: `/dashboard/${user}`, name: 'UserLayout', component: UserLayout },

  // Wrong user - redirect to dashboard
  { path: `/dashboard/`, name: 'WrongUser', component: RedirectToLogin },

  // Auth 
  { path: '/auth', name: 'AuthLayout', component: AuthLayout },

  { path: '/:notexists', name: '404', component: NotFound },

  // Landing
  { path: '/', name: 'LandingLayout', component: LandingLayout },

]

export default mainRoutes
