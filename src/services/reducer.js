import { combineReducers } from 'redux'

import {
  AuthReducer,
  CommonReducer
} from './global'

import {
  Dashboard,
  GeneralSettings,
  Receipt,
  SupplierInvoice,
  Order,
  Product,
  Project,
  Help,
  Notification,
  Categories,
  BlackList,
  Queries,
  Coupons,
  Feedbacks,
  Reports,
  Users,
  TopUsers,
  Settings,
  Invoices
} from 'screens'


const reducer = combineReducers({
  settings: Settings.reducer,
  invoices: Invoices.reducer,
  users: Users.reducer,
  topUsers: TopUsers.reducer,
  common: CommonReducer,
  queries: Queries.reducer,
  auth: AuthReducer,
  blacklist: BlackList.reducer,
  coupons: Coupons.reducer,
  dashboard: Dashboard.reducer,
  product: Product.reducer,
  category: Categories.reducer,
  feedbacks: Feedbacks.reducer,
  report: Reports.reducer,
  order: Order.reducer
})

export default reducer