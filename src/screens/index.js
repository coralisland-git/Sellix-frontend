import React from "react";
import asyncLoadHOC from "../HOC/asyncLoadHOC";
import StripeCallback from './settings/payments_stripe_callback'

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
import "react-toastify/dist/ReactToastify.css"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-confirm-alert/src/react-confirm-alert.css';


const Home = asyncLoadHOC(() => import(/* webpackChunkName: "Home" */ "./home"));
const Fees = asyncLoadHOC(() => import(/* webpackChunkName: "Fees" */ "./static/fees"));
const Ticket = asyncLoadHOC(() => import(/* webpackChunkName: "Ticket" */ "./static/tickets"));
const Changelog = asyncLoadHOC(() => import(/* webpackChunkName: "Changelog" */ "./static/changelog"));
const ChangelogCreate = asyncLoadHOC(() => import(/* webpackChunkName: "ChangelogCreate" */ "./static/changelog/create"));
const Terms = asyncLoadHOC(() => import(/* webpackChunkName: "Terms" */ "./static/terms"));

const LogIn = asyncLoadHOC(() => import(/* webpackChunkName: "LogIn" */ "./auth/log_in"));
const Register = asyncLoadHOC(() => import(/* webpackChunkName: "Register" */ "./auth/register"));
const OTPLogin = asyncLoadHOC(() => import(/* webpackChunkName: "OTPLogin" */ "./auth/otp_2fa"));
const ResetOTP = asyncLoadHOC(() => import(/* webpackChunkName: "ResetOTP" */ "./auth/reset_otp"));
const ForgotPassword = asyncLoadHOC(() => import(/* webpackChunkName: "ForgotPassword" */ "./auth/forgot_password"));
const ResetPassword = asyncLoadHOC(() => import(/* webpackChunkName: "ResetPassword" */ "./auth/reset_password"));
const TwoFactorAuthentication = asyncLoadHOC(() => import(/* webpackChunkName: "TwoFactorAuthentication" */ "./auth/2fa"));
const EmailConfirm = asyncLoadHOC(() => import(/* webpackChunkName: "EmailConfirm" */ "./auth/email_confirm"));
const ChangeEmail = asyncLoadHOC(() => import(/* webpackChunkName: "ChangeEmail" */ "./auth/change_email"));

const Dashboard = asyncLoadHOC(() => import(/* webpackChunkName: "Dashboard" */ "./dashboard"));

const Invoice = asyncLoadHOC(() => import(/* webpackChunkName: "Invoice" */ "./invoice"));
const Invoices = asyncLoadHOC(() => import(/* webpackChunkName: "Invoices" */ "./invoices"));

const Users = asyncLoadHOC(() => import(/* webpackChunkName: "Users" */ "./admin/users"));
const User = asyncLoadHOC(() => import(/* webpackChunkName: "User" */ "./admin/users/screens/detail"));
const TopUsers = asyncLoadHOC(() => import(/* webpackChunkName: "TopUsers" */ "./admin/topUsers"));
const Settings = asyncLoadHOC(() => import(/* webpackChunkName: "Settings" */ "./admin/settings"));

const Coupons = asyncLoadHOC(() => import(/* webpackChunkName: "Coupons" */ "./coupons"));
const CreateCoupon = asyncLoadHOC(() => import(/* webpackChunkName: "CreateCoupon" */ "./coupons/screens/create"));
const EditCoupon = asyncLoadHOC(() => import(/* webpackChunkName: "EditCoupon" */ "./coupons/screens/create"));

const Product = asyncLoadHOC(() => import(/* webpackChunkName: "Product" */ "./product"));
const CreateProduct = asyncLoadHOC(() => import(/* webpackChunkName: "CreateProduct" */ "./product/screens/create"));
const EditProduct = asyncLoadHOC(() => import(/* webpackChunkName: "EditProduct" */ "./product/screens/detail"));
const ProductSort = asyncLoadHOC(() => import(/* webpackChunkName: "ProductSort" */ "./product_sort"));


const Categories = asyncLoadHOC(() => import(/* webpackChunkName: "Categories" */ "./categories"));
const CreateCategories = asyncLoadHOC(() => import(/* webpackChunkName: "CreateCategories" */ "./categories/screens/create"));
const EditCategory = asyncLoadHOC(() => import(/* webpackChunkName: "EditCategory" */ "./categories/screens/detail"));
const CategorySort = asyncLoadHOC(() => import(/* webpackChunkName: "CategorySort" */ "./category_sort"));


