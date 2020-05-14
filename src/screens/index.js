import Home from './home'
import Fees from './fees'
import Ticket from './tickets'
import Changelog from './changelog'
import LogIn from './log_in'
import TwoFactorAuthentication from './2fa'
import OTPLogin from './otp_2fa'
import ResetOTP from './reset_otp'
import Register from './register'
import ForgotPassword from './forgot_password'
import ResetPassword from './reset_password'
import Dashboard from './dashboard'
import EmailConfirm from './email_confirm'
import ChangeEmail from './change_email'

import Product from './product'
import CreateProduct from './product/screens/create'
import EditProduct from './product/screens/detail'

import ProductGroups from './product_group'
import CreateProductGroup from './product_group/screens/create'
import EditProductGroup from './product_group/screens/detail'
import ProductGroupSort from './product_group_sort'

import ProductSort from './product_sort'
import CategorySort from './category_sort'

import Categories from './categories'
import CreateCategories from './categories/screens/create'
import EditCategory from './categories/screens/detail'

import Order from './order'
import OrderDetail from './order/screens/detail'
import Analytics from './analytics'
import Reports from './reports'
import Coupons from './coupons'
import CreateCoupon from './coupons/screens/create'
import Queries from './queries'
import Feedbacks from './feedbacks'
import ReplyToFeedback from './feedbacks/screens/reply'
import Webhooks from './webhooks'
import CreateWebhookSimulator from './webhooks/screens/create'
import WebhookLogs from './webhook_logs'
import Pages from './pages'
import CreatePage from './pages/screens/create'
import Contact from './contact'
import QueryView from './contact/screens/detail'
import ShopFeedback from './feedbacks_shop'
import LeaveFeedback from './feedbacks_shop/screens/create'
import ShopProducts from './product_shop'
import ShopProductDetail from './product_shop/screens/detail'
import ShopGroupDetail from './product_shop/screens/group_detail'
import BlackList from './blacklist'
import CreateBlacklist from './blacklist/screens/create'
import EditBlacklist from './blacklist/screens/create'
import EditCoupon from './coupons/screens/create'
import ReplyToQuerie from './queries/screens/reply'
import Contacts from './contacts/screens/reply/index.js'
import Terms from './terms/screen.js'
import AdminDashboard from './admin_dashboard/screen'
import Users from './users'
import User from './users/screens/detail'
import TopUsers from './topUsers'

import PaypalPaying from './paypal_paying'
import Invoice from './invoice'
import SecurityPage from './security'
import Notification from './notification'
import Payments from './payments'
import MemberPage from './memebers'
import Billings from './billings'
import Settings from './settings'
import Invoices from './invoices'
import ShopDesign from './shop_design'
import ShopGoogleAnalytics from './shop_google_analytics'
import StripeCallback from './payments_stripe_callback'

import GeneralSettings from './general_settings'
import Customization from './customization'
import EmbededPayment from './embeded_payment'
import EmbededInvoice from './embeded_invoice'
import EmbededInvoiceDev from './embeded_invoice_dev'

import EmbedProduct from './embed_product'
import Documentation from './documentation/screen.js'

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export {
  AdminDashboard,
  Home,
  Changelog,
  Fees,
  LogIn,
  Register,
  OTPLogin,
  ResetOTP,
  Dashboard,
  ForgotPassword,
  ResetPassword,
  TwoFactorAuthentication,
  Invoice,
  Terms,
  Users,
  User,
  TopUsers,
  Settings,
  Invoices,
  // Tickets,
  Ticket,
  EmailConfirm,
  ChangeEmail,


  EditCoupon,
  Product,
  CreateProduct,
  EditProduct,

  CategorySort,
  ProductSort,

  Categories,
  CreateCategories,
  EditCategory,
  
  Contact,
  Contacts,
  QueryView,
  Order,
  Analytics,
  Reports,
  Coupons,
  CreateCoupon,
  Queries,
  ReplyToQuerie,
  Feedbacks,
  ReplyToFeedback,
  Webhooks,
  CreateWebhookSimulator,
  Pages,

  CreatePage,
  WebhookLogs,
  ShopFeedback,
  LeaveFeedback,
  ShopProducts,
  ShopProductDetail,
  ShopGroupDetail,
  PaypalPaying,
  BlackList,
  CreateBlacklist,
  OrderDetail,
  SecurityPage,
  Payments,
  MemberPage,
  Billings,
  GeneralSettings,
  ShopDesign,
  ShopGoogleAnalytics,
  Notification,
  Customization,
  EditBlacklist,

  EmbededPayment,
  EmbededInvoice,
  EmbededInvoiceDev,
  
  ProductGroups,
  CreateProductGroup,
  EditProductGroup,
  ProductGroupSort,

  Documentation,
  EmbedProduct,
  StripeCallback
}
