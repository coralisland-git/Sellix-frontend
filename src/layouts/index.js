import asyncLoadHOC from "../HOC/asyncLoadHOC";
const DocumentationLayout = asyncLoadHOC(() => import(/* webpackChunkName: "DocumentationLayout" */"./documentation"));
const LandingLayout = asyncLoadHOC(() => import(/* webpackChunkName: "LandingLayout" */"./landing"));
const SettingsLayout = asyncLoadHOC(() => import(/* webpackChunkName: "SettingsLayout" */"./settings"));
const InvoiceLayout = asyncLoadHOC(() => import(/* webpackChunkName: "InvoiceLayout" */"./invoice"));
const ShopLayout = asyncLoadHOC(() => import(/* webpackChunkName: "ShopLayout" */"./shop"));
const DashboardLayout = asyncLoadHOC(() => import(/* webpackChunkName: "DashboardLayout" */"./dashboard"));
const AuthLayout = asyncLoadHOC(() => import(/* webpackChunkName: "AuthLayout" */"./auth"));
const EmbedLayout = asyncLoadHOC(() => import(/* webpackChunkName: "EmbedLayout" */"./embed"));

export {
  AuthLayout,
  DashboardLayout,
  ShopLayout,
  SettingsLayout,
  LandingLayout,
  InvoiceLayout,
  EmbedLayout,
  DocumentationLayout
}
