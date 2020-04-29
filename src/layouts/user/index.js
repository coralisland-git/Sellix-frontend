import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as router from 'react-router-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  BrowserView,
  MobileView
} from "react-device-detect";

import { Container } from 'reactstrap'
import {
  AppAside,
  AppBreadcrumb,
  AppHeader,
  AppSidebar,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'

import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { darkTheme, lightTheme } from 'layouts/theme/theme'
import { GlobalStyles } from 'layouts/theme/global'

import { adminRoutes } from 'routes'
import {
  AuthActions,
  CommonActions
} from 'services/global'

import {
  mainBrowserNavigation,
  mainMobileNavigation,
  adminNavigation
} from 'constants/navigation'

import {
  Aside,
  Header,
  Footer,
  Loading,
  SetTitle
} from 'components'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    version: state.common.version,
    profile: state.auth.profile,
    is_authed: state.auth.is_authed
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    authActions: bindActionCreators(AuthActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class AdminLayout extends React.Component {

  constructor(props) {
    super(props);
    let theme = window.localStorage.getItem('theme') || 'light'
    document.body.classList.add(theme);
    document.documentElement.classList.add(theme);
    this.state = {
      theme: theme
    }
  }

  componentDidMount() {
    if (!window.localStorage.getItem('accessToken')) {
      this.props.history.push('/login')
    } else {
      this.props.authActions.getSelfUser().catch(err => {
        this.props.authActions.logOut()
        this.props.history.push('/login')
      })
      const toastifyAlert = (status, message) => {
        if (!message) {
          message = 'Unexpected Error'
        }
        if (status === 'success') {
          toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
          })
        } else if (status === 'error') {
          toast.error(message, {
            position: toast.POSITION.TOP_RIGHT
          })
        } else if (status === 'warn') {
          toast.warn(message, {
            position: toast.POSITION.TOP_RIGHT
          })
        } else if (status === 'info') {
          toast.info(message, {
            position: toast.POSITION.TOP_RIGHT
          })
        }
      }
      this.props.commonActions.setTostifyAlertFunc(toastifyAlert)
    }

    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    if (iOS) {
      for (let i = 0; i < document.getElementsByClassName('nav-link').length; i++) {
        let element = document.getElementsByClassName('nav-link')[i];
        element.addEventListener("mouseenter", function (event) {
          element.click();
        }, false);
      }
    }
  }

  changeTheme() {
    const theme = window.localStorage.getItem('theme') || 'light'
    window.localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light')

    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(theme === 'light' ? 'dark' : 'light');

    document.documentElement.classList.remove('light')
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add(theme === 'light' ? 'dark' : 'light');


    this.setState({ theme: theme === 'light' ? 'dark' : 'light' })
  }

  renderNav = () => {
    return <AppSidebar className="pt-3 mb-5" fixed display="lg">
      <Switch>
        <Route path="/admin">
          <AppSidebarNav navConfig={adminNavigation} location={this.props.location} router={router} />
        </Route>
        <Route>
          <BrowserView>
            <AppSidebarNav navConfig={mainBrowserNavigation()} location={this.props.location} router={router} />
          </BrowserView>
          <MobileView>
            <AppSidebarNav navConfig={mainMobileNavigation()} location={this.props.location} router={router} />
          </MobileView>
        </Route>
      </Switch>
    </AppSidebar>
  }

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    const theme = window.localStorage.getItem('theme') || this.state.theme || 'light'

    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div className={"admin-container " + window.localStorage.getItem('theme') || 'light'}>
          <div className="app">
            <AppHeader fixed className="border-bottom">
              <Suspense fallback={Loading()}>
                <Header {...this.props} theme={theme} changeTheme={this.changeTheme.bind(this)} />
              </Suspense>
            </AppHeader>
            <div className="app-body">
              {this.renderNav()}
              <main className="main mb-5">
                <Container className="p-0" fluid>
                  <Suspense fallback={Loading()}>
                    <ToastContainer position="top-right" autoClose={5000} style={containerStyle} hideProgressBar={true} />
                    <Switch>
                      {
                        adminRoutes.map(({ path, pathTo, redirect, title, component: Component }, key) => {
                          if (redirect) {
                            return <Redirect from={path} to={pathTo} key={key} />
                          } else {
                            return (
                              <Route path={path} render={(props) => <SetTitle title={title}><Component {...props} /></SetTitle>} key={key} />
                            )
                          }
                        })
                      }
                    </Switch>
                  </Suspense>
                </Container>
              </main>

            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout)
