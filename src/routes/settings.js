import {
    SecurityPage,
    Notification,
    Payments,
    GeneralSettings,
    ShopDesign
  } from 'screens'

  const user = window.localStorage.getItem('userId')
  
  const settingsRoute = [
    {
      path: `/settings/${user}/general`,
      name: 'GeneralSettings',
      component: GeneralSettings.screen
    },
    {
      path: `/settings/${user}/security`,
      name: 'Security',
      component: SecurityPage.screen
    },
    {
        path: `/settings/${user}/notifications`,
        name: 'Notifications',
        component: Notification.screen
    },

    {
        path: `/settings/${user}/payments`,
        name: 'Payments',
        component: Payments.screen
    },

    {
      path: `/settings/${user}/design`,
      name: 'Design',
      component: ShopDesign.screen
    },

    // {
    //     path: `/settings/${user}/memebers`,
    //     name: 'Memebers',
    //     component: MemberPage.screen
    // },
    // {
    //   path: `/settings/${user}/billing`,
    //   name: 'Billings',
    //   component: Billings.screen
    // },
    // {
    //   path: `/settings/${user}/customization`,
    //   name: 'Customization',
    //   component: Customization.screen
    // },
    {
      redirect: true,
      pathTo: `/settings/${user}/general`,
      path: `/settings`,
      name: 'GeneralSettings',
    },
  ]
  
  export default settingsRoute