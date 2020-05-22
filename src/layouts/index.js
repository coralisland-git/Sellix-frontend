import asyncLoadHOC from "../HOC/asyncLoadHOC";
const DocumentationLayout = asyncLoadHOC(() => import("./documentation"));
const LandingLayout = asyncLoadHOC(() => import("./landing"));
const SettingsLayout = asyncLoadHOC(() => import("./settings"));
const InvoiceLayout = asyncLoadHOC(() => import("./invoice"));
const ShopLayout = asyncLoadHOC(() => import("./shop"));
const DashboardLayout = asyncLoadHOC(() => import("./dashboard"));
const AuthLayout = asyncLoadHOC(() => import("./auth"));
const EmbedLayout = asyncLoadHOC(() => import("./embed"));

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
