import React, { lazy } from 'react'
import Loadable from 'react-loadable'

import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'

import { configureStore } from 'services'
import { Loading, NotFound } from 'components'

import 'app.scss'
import SingleLogo from './assets/images/single.png'
const history = createBrowserHistory()
const store = configureStore()

const Documentation = Loadable({
  loader: () => import('./layouts/documentation'),
  loading: () => <Loading />
});

const Shop = Loadable({
  loader: () => import('./layouts/shop'),
  loading: () => <Loading />
});

const Settings = Loadable({
  loader: () => import('./layouts/settings'),
  loading: () => <Loading />
});

const Embed = Loadable({
  loader: () => import('./layouts/embed'),
  loading: () => <Loading />
});

const EmbedInvoice = Loadable({
  loader: () => import('./layouts/embed_invoice'),
  loading: () => <Loading />
});

const Invoice = Loadable({
  loader: () => import('./layouts/invoice'),
  loading: () => <Loading />
});

const Product = Loadable({
  loader: () => import('./layouts/product'),
  loading: () => <Loading />
});

const Dashboard = Loadable({
  loader: () => import('./layouts/dashboard'),
  loading: () => <Loading />
});

const Admin = Loadable({
  loader: () => import('./layouts/admin'),
  loading: () => <Loading />
});

const Auth = Loadable({
  loader: () => import('./layouts/auth'),
  loading: () => <Loading />
});

const Landing = Loadable({
  loader: () => import('./layouts/landing'),
  loading: () => <Loading />
});


export default class App extends React.Component {

  componentDidMount() {
    for(const elem of document.querySelectorAll('[putSinglePngHrefHere]')) {
      elem.href = SingleLogo
    }

    for(const elem of document.querySelectorAll('[putSinglePngContentHere]')) {
      elem.content = SingleLogo
    }

    const theme = window.localStorage.getItem('theme') || 'light'

    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(theme);

    document.documentElement.classList.remove('light')
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add(theme);
  }

  render () {

    const user = window.localStorage.getItem('userId')

    const RedirectToLogin = () => {
      window.location = "/auth/login"
    }

    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>

            <Route path={`/`} exact={true} name='LandingLayout' render={(props) => <Landing {...props} />} />

            {/*Shop*/}
            {/*<Route path={`/:username`} exact={true} name='ShopLayout' render={(props) => <Shop {...props} />} />*/}

            {/*Shop*/}
            <Route path={`/product`} name='ProductLayout' render={(props) => <Product {...props} />} />
            <Route path={`/group`} name='ProductLayout' render={(props) => <Product {...props} />} />
            <Route path={`/invoice`} name='InvoiceLayout' render={(props) => <Invoice {...props} />} />
            <Route path={`/payment`} name='InvoiceLayout' render={(props) => <Invoice {...props} />} />

            {/*Embed*/}
            <Route path={`/prembed`} name='EmbedLayout' render={(props) => <Embed {...props} />} />
            <Route path={`/ivembed`} name='EmbedInvoiceLayout' render={(props) => <EmbedInvoice {...props} />} />

            <Route path={`/admin`} name='DashboardLayout' render={(props) => <Admin {...props} />} />
            <Route path={`/auth`} name='AuthLayout' render={(props) => <Auth {...props} />} />

            <Route path={`/settings`} name="SettingsLayout" render={(props) => <Settings {...props} />} />

            <Route path={`/dashboard/${user}`} name='DashboardLayout' render={(props) => <Dashboard {...props} />} />
            <Route path={`/dashboard`} name='WrongUser' render={RedirectToLogin} />
            <Route path={`/webhooks`} name='LandingLayout' render={(props) => <Dashboard {...props} />} />

            {/*Docs */}
            <Route path={`/documentation`} name="Documentation" render={(props) => <Documentation {...props} />} />

            {/*Static*/}
            <Route path={`/fees`} name='LandingLayout' render={(props) => <Landing {...props} />} />
            <Route path={`/terms`} name='LandingLayout' render={(props) => <Landing {...props} />} />
            <Route path={`/contact`} name='LandingLayout' render={(props) => <Landing {...props} />} />
            <Route path={`/404`} name='LandingLayout' render={(props) => <Landing {...props} />} />
            <Route path={`/changelog`} name='LandingLayout' render={(props) => <Landing {...props} />} />


          </Switch>
        </Router>
      </Provider>
    )
  }

}

