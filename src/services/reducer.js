import { combineReducers } from 'redux'
import { AuthReducer, CommonReducer } from './global'

import {
  Dashboard,
  Order,
  Product,
  Categories,
  BlackList,
  Webhooks,
  WebhookLogs,
  Queries,
  Coupons,
  Feedbacks,
  Reports,
  Users,
  TopUsers,
  Invoices,
  ProductGroups
} from 'screens'


const reducer = combineReducers({
  invoices: Invoices.reducer,
  users: Users.reducer,
  topUsers: TopUsers.reducer,
  common: CommonReducer,
  queries: Queries.reducer,
  auth: AuthReducer,
  blacklist: BlackList.reducer,
  webhooks: Webhooks.reducer,
  webhookLogs: WebhookLogs.reducer,
  coupons: Coupons.reducer,
  dashboard: Dashboard.reducer,
  product: Product.reducer,
  product_group: ProductGroups.reducer,
  category: Categories.reducer,
  feedbacks: Feedbacks.reducer,
  report: Reports.reducer,
  order: Order.reducer
})

export default reducer