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
  CreateWebhookSimulator,
  WebhookLogs,
  CreatePage,
  Pages,
  CreateProduct,
  OrderDetail,
  ReplyToQuerie,
  AdminDashboard,
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
    path: `/admin/dashboard`,
    name: 'AdminDashboard',
    component: AdminDashboard,
    title: 'Dashboard'
  },
  {
    path: `/dashboard/${user}/home`,
    name: 'Dashboard',
    component: Dashboard.screen,
    title: 'Dashboard'
  },

  {
    path: `/dashboard/${user}/products/all/new`,
    name: 'New',
    component: CreateProduct.screen,
    title: 'Create Product'
  },
  {
    path: `/dashboard/${user}/products/all/edit/:id`,
    name: 'Edit',
    component: EditProduct.screen,
    title: 'Edit Product'
  },

  {
    path: `/dashboard/${user}/products/sort`,
    name: 'Product Sort',
    component: ProductSort.screen,
    title: 'Sort Products'
  },
  {
    path: `/dashboard/${user}/products/categories/sort`,
    name: 'Categories Sort',
    exact: true,
    component: CategorySort.screen,
    title: 'Sort Categories'
  },


  {
    path: `/dashboard/${user}/products/categories/all/edit/:id`,
    name: 'Edit',
    component: EditCategory.screen,
    title: 'Edit Category'
  },
  {
    path: `/dashboard/${user}/products/categories/all/new`,
    name: 'New',
    component: CreateCategories.screen,
    title: 'Create Category'
  },

  {
    path: `/dashboard/${user}/products/categories/all`,
    name: 'Categories',
    component: Categories.screen,
    title: 'Categories'
  },

  {
    path: `/dashboard/${user}/products`,
    name: 'Products',
    exact: true,
    component: Product.screen,
    title: 'Products'
  },

  {
    path: `/dashboard/${user}/groups/all/new`,
    name: 'Product Group New',
    exact: true,
    component: CreateProductGroup.screen,
    title: 'Create Group'
  },
  {
    path: `/dashboard/${user}/groups/all/edit/:id`,
    name: 'Product Group Edit',
    exact: true,
    component: EditProductGroup.screen,
    title: 'Edit Group'
  },
  {
    path: `/dashboard/${user}/groups/all`,
    name: 'Groups',
    exact: true,
    component: ProductGroups.screen,
    title: 'Groups'
  },

  {
    path: `/dashboard/${user}/groups/sort`,
    name: 'Sort Groups',
    exact: true,
    component: ProductGroupSort.screen,
    title: 'Sort Groups'
  },
 

  {
    path: `/dashboard/${user}/orders/view/:id`,
    name: 'Detail',
    component: OrderDetail.screen,
    title: 'View Order'
  },

  {
    path: `/dashboard/${user}/orders`,
    name: 'Orders',
    component: Order.screen,
    title: 'Orders'
  },


  {
    path: `/dashboard/${user}/analytics/reports`,
    name: 'Reports',
    component: Reports.screen,
    title: 'Reports'
  },
  {
    path: `/dashboard/${user}/analytics/stats`,
    name: 'Analytics',
    component: Analytics.screen,
    title: 'Analytics'
  },


  {
    path: `/dashboard/${user}/coupons/new`,
    name: 'New',
    component: CreateCoupon.screen,
    title: 'Create Coupon'
  },
  {
    path: `/dashboard/${user}/coupons/edit/:id`,
    name: 'EditCoupon',
    component: EditCoupon.screen,
    title: 'Edit Coupon'
  },
  {
    path: `/dashboard/${user}/coupons`,
    name: 'Coupons',
    component: Coupons.screen,
    title: 'Coupons'
  },

  {
    path: `/dashboard/${user}/blacklist/new`,
    name: 'New',
    component: CreateBlacklist.screen,
    title: 'Create Blacklist'
  },
  {
    path: `/dashboard/${user}/blacklist/edit/:id`,
    name: 'EditBlacklist',
    component: EditBlacklist.screen,
    title: 'Edit Blacklist'
  },
  {
    path: `/dashboard/${user}/blacklist`,
    name: 'Blacklist',
    component: BlackList.screen,
    title: 'Blacklists'
  },
  

  {
    path: `/dashboard/${user}/queries`,
    name: 'Queries',
    component: Queries.screen,
    title: 'Queries'
  },
  {
    path: `/dashboard/${user}/query/view/:id`,
    name: 'Reply to Query',
    component: ReplyToQuerie,
    title: 'View Query'
  },
  

  {
    path: `/dashboard/${user}/feedback/reply/:id`,
    name: 'Reply to Feedback',
    component: ReplyToFeedback,
    title: 'Reply to Feedback'
  },

  {
    path: `/dashboard/${user}/feedback`,
    name: 'Feedback',
    component: Feedbacks.screen,
    title: 'Feedback'
  },

  {
    path: `/dashboard/${user}/pages/new`,
    name: 'New',
    component: CreatePage.screen,
    title: 'Create page'
  },

  {
    path: `/dashboard/${user}/pages`,
    name: 'Pages',
    component: Pages.screen,
    title: 'Pages'
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
    title: 'Webhooks'
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
    title: 'Webhook Logs'
  },

  {
    redirect: true,
    path: `/dashboard/${user}`,
    pathTo: `/dashboard/${user}/home`,
  },

  
]

export default adminRoutes