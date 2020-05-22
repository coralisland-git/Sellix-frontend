import React from "react";
import asyncLoadHOC from "../HOC/asyncLoadHOC";
import StripeCallback from './payments_stripe_callback'

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-confirm-alert/src/react-confirm-alert.css';


const Home = asyncLoadHOC(() => import("./home"));
const Fees = asyncLoadHOC(() => import("./static/fees"));
const Ticket = asyncLoadHOC(() => import("./static/tickets"));
const Changelog = asyncLoadHOC(() => import("./static/changelog"));
const Terms = asyncLoadHOC(() => import("./static/terms"));

const LogIn = asyncLoadHOC(() => import("./auth/log_in"));
const Register = asyncLoadHOC(() => import("./auth/register"));
const OTPLogin = asyncLoadHOC(() => import("./auth/otp_2fa"));
const ResetOTP = asyncLoadHOC(() => import("./auth/reset_otp"));
const ForgotPassword = asyncLoadHOC(() => import("./auth/forgot_password"));
const ResetPassword = asyncLoadHOC(() => import("./auth/reset_password"));
const TwoFactorAuthentication = asyncLoadHOC(() => import("./auth/2fa"));
const EmailConfirm = asyncLoadHOC(() => import("./auth/email_confirm"));
const ChangeEmail = asyncLoadHOC(() => import("./auth/change_email"));

const Dashboard = asyncLoadHOC(() => import("./dashboard"));

const Invoice = asyncLoadHOC(() => import("./invoice"));
const Invoices = asyncLoadHOC(() => import("./invoices"));

const Users = asyncLoadHOC(() => import("./admin/users"));
const User = asyncLoadHOC(() => import("./admin/users/screens/detail"));
const TopUsers = asyncLoadHOC(() => import("./admin/topUsers"));
const Settings = asyncLoadHOC(() => import("./admin/settings"));

const Coupons = asyncLoadHOC(() => import("./coupons"));
const CreateCoupon = asyncLoadHOC(() => import("./coupons/screens/create"));
const EditCoupon = asyncLoadHOC(() => import("./coupons/screens/create"));

const Product = asyncLoadHOC(() => import("./product"));
const CreateProduct = asyncLoadHOC(() => import("./product/screens/create"));
const EditProduct = asyncLoadHOC(() => import("./product/screens/detail"));
const ProductSort = asyncLoadHOC(() => import("./product_sort"));


const Categories = asyncLoadHOC(() => import("./categories"));
const CreateCategories = asyncLoadHOC(() => import("./categories/screens/create"));
const EditCategory = asyncLoadHOC(() => import("./categories/screens/detail"));
const CategorySort = asyncLoadHOC(() => import("./category_sort"));


const ProductGroups = asyncLoadHOC(() => import("./product_group"));
const CreateProductGroup = asyncLoadHOC(() => import("./product_group/screens/create"));
const EditProductGroup = asyncLoadHOC(() => import("./product_group/screens/detail"));
const ProductGroupSort = asyncLoadHOC(() => import("./product_group_sort"));

const Documentation = asyncLoadHOC(() => import("./documentation"));

const Queries = asyncLoadHOC(() => import("./queries"));
const ReplyToQuery = asyncLoadHOC(() => import("./queries/screens/reply"));
const Contact = asyncLoadHOC(() => import("./contact"));
const ContactReply = asyncLoadHOC(() => import("./contact/screens/reply"));

const Order = asyncLoadHOC(() => import("./order"));
const OrderDetail = asyncLoadHOC(() => import("./order/screens/detail"));

const BlackList = asyncLoadHOC(() => import("./blacklist"));
const CreateBlacklist = asyncLoadHOC(() => import("./blacklist/screens/create"));
const EditBlacklist = asyncLoadHOC(() => import("./blacklist/screens/create"));

const Analytics = asyncLoadHOC(() => import("./analytics"));
const Reports = asyncLoadHOC(() => import("./reports"));

const Feedbacks = asyncLoadHOC(() => import("./feedbacks"));
const ReplyToFeedback = asyncLoadHOC(() => import("./feedbacks/screens/reply"));
const ShopFeedback = asyncLoadHOC(() => import("./feedbacks_shop"));
const LeaveFeedback = asyncLoadHOC(() => import("./feedbacks_shop/screens/create"));

const Webhooks = asyncLoadHOC(() => import("./webhooks"));
const WebhookLogs = asyncLoadHOC(() => import("./webhook_logs"));

const ShopProducts = asyncLoadHOC(() => import("./product_shop"));
const ShopProductDetail = asyncLoadHOC(() => import("./product_shop/screens/detail"));
const ShopGroupDetail = asyncLoadHOC(() => import("./product_shop/screens/group_detail"));


const GeneralSettings = asyncLoadHOC(() => import("./general_settings"));
const SecurityPage = asyncLoadHOC(() => import("./security"));
const Payments = asyncLoadHOC(() => import("./payments"));
const ShopDesign = asyncLoadHOC(() => import("./shop_design"));
const ShopGoogleAnalytics = asyncLoadHOC(() => import("./shop_google_analytics"));
const Notification = asyncLoadHOC(() => import("./notification"));

const EmbedProduct = asyncLoadHOC(() => import("./embed_product"));
const EmbededPayment = asyncLoadHOC(() => import("./embeded_payment"));
const EmbededInvoice = asyncLoadHOC(() => import("./embeded_invoice"));



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
