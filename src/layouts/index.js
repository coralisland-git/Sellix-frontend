import React, { Component } from "react";
import AuthLayout from './auth'
import AdminLayout from './admin'
import DashboardLayout from './dashboard'
import ShopLayout from './shop'
import PaymentLayout from './default'
import EmbedLayout from './embed'
import EmbedInvoiceLayout from './embed_invoice'
import InvoiceLayout from './invoice'
import ProductLayout from './product'
import SettingsLayout from './settings'
import LandingLayout from './landing'
import DocumentationLayout from './documentation'

// const DocumentationLayout = asyncComponent(() => import("./documentation"));
// const LandingLayout = asyncComponent(() => import("./landing"));
// const SettingsLayout = asyncComponent(() => import("./settings"));
// const ProductLayout = asyncComponent(() => import("./product"));
// const InvoiceLayout = asyncComponent(() => import("./invoice"));
// const ShopLayout = asyncComponent(() => import("./shop"));
// const DashboardLayout = asyncComponent(() => import("./dashboard"));
// const AdminLayout = asyncComponent(() => import("./admin"));
// const AuthLayout = asyncComponent(() => import("./auth"));
// const PaymentLayout = asyncComponent(() => import("./default"));

export {
  AuthLayout,
  AdminLayout,
  DashboardLayout,
  ShopLayout,
  PaymentLayout,
  SettingsLayout,
  LandingLayout,
  InvoiceLayout,
  ProductLayout,
  EmbedLayout,
  EmbedInvoiceLayout,
  DocumentationLayout
}

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      console.log(component)
      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}