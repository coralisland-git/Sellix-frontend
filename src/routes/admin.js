import {
  Dashboard,
  EditProduct,
  Order,
  OrderDetail,
  Users,
  User,
  TopUsers,
  Settings,
  Changelog,
  ChangelogCreate
} from 'screens';


const adminRoutes = [
  {
    path: `/admin/invoices/:id`,
    name: 'InvoicesView',
    component: OrderDetail,
    title: 'Invoice ',
  },
  {
    path: `/admin/invoices`,
    name: 'Orders',
    component: Order,
    title: 'Invoices',
  },
  {
    path: `/admin/settings`,
    name: 'Settings',
    component: Settings,
    title: 'Settings',
  },
  {
    path: `/admin/users/:username/product/edit/:id`,
    name: 'EditAdminProduct',
    component: EditProduct,
    title: 'User Product',
  },
  {
    path: `/admin/users/:id`,
    name: 'User',
    component: User,
    title: 'User',
  },
  {
    path: `/admin/users`,
    name: 'Users',
    component: Users,
    title: 'Users',
  },
  {
    path: `/admin/top`,
    name: 'TopUsers',
    component: TopUsers,
    title: 'Top Users',
  },
  {
    path: `/admin/dashboard`,
    name: 'AdminDashboard',
    component: Dashboard,
    title: 'Dashboard'
  },
  {
    path: `/admin/changelog`,
    name: 'AdminChangelog',
    component: ChangelogCreate,
    title: 'Changelog'
  },
  {
    redirect: true,
    path: `/admin`,
    pathTo: `/`,
  },
]

export default adminRoutes