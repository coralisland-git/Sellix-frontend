import {
  AuthLayout,
  DashboardLayout,
  ShopLayout,
  EmbedLayout,
  SettingsLayout,
  InvoiceLayout,
  LandingLayout,
  DocumentationLayout
} from 'layouts'

const user = window.localStorage.getItem('userId')

const RedirectToLogin = props => {
  window.location = "/auth/login"
}

const mainRoutes = [
  { path: `/settings`,  name: 'SettingsLayout', component: SettingsLayout },

  { path: '/prembed', name: 'EmbedLayout', component: EmbedLayout },
  { path: '/ivembed', name: 'EmbedInvoiceLayout', component: EmbedLayout },
  { path: '/invoice', name: 'InvoiceLayout', component: InvoiceLayout },
  { path: '/payment', name: 'InvoiceLayout', component: InvoiceLayout },
  { path: '/product', name: 'ProductLayout', component: InvoiceLayout },
  { path: '/group', name: 'ProductLayout', component: InvoiceLayout },

  { path: `/dashboard/${user}`, name: 'DashboardLayout', component: DashboardLayout },
  { path: `/admin`, name: 'AdminLayout', component: DashboardLayout },

  { path: `/dashboard/`, name: 'WrongUser', component: RedirectToLogin },

  { path: '/auth', name: 'AuthLayout', component: AuthLayout },

  { path: '/fees', name: 'LandingLayout', component: LandingLayout },
  { path: '/terms', name: 'LandingLayout', component: LandingLayout },
  { path: '/contact', name: 'LandingLayout', component: LandingLayout },
  { path: '/404', name: 'LandingLayout', component: LandingLayout },
  { path: '/changelog', name: 'LandingLayout', component: LandingLayout },

  { path: `/webhooks`, name: 'DashboardLayout', component: DashboardLayout},

  { path: `/documentation`,  name: 'DocumentationLayout', component: DocumentationLayout },
  { path: `/:username`, name: 'ShopLayout', component: ShopLayout },

  { path: '/', name: 'LandingLayout', component: LandingLayout },
]

export default mainRoutes