const ProductGroups = asyncLoadHOC(() => import(/* webpackChunkName: "ProductGroups" */ "./product_group"));
const CreateProductGroup = asyncLoadHOC(() => import(/* webpackChunkName: "CreateProductGroup" */ "./product_group/screens/create"));
const EditProductGroup = asyncLoadHOC(() => import(/* webpackChunkName: "EditProductGroup" */ "./product_group/screens/detail"));
const ProductGroupSort = asyncLoadHOC(() => import(/* webpackChunkName: "ProductGroupSort" */ "./product_group_sort"));

const Documentation = asyncLoadHOC(() => import(/* webpackChunkName: "Documentation" */ "./documentation"));

const Queries = asyncLoadHOC(() => import(/* webpackChunkName: "Queries" */ "./queries"));
const ReplyToQuery = asyncLoadHOC(() => import(/* webpackChunkName: "ReplyToQuery" */ "./queries/screens/reply"));
const Contact = asyncLoadHOC(() => import(/* webpackChunkName: "Contact" */ "./contact"));
const ContactReply = asyncLoadHOC(() => import(/* webpackChunkName: "ContactReply" */ "./contact/screens/reply"));

const Order = asyncLoadHOC(() => import(/* webpackChunkName: "Order" */ "./order"));
const OrderDetail = asyncLoadHOC(() => import(/* webpackChunkName: "OrderDetail" */ "./order/screens/detail"));

const BlackList = asyncLoadHOC(() => import(/* webpackChunkName: "BlackList" */ "./blacklist"));
const CreateBlacklist = asyncLoadHOC(() => import(/* webpackChunkName: "CreateBlacklist" */ "./blacklist/screens/create"));
const EditBlacklist = asyncLoadHOC(() => import(/* webpackChunkName: "EditBlacklist" */ "./blacklist/screens/create"));

const Analytics = asyncLoadHOC(() => import(/* webpackChunkName: "Analytics" */ "./analytics"));
const Reports = asyncLoadHOC(() => import(/* webpackChunkName: "Reports" */ "./reports"));

const Feedbacks = asyncLoadHOC(() => import(/* webpackChunkName: "Feedbacks" */ "./feedbacks"));
const ReplyToFeedback = asyncLoadHOC(() => import(/* webpackChunkName: "ReplyToFeedback" */ "./feedbacks/screens/reply"));
const ShopFeedback = asyncLoadHOC(() => import(/* webpackChunkName: "ShopFeedback" */ "./feedbacks_shop"));
const LeaveFeedback = asyncLoadHOC(() => import(/* webpackChunkName: "LeaveFeedback" */ "./feedbacks_shop/screens/create"));

const Webhooks = asyncLoadHOC(() => import(/* webpackChunkName: "Webhooks" */ "./webhooks"));
const WebhookLogs = asyncLoadHOC(() => import(/* webpackChunkName: "WebhookLogs" */ "./webhook_logs"));

const ShopProducts = asyncLoadHOC(() => import(/* webpackChunkName: "ShopProducts" */ "./product_shop"));
const ShopProductDetail = asyncLoadHOC(() => import(/* webpackChunkName: "ShopProductDetail" */ "./product_shop/screens/detail"));
const ShopGroupDetail = asyncLoadHOC(() => import(/* webpackChunkName: "ShopGroupDetail" */ "./product_shop/screens/group_detail"));


const GeneralSettings = asyncLoadHOC(() => import(/* webpackChunkName: "GeneralSettings" */ "./settings/general_settings"));
const SecurityPage = asyncLoadHOC(() => import(/* webpackChunkName: "SecurityPage" */ "./settings/security"));
const Payments = asyncLoadHOC(() => import(/* webpackChunkName: "Payments" */ "./settings/payments"));
const ShopDesign = asyncLoadHOC(() => import(/* webpackChunkName: "ShopDesign" */ "./settings/shop_design"));
const ShopGoogleAnalytics = asyncLoadHOC(() => import(/* webpackChunkName: "ShopGoogleAnalytics" */ "./settings/shop_google_analytics"));
const Notification = asyncLoadHOC(() => import(/* webpackChunkName: "Notification" */ "./settings/notification"));

const EmbedProduct = asyncLoadHOC(() => import(/* webpackChunkName: "EmbedProduct" */ "./embed_product"));
const EmbededPayment = asyncLoadHOC(() => import(/* webpackChunkName: "EmbededPayment" */ "./embeded_payment"));
const EmbededInvoice = asyncLoadHOC(() => import(/* webpackChunkName: "EmbededInvoice" */ "./embeded_invoice"));



export {
  ShopProducts,
  ShopProductDetail,
  ShopGroupDetail,
  ChangelogCreate,

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
