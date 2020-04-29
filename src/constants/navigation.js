import { matchPath } from "react-router-dom";

const user = window.localStorage.getItem('userId')

export function mainBrowserNavigation(props){

  let { pathname } = window.location;

  let route = [
    '/dashboard/:username/groups/new',
    '/dashboard/:username/groups/edit/:id',
    '/dashboard/:username/groups',
    '/dashboard/:username/products/new',
    '/dashboard/:username/products/edit/:id',
    '/dashboard/:username/products',
    '/dashboard/:username/categories/new',
    '/dashboard/:username/categories/edit/:id',
    '/dashboard/:username/categories',
    '/dashboard/:username/sort/groups',
    '/dashboard/:username/sort/products',
    '/dashboard/:username/sort/categories',
  ]

  // const match = matchPath(pathname, { path: '/dashboard/:username/groups/:id' })
  return {
    items: [
      {
        name: 'Dashboard',
        url: `/dashboard/${user}/home`,
        icon: 'fas fa-home fa-lg'
      },
      {
        name: 'Products',
        url:
            pathname === `/dashboard/${user}/groups` && `/dashboard/${user}/groups` ||
            pathname.includes(`/dashboard/${user}/groups/new`) && `/dashboard/${user}/groups/new` ||
            pathname.includes(`/dashboard/${user}/groups/edit`) && `/dashboard/${user}/groups/edit` ||
            pathname === `/dashboard/${user}/products` && `/dashboard/${user}/products` ||
            pathname.includes(`/dashboard/${user}/products/new`) && `/dashboard/${user}/products/new` ||
            pathname.includes(`/dashboard/${user}/products/edit`) && `/dashboard/${user}/products/edit` ||
            pathname === `/dashboard/${user}/categories` && `/dashboard/${user}/categories` ||
            pathname.includes(`/dashboard/${user}/categories/new`) && `/dashboard/${user}/categories/new` ||
            pathname.includes(`/dashboard/${user}/categories/edit`) && `/dashboard/${user}/categories/edit` ||
            pathname === `/dashboard/${user}/sort/groups` && `/dashboard/${user}/sort/groups` ||
            pathname === `/dashboard/${user}/sort/products` && `/dashboard/${user}/sort/products` ||
            pathname === `/dashboard/${user}/sort/categories` && `/dashboard/${user}/sort/categories`,
        icon: 'fas fa-boxes',
        children: [
          {
            name: 'All Products',
            url: `/dashboard/${user}/products`
          },
          {
            name: 'Groups',
            url: `/dashboard/${user}/groups`,
          },
          {
            name: 'Categories',
            url: `/dashboard/${user}/categories`,
          },
          {
            name: 'Sort Products',
            url: `/dashboard/${user}/sort/products`,
          },
          {
            name: 'Sort Categories',
            url: `/dashboard/${user}/sort/categories`,
          },
          {
            name: 'Sort Groups',
            url: `/dashboard/${user}/sort/groups`,
          },
        ]
      },
      {
        name: 'Orders',
        url: `/dashboard/${user}/orders`,
        icon: 'fas fa-credit-card',
      },
      {
        name: 'Analytics',
        url: `/dashboard/${user}/analytics`,
        icon: 'fas fa-bar-chart',
        children: [
          {
            name: 'All Analytics',
            url: `/dashboard/${user}/analytics/stats`,
          },
          {
            name: 'Reports',
            url: `/dashboard/${user}/analytics/reports`,
          },
        ]
      },
      {
        name: 'Coupons',
        url: `/dashboard/${user}/coupons`,
        icon: 'fa fa-tags',
      },
      {
        name: 'Queries',
        url: `/dashboard/${user}/queries`,
        icon: 'fas fa-question-circle',
      },
      {
        name: 'Feedback',
        url: `/dashboard/${user}/feedback`,
        icon: "fa fa-commenting",
      },
      {
        name: 'Blacklist',
        url: `/dashboard/${user}/blacklist`,
        icon: 'fas fa-ban',
      },
      {
        name: 'Developer',
        url: `/dashboard/${user}/developer`,
        icon: 'fas fa-code',
        children: [
          {
            name: 'Embed Products',
            url: `/dashboard/${user}/developer/embed`,
          },
          {
            name: 'Webhooks',
            url: `/dashboard/${user}/developer/webhooks`,
          },
          {
            name: 'Webhook Logs',
            url: `/dashboard/${user}/developer/webhooks/logs`,
          }
        ]
      },
      // {
      //   name: 'Pages',
      //   url: `/dashboard/${user}/pages`,
      //   icon: 'fa fa-file',
      // }
    ]
  }
}


