import {
  AuthLayout,
  DashboardLayout,
  AdminLayout,
  ShopLayout,
  EmbedLayout,
  SettingsLayout,
  InvoiceLayout,
  EmbedInvoiceLayout,
  ProductLayout,
  LandingLayout,
  DocumentationLayout
} from 'layouts'

const user = window.localStorage.getItem('userId')

const RedirectToLogin = props => {
  window.location = "/auth/login"
}

const mainRoutes = [
  // Settings
  { path: `/settings`,  name: 'SettingsLayout', component: SettingsLayout },

  { path: '/prembed', name: 'EmbedLayout', component: EmbedLayout },
  { path: '/ivembed', name: 'EmbedInvoiceLayout', component: EmbedInvoiceLayout },
  { path: '/invoice', name: 'InvoiceLayout', component: InvoiceLayout },
  { path: '/product', name: 'ProductLayout', component: ProductLayout },
  { path: '/group', name: 'ProductLayout', component: ProductLayout },

  // User
  { path: `/dashboard/${user}`, name: 'DashboardLayout', component: DashboardLayout },
  { path: `/admin`, name: 'AdminLayout', component: AdminLayout },

  // Wrong user - redirect to dashboard
  { path: `/dashboard/`, name: 'WrongUser', component: RedirectToLogin },

  // Auth 
  { path: '/auth', name: 'AuthLayout', component: AuthLayout },

  // Fees, terms
  { path: '/fees', name: 'LandingLayout', component: LandingLayout },
  { path: '/terms', name: 'LandingLayout', component: LandingLayout },
  { path: '/contact', name: 'LandingLayout', component: LandingLayout },
  { path: '/404', name: 'LandingLayout', component: LandingLayout },
  { path: '/changelog', name: 'LandingLayout', component: LandingLayout },

  { path: `/webhooks`, name: 'DashboardLayout', component: DashboardLayout},
  // Shop
  { path: `/documentation`,  name: 'DocumentationLayout', component: DocumentationLayout },
  { path: `/:username`, name: 'ShopLayout', component: ShopLayout },


  // Landing
  { path: '/', name: 'LandingLayout', component: LandingLayout },



]

export default mainRoutes
