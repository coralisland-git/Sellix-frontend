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

const user = window.localStorage.getItem('userId')

const RedirectToLogin = props => {
  window.location = "/auth/login"
}

const mainRoutes = [
  // Settings
  { path: `/settings`,  name: 'SettingsLayout', component: SettingsLayout },


  { path: '/payment', name: 'PaymentLayout', component: PaymentLayout },
  { path: '/invoice', name: 'InvoiceLayout', component: InvoiceLayout },
  { path: '/product', name: 'ProductLayout', component: ProductLayout },

  // User
  { path: `/dashboard/${user}`, name: 'UserLayout', component: UserLayout },

  // Wrong user - redirect to dashboard
  { path: `/dashboard/`, name: 'WrongUser', component: RedirectToLogin },

  // Auth 
  { path: '/auth', name: 'AuthLayout', component: AuthLayout },

  // Fees, terms
  { path: '/fees', name: 'LandingLayout', component: LandingLayout },
  { path: '/terms', name: 'LandingLayout', component: LandingLayout },
  { path: '/404', name: 'LandingLayout', component: LandingLayout },

  // Shop
  { path: `/:username`, name: 'ShopLayout', component: ShopLayout },

  // Landing
  { path: '/', name: 'LandingLayout', component: LandingLayout },

]

export default mainRoutes
