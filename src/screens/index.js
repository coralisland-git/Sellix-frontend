import React from "react";
import asyncComponent from "../async_loader";
import StripeCallback from './payments_stripe_callback'

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-confirm-alert/src/react-confirm-alert.css';


const Home = asyncComponent(() => import("./home"));
const Fees = asyncComponent(() => import("./static/fees"));
const Ticket = asyncComponent(() => import("./static/tickets"));
const Changelog = asyncComponent(() => import("./static/changelog"));
const Terms = asyncComponent(() => import("./static/terms"));

const LogIn = asyncComponent(() => import("./auth/log_in"));
const Register = asyncComponent(() => import("./auth/register"));
const OTPLogin = asyncComponent(() => import("./auth/otp_2fa"));
const ResetOTP = asyncComponent(() => import("./auth/reset_otp"));
const ForgotPassword = asyncComponent(() => import("./auth/forgot_password"));
const ResetPassword = asyncComponent(() => import("./auth/reset_password"));
const TwoFactorAuthentication = asyncComponent(() => import("./auth/2fa"));
const EmailConfirm = asyncComponent(() => import("./auth/email_confirm"));
const ChangeEmail = asyncComponent(() => import("./auth/change_email"));

const Dashboard = asyncComponent(() => import("./dashboard"));

const Invoice = asyncComponent(() => import("./invoice"));
const Invoices = asyncComponent(() => import("./invoices"));

const Users = asyncComponent(() => import("./admin/users"));
const User = asyncComponent(() => import("./admin/users/screens/detail"));
const TopUsers = asyncComponent(() => import("./admin/topUsers"));
const Settings = asyncComponent(() => import("./admin/settings"));

const Coupons = asyncComponent(() => import("./coupons"));
const CreateCoupon = asyncComponent(() => import("./coupons/screens/create"));
const EditCoupon = asyncComponent(() => import("./coupons/screens/create"));

const Product = asyncComponent(() => import("./product"));
const CreateProduct = asyncComponent(() => import("./product/screens/create"));
const EditProduct = asyncComponent(() => import("./product/screens/detail"));
const ProductSort = asyncComponent(() => import("./product_sort"));


const Categories = asyncComponent(() => import("./categories"));
const CreateCategories = asyncComponent(() => import("./categories/screens/create"));
const EditCategory = asyncComponent(() => import("./categories/screens/detail"));
const CategorySort = asyncComponent(() => import("./category_sort"));


const ProductGroups = asyncComponent(() => import("./product_group"));
const CreateProductGroup = asyncComponent(() => import("./product_group/screens/create"));
const EditProductGroup = asyncComponent(() => import("./product_group/screens/detail"));
const ProductGroupSort = asyncComponent(() => import("./product_group_sort"));

const Documentation = asyncComponent(() => import("./documentation"));

const Queries = asyncComponent(() => import("./queries"));
const ReplyToQuery = asyncComponent(() => import("./queries/screens/reply"));
const Contact = asyncComponent(() => import("./contact"));
const ContactReply = asyncComponent(() => import("./contact/screens/reply"));

const Order = asyncComponent(() => import("./order"));
const OrderDetail = asyncComponent(() => import("./order/screens/detail"));

const BlackList = asyncComponent(() => import("./blacklist"));
const CreateBlacklist = asyncComponent(() => import("./blacklist/screens/create"));
const EditBlacklist = asyncComponent(() => import("./blacklist/screens/create"));

const Analytics = asyncComponent(() => import("./analytics"));
const Reports = asyncComponent(() => import("./reports"));

const Feedbacks = asyncComponent(() => import("./feedbacks"));
const ReplyToFeedback = asyncComponent(() => import("./feedbacks/screens/reply"));
const ShopFeedback = asyncComponent(() => import("./feedbacks_shop"));
const LeaveFeedback = asyncComponent(() => import("./feedbacks_shop/screens/create"));

const Webhooks = asyncComponent(() => import("./webhooks"));
const CreateWebhookSimulator = asyncComponent(() => import("./webhooks/screens/create"));
const WebhookLogs = asyncComponent(() => import("./webhook_logs"));

const ShopProducts = asyncComponent(() => import("./product_shop"));
const ShopProductDetail = asyncComponent(() => import("./product_shop/screens/detail"));
const ShopGroupDetail = asyncComponent(() => import("./product_shop/screens/group_detail"));


const GeneralSettings = asyncComponent(() => import("./general_settings"));
const SecurityPage = asyncComponent(() => import("./security"));
const Payments = asyncComponent(() => import("./payments"));
const ShopDesign = asyncComponent(() => import("./shop_design"));
const ShopGoogleAnalytics = asyncComponent(() => import("./shop_google_analytics"));
const Notification = asyncComponent(() => import("./notification"));

const EmbedProduct = asyncComponent(() => import("./embed_product"));
const EmbededPayment = asyncComponent(() => import("./embeded_payment"));
const EmbededInvoice = asyncComponent(() => import("./embeded_invoice"));



export {
  ShopProducts,
  ShopProductDetail,
  ShopGroupDetail,

  GeneralSettings,
  SecurityPage,
  Payments,
  ShopDesign,
  ShopGoogleAnalytics,
  Notification,

  StripeCallback,

  EmbededPayment,
  EmbededInvoice,
  EmbedProduct,

  Order,
  OrderDetail,

  BlackList,
  CreateBlacklist,
  EditBlacklist,

  Analytics,
  Reports,
  Feedbacks,
  ReplyToFeedback,
  ShopFeedback,
  LeaveFeedback,

  Webhooks,
  CreateWebhookSimulator,
  WebhookLogs,

  Documentation,

  Contact,
  ContactReply,
  Queries,
  ReplyToQuery,

  ProductGroups,
  CreateProductGroup,
  EditProductGroup,
  ProductGroupSort,

  Coupons,
  CreateCoupon,
  EditCoupon,

  Product,
  CreateProduct,
  EditProduct,
  ProductSort,

  Categories,
  CreateCategories,
  EditCategory,
  CategorySort,

  Invoice,
  Dashboard,
  Users,
  User,
  TopUsers,
  Settings,
  Invoices,

  Home,
  Changelog,
  Fees,
  Terms,
  Ticket,

  LogIn,
  Register,
  OTPLogin,
  ResetOTP,
  ForgotPassword,
  ResetPassword,
  TwoFactorAuthentication,
  EmailConfirm,
  ChangeEmail,
}
