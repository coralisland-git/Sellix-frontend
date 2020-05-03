import {
  Dashboard,
  EditProduct,
  Order,
  OrderDetail,
  Users,
  User,
  TopUsers,
  OrderAdminDetail,
  Settings
} from 'screens';


const adminRoutes = [
  {
    path: `/admin/invoices/:id`,
    name: 'InvoicesView',
    component: OrderDetail.screen,
    title: 'Invoice ',
  },
  {
    path: `/admin/invoices`,
    name: 'Orders',
    component: Order.screen,
    title: 'Invoices',
  },
  {
    path: `/admin/settings`,
    name: 'Settings',
    component: Settings.screen,
    title: 'Settings',
  },
  {
    path: `/admin/users/:username/product/edit/:id`,
    name: 'EditAdminProduct',
    component: EditProduct.screen,
    title: 'User Product',
  },
  {
    path: `/admin/users/:username/order/:id`,
    name: 'OrderAdminDetail',
    component: OrderDetail.screen,
    title: 'User Order',
  },
  {
    path: `/admin/users/:id`,
    name: 'User',
    component: User.screen,
    title: 'User',
  },
  {
    path: `/admin/users`,
    name: 'Users',
    component: Users.screen,
    title: 'Users',
  },
  {
    path: `/admin/top`,
    name: 'TopUsers',
    component: TopUsers.screen,
    title: 'Top Users',
  },
  {
    path: `/admin/dashboard`,
    name: 'AdminDashboard',
    component: Dashboard.screen,
    title: 'Dashboard'
  },
  {
    redirect: true,
    path: `/admin`,
    pathTo: `/`,
  },
]

export default adminRoutes