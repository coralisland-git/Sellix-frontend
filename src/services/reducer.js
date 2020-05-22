import { combineReducers } from 'redux'
import { AuthReducer, CommonReducer } from './global'

import Dashboard from '../screens/dashboard/reducer'
import Order from '../screens/order/reducer'
import Product from '../screens/product/reducer'
import Categories from '../screens/categories/reducer'
import BlackList from '../screens/blacklist/reducer'
import Webhooks from '../screens/webhooks/reducer'
import WebhookLogs from '../screens/webhook_logs/reducer'
import Queries from '../screens/queries/reducer'
import Coupons from '../screens/coupons/reducer'
import Feedbacks from '../screens/feedbacks/reducer'
import Reports from '../screens/reports/reducer'
import Users from '../screens/admin/users/reducer'
import TopUsers from '../screens/admin/topUsers/reducer'
import Invoices from '../screens/invoices/reducer'
import ProductGroups from '../screens/product_group/reducer'


const reducer = combineReducers({
  invoices: Invoices,
  users: Users,
  topUsers: TopUsers,
  common: CommonReducer,
  queries: Queries,
  auth: AuthReducer,
  blacklist: BlackList,
  webhooks: Webhooks,
  webhookLogs: WebhookLogs,
  coupons: Coupons,
  dashboard: Dashboard,
  product: Product,
  product_group: ProductGroups,
  category: Categories,
  feedbacks: Feedbacks,
  report: Reports,
  order: Order
})

export default reducer