export const mainMobileNavigation = () => ({
  items: [
    {
      name: 'Dashboard',
      url: `/dashboard/${user}/home`,
      icon: 'fas fa-home fa-lg'
    },
    {
      name: 'Products',
      url: window.location.pathname,
      icon: 'fas fa-boxes',
      children: [
        {
          name: 'All Products',
          url: `/dashboard/${user}/products`
        },
        {
          name: 'Groups',
          url: `/dashboard/${user}/groups`
        },
        {
          name: 'Categories',
          url: `/dashboard/${user}/categories`,
        }
      ]
    },
    {
      name: 'Orders',
      url: `/dashboard/${user}/orders`,
      icon: 'fas fa-credit-card',
    },
    {
      name: 'Analytics',
      url: `/dashboard/${user}/analytics`,
      icon: 'fas fa-bar-chart',
      children: [
        {
          name: 'All Analytics',
          url: `/dashboard/${user}/analytics/stats`,
        },
        {
          name: 'Reports',
          url: `/dashboard/${user}/analytics/reports`,
        },
      ]
    },
    {
      name: 'Coupons',
      url: `/dashboard/${user}/coupons`,
      icon: 'fa fa-tags',
    },
    {
      name: 'Queries',
      url: `/dashboard/${user}/queries`,
      icon: 'fas fa-question-circle',
    },
    {
      name: 'Feedback',
      url: `/dashboard/${user}/feedback`,
      icon: "fa fa-commenting",
    },
    {
      name: 'Blacklist',
      url: `/dashboard/${user}/blacklist`,
      icon: 'fas fa-ban',
    },
    {
      name: 'Developer',
      url: `/dashboard/${user}/developer`,
      icon: 'fas fa-code',
      children: [
        {
          name: 'Webhooks',
          url: `/dashboard/${user}/developer/webhooks`,
        },
        {
          name: 'Webhook Logs',
          url: `/dashboard/${user}/developer/webhooks/logs`,
        }
      ]
    }
  ]
})

export const adminNavigation =  {
  items: [
    {
      name: 'Dashboard',
      url: `/dashboard/home`,
      icon: 'fas fa-home fa-lg'
    },
    {
      name: 'Users',
      url: `/dashboard/products`,
      icon: 'fas fa-boxes',
    },
    {
      name: 'Top 10 users',
      url: `/dashboard/orders`,
      icon: 'fas fa-credit-card',
    },
    {
      name: 'Analytics',
      url: `/dashboard/analytics`,
      icon: 'fas fa-area-chart',
      children: [
        {
          name: 'All Analytics',
          url: `/dashboard/analytics`,
        },
        {
          name: 'Reports',
          url: `/dashboard/analytics/reports`,
        },
      ]
    },
    {
      name: 'Coupons',
      url: `/dashboard/coupons`,
      icon: 'fa fa-tags',
    },
    {
      name: 'Queries',
      url: `/dashboard/queries`,
      icon: 'fas fa-question-circle',
    },
    {
      name: 'Feedback',
      url: `/dashboard/feedback`,
      icon: "fa fa-commenting",
    },
    {
      name: 'Blacklist',
      url: `/dashboard/blacklist`,
      icon: 'fas fa-ban',
    },
    // {
    //   name: 'Developer',
    //   url: `/dashboard/developer`,
    //   icon: 'fas fa-code',
    //   children: [
    //     {
    //       name: 'Webhooks',
    //       url: `/dashboard/developer/webhooks`,
    //     },
    //     {
    //       name: 'Webhook Logs',
    //       url: `/dashboard/developer/webhook-logos`,
    //     }
    //   ]
    // },
    {
      name: 'Pages',
      url: `/dashboard/pages`,
      icon: 'fa fa-file',
    }
  ]
}


export const accountSettingsNavigation =  {
  items: [
    {
      name: 'General',
      url: `/settings/${user}/general`
    },
    {
      name: 'Security',
      url: `/settings/${user}/security`
    },
    {
      name: 'Notifications',
      url: `/settings/${user}/notifications`
    }
  ]
}


export const shopSettingsNavigation =  {
  items: [
    // {
    //   name: 'Members',
    //   url: `/dashboard/${user}/settings/${user}/memebers`
    // },
    {
      name: 'Payments',
      url: `/settings/${user}/payments`
    },

    {
      name: 'Design',
      url: `/settings/${user}/design`
    },

    {
      name: 'Analytics',
      url: `/settings/${user}/analytics`
    },
    // {
    //   name: 'Billing',
    //   url: `/dashboard/${user}/settings/${user}/billing`
    // },
    // {
    //   name: 'Customization',
    //   url: `/dashboard/${user}/settings/${user}/customization`
    // }
  ]
}