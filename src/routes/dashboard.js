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

  CreateProduct,
  OrderDetail,
  ReplyToQuery,
  CreateProductGroup,
  EditProductGroup,
  ProductGroups,
  ProductGroupSort,
  EmbedProduct
} from 'screens';


import { BlackList, CreateBlacklist, EditBlacklist, EditCoupon, ReplyToFeedback } from '../screens'


const user = window.localStorage.getItem('userId')

const RedirectToDashboard = () => {
  window.location = `/dashboard/${user}/home`
}

const dashboardRoutes = [
  {
    path: `/dashboard/${user}/home`,
    name: 'Dashboard',
    component: Dashboard,
    title: 'Dashboard',
    exact: true,
  },

  {
    path: `/dashboard/${user}/products/new`,
    name: 'New',
    component: CreateProduct,
    title: 'Create Product',
    exact: true,
  },
  {
    path: `/dashboard/${user}/products/edit/:id`,
    name: 'Edit',
    component: EditProduct,
    title: 'Edit Product',
    exact: true,
  },

  {
    path: `/dashboard/${user}/sort/products`,
    name: 'Product Sort',
    component: ProductSort,
    title: 'Sort Products',
    exact: true,
  },
  {
    path: `/dashboard/${user}/categories/new`,
    name: 'New',
    component: CreateCategories,
    title: 'Create Category',
    exact: true,
  },
  {
    path: `/dashboard/${user}/categories/edit/:id`,
    name: 'Edit',
    component: EditCategory,
    title: 'Edit Category',
    exact: true,
  },

  {
    path: `/dashboard/${user}/sort/categories`,
    name: 'Categories Sort',
    exact: true,
    component: CategorySort,
    title: 'Sort Categories'
  },

  {
    path: `/dashboard/${user}/categories`,
    name: 'Categories',
    component: Categories,
    title: 'Categories',
    exact: true,
  },

  {
    path: `/dashboard/${user}/products`,
    name: 'Products',
    exact: true,
    component: Product,
    title: 'Products'
  },

  {
    path: `/dashboard/${user}/queries/:id`,
    name: 'Reply to Query',
    component: ReplyToQuery,
    title: 'Reply to Query'
  },
  {
    path: `/dashboard/${user}/queries`,
    name: 'Queries',
    component: Queries,
    title: 'Queries'
  },


  {
    path: `/dashboard/${user}/groups/new`,
    name: 'Product Group New',
    exact: true,
    component: CreateProductGroup,
    title: 'Create Group'
  },
  {
    path: `/dashboard/${user}/groups/edit/:id`,
    name: 'Product Group Edit',
    exact: true,
    component: EditProductGroup,
    title: 'Edit Group'
  },
  {
    path: `/dashboard/${user}/groups`,
    name: 'Groups',
    exact: true,
    component: ProductGroups,
    title: 'Groups'
  },

  {
    path: `/dashboard/${user}/sort/groups`,
    name: 'Sort Groups',
    exact: true,
    component: ProductGroupSort,
    title: 'Sort Groups'
  },
 

  {
    path: `/dashboard/${user}/orders/view/:id`,
    name: 'Detail',
    component: OrderDetail,
    title: 'View Order',
    exact: true,
  },

  {
    path: `/dashboard/${user}/orders`,
    name: 'Orders',
    component: Order,
    title: 'Orders',
    exact: true,
  },


  {
    path: `/dashboard/${user}/analytics/reports`,
    name: 'Reports',
    component: Reports,
    title: 'Reports',
    exact: true,
  },
  {
    path: `/dashboard/${user}/analytics/stats`,
    name: 'Analytics',
    component: Analytics,
    title: 'Analytics',
    exact: true,
  },


  {
    path: `/dashboard/${user}/coupons/new`,
    name: 'New',
    component: CreateCoupon,
    title: 'Create Coupon',
    exact: true,
  },
  {
    path: `/dashboard/${user}/coupons/edit/:id`,
    name: 'EditCoupon',
    component: EditCoupon,
    title: 'Edit Coupon',
    exact: true,
  },
  {
    path: `/dashboard/${user}/coupons`,
    name: 'Coupons',
    component: Coupons,
    title: 'Coupons',
    exact: true,
  },

  {
    path: `/dashboard/${user}/blacklist/new`,
    name: 'New',
    component: CreateBlacklist,
    title: 'Create Blacklist',
    exact: true,
  },
  {
    path: `/dashboard/${user}/blacklist/edit/:id`,
    name: 'EditBlacklist',
    component: EditBlacklist,
    title: 'Edit Blacklist',
    exact: true,
  },
  {
    path: `/dashboard/${user}/blacklist`,
    name: 'Blacklist',
    component: BlackList,
    title: 'Blacklists',
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
    component: Feedbacks,
    title: 'Feedback',
    exact: true,
  },

  {
    path: `/dashboard/${user}/developer/embed`,
    name: 'Embed Product',
    component: EmbedProduct,
    title: 'Embed Product'
  },

  {
    path: `/dashboard/${user}/developer/webhooks/all`,
    name: 'Webhooks',
    component: Webhooks,
    title: 'Webhooks',
    exact: true,
  },
  {
    path: `/dashboard/${user}/developer/webhooks/logs`,
    name: 'Weebhook Logs',
    component: WebhookLogs,
    title: 'Webhook Logs',
    exact: true,
  },


  {
    path: `/dashboard/:user`,
    component: RedirectToDashboard,
    exact: true,
  },


]

export default dashboardRoutes