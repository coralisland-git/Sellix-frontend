import {
    SecurityPage,
    Notification,
    Payments,
    GeneralSettings,
    ShopDesign,
    ShopGoogleAnalytics,
    StripeCallback,
  } from 'screens'

  const user = window.localStorage.getItem('userId')
  
  const settingsRoute = [
    {
      path: `/settings/${user}/general`,
      name: 'GeneralSettings',
      component: GeneralSettings.screen,
        title: 'Settings - Details'
    },
    {
      path: `/settings/${user}/security`,
      name: 'Security',
      component: SecurityPage.screen,
        title: 'Settings - Security'
    },
    {
        path: `/settings/${user}/notifications`,
        name: 'Notifications',
        component: Notification.screen,
        title: 'Settings - Notifications'
    },

    {
        path: `/settings/${user}/payments`,
        name: 'Payments',
        component: Payments.screen,
        title: 'Settings - Payments'
    },

    {
      path: `/settings/${user}/design`,
      name: 'Design',
      component: ShopDesign.screen,
        title: 'Settings - Design'
    },

    {
      path: `/settings/${user}/analytics`,
      name: 'Analytics',
      component: ShopGoogleAnalytics.screen,
        title: 'Settings - Analytics'
    },

    {
      path: `/settings/stripe/connect`,
      name: 'Stripe callback',
      component: StripeCallback.screen,
      title: 'Stripe Callback'
    },
    {
      redirect: true,
      pathTo: `/settings/${user}/general`,
      path: `/settings`,
      name: 'GeneralSettings',
    },
  ]
  
  export default settingsRoute