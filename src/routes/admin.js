import {
  Dashboard,
  ProductSort,
  CategorySort,
  Product,
  EditProduct,
  Categories,
  CreateCategories,
  EditCategory,
  Order,
  Analytics,
  Reports,
  Coupons,
  CreateCoupon,
  Queries,
  Feedbacks,
  Webhooks,
  WebhookLogs,
  CreatePage,
  Pages,
  CreateProduct,
  OrderDetail,
  ReplyToQuerie,
  Users,
  User,
  TopUsers,
  OrderAdminDetail,
  Settings,
  CreateProductGroup,
  EditProductGroup,
  ProductGroups,
  ProductGroupSort,
  EmbedProduct
} from 'screens';
import { BlackList, CreateBlacklist, EditBlacklist, EditCoupon, ReplyToFeedback } from '../screens'


const user = window.localStorage.getItem('userId')

const adminRoutes = [
  {
    path: `/admin/invoices/:id`,
    name: 'InvoicesView',
    component: OrderDetail.screen
  },
  {
    path: `/admin/invoices`,
    name: 'Orders',
    component: Order.screen
  },
  {
    path: `/admin/settings`,
    name: 'Settings',
    component: Settings.screen
  },
  {
    path: `/admin/settings/bitcoin`,
    name: 'Settings',
    component: Settings.screen
  },
  {
    path: `/admin/settings/litecoin`,
    name: 'Settings',
    component: Settings.screen
  },
  {
    path: `/admin/settings/ethereum`,
    name: 'Settings',
    component: Settings.screen
  },




  {
    path: `/admin/users/:id/product/edit/:id`,
    name: 'EditAdminProduct',
    component: EditProduct.screen
  },
  {
    path: `/admin/users/:id/order/:id`,
    name: 'OrderAdminDetail',
    component: OrderAdminDetail.screen
  },
  {
    path: `/admin/users/:id`,
    name: 'User',
    component: User.screen
  },
  {
    path: `/admin/users`,
    name: 'Users',
    component: Users.screen
  },


  {
    path: `/admin/top`,
    name: 'TopUsers',
    component: TopUsers.screen
  },
  {
    path: `/admin/dashboard`,
    name: 'AdminDashboard',
    component: Dashboard.screen,
    title: 'Dashboard',
    exact: true,
  },





  {
    path: `/dashboard/${user}/home`,
    name: 'Dashboard',
    component: Dashboard.screen,
    title: 'Dashboard',
    exact: true,
  },

  {
    path: `/dashboard/${user}/products/new`,
    name: 'New',
    component: CreateProduct.screen,
    title: 'Create Product',
    exact: true,
  },
  {
    path: `/dashboard/${user}/products/edit/:id`,
    name: 'Edit',
    component: EditProduct.screen,
    title: 'Edit Product',
    exact: true,
  },

  {
    path: `/dashboard/${user}/sort/products`,
    name: 'Product Sort',
    component: ProductSort.screen,
    title: 'Sort Products',
    exact: true,
  },
  {
    path: `/dashboard/${user}/categories/new`,
    name: 'New',
    component: CreateCategories.screen,
    title: 'Create Category',
    exact: true,
  },
  {
    path: `/dashboard/${user}/categories/edit/:id`,
    name: 'Edit',
    component: EditCategory.screen,
    title: 'Edit Category',
    exact: true,
  },

  {
    path: `/dashboard/${user}/sort/categories`,
    name: 'Categories Sort',
    exact: true,
    component: CategorySort.screen,
    title: 'Sort Categories'
  },

  {
    path: `/dashboard/${user}/categories`,
    name: 'Categories',
    component: Categories.screen,
    title: 'Categories',
    exact: true,
  },

  {
    path: `/dashboard/${user}/products`,
    name: 'Products',
    exact: true,
    component: Product.screen,
    title: 'Products'
  },

  {
    path: `/dashboard/${user}/groups/new`,
    name: 'Product Group New',
    exact: true,
    component: CreateProductGroup.screen,
    title: 'Create Group'
  },
  {
    path: `/dashboard/${user}/groups/edit/:id`,
    name: 'Product Group Edit',
    exact: true,
    component: EditProductGroup.screen,
    title: 'Edit Group'
  },
  {
    path: `/dashboard/${user}/groups`,
    name: 'Groups',
    exact: true,
    component: ProductGroups.screen,
    title: 'Groups'
  },

  {
    path: `/dashboard/${user}/sort/groups`,
    name: 'Sort Groups',
    exact: true,
    component: ProductGroupSort.screen,
    title: 'Sort Groups'
  },
 

  {
    path: `/dashboard/${user}/orders/view/:id`,
    name: 'Detail',
    component: OrderDetail.screen,
    title: 'View Order',
    exact: true,
  },

  {
    path: `/dashboard/${user}/orders`,
    name: 'Orders',
    component: Order.screen,
    title: 'Orders',
    exact: true,
  },


  {
    path: `/dashboard/${user}/analytics/reports`,
    name: 'Reports',
    component: Reports.screen,
    title: 'Reports',
    exact: true,
  },
  {
    path: `/dashboard/${user}/analytics/stats`,
    name: 'Analytics',
    component: Analytics.screen,
    title: 'Analytics',
    exact: true,
  },


  {
    path: `/dashboard/${user}/coupons/new`,
    name: 'New',
    component: CreateCoupon.screen,
    title: 'Create Coupon',
    exact: true,
  },
  {
    path: `/dashboard/${user}/coupons/edit/:id`,
    name: 'EditCoupon',
    component: EditCoupon.screen,
    title: 'Edit Coupon',
    exact: true,
  },
  {
    path: `/dashboard/${user}/coupons`,
    name: 'Coupons',
    component: Coupons.screen,
    title: 'Coupons',
    exact: true,
  },

  {
    path: `/dashboard/${user}/blacklist/new`,
    name: 'New',
    component: CreateBlacklist.screen,
    title: 'Create Blacklist',
    exact: true,
  },
  {
    path: `/dashboard/${user}/blacklist/edit/:id`,
    name: 'EditBlacklist',
    component: EditBlacklist.screen,
    title: 'Edit Blacklist',
    exact: true,
  },
  {
    path: `/dashboard/${user}/blacklist`,
    name: 'Blacklist',
    component: BlackList.screen,
    title: 'Blacklists',
    exact: true,
  },
  

  {
    path: `/dashboard/${user}/queries`,
    name: 'Queries',
    component: Queries.screen,
    title: 'Queries',
    exact: true,
  },
  {
    path: `/dashboard/${user}/query/view/:id`,
    name: 'Reply to Query',
    component: ReplyToQuerie,
    title: 'View Query',
    exact: true,
  },
  

  {
    path: `/dashboard/${user}/feedback/reply/:id`,
    name: 'Reply to Feedback',
    component: ReplyToFeedback,
    title: 'Reply to Feedback',
    exact: true,
  },

  {
    path: `/dashboard/${user}/feedback`,
    name: 'Feedback',
    component: Feedbacks.screen,
    title: 'Feedback',
    exact: true,
  },

  {
    path: `/dashboard/${user}/pages/new`,
    name: 'New',
    component: CreatePage.screen,
    title: 'Create page',
    exact: true,
  },

  {
    path: `/dashboard/${user}/pages`,
    name: 'Pages',
    component: Pages.screen,
    title: 'Pages',
    exact: true,
  },

  {
    path: `/dashboard/${user}/developer/embed`,
    name: 'Embed Product',
    component: EmbedProduct.screen,
    title: 'Embed Product'
  },

  {
    path: `/dashboard/${user}/developer/webhooks/all`,
    name: 'Webhooks',
    component: Webhooks.screen,
    title: 'Webhooks',
    exact: true,
  },

  // {
  //   path: `/dashboard/${user}/developer/webhooks/new`,
  //   name: 'New',
  //   component: CreateWebhookSimulator.screen
  // },

  {
    path: `/dashboard/${user}/developer/webhooks/logs`,
    name: 'Weebhook Logs',
    component: WebhookLogs.screen,
    title: 'Webhook Logs',
    exact: true,
  },

  {
    redirect: true,
    path: `/dashboard/${user}`,
    pathTo: `/dashboard/${user}/home`,
  },

  
]

export default adminRoutes