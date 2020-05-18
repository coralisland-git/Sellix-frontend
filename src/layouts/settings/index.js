import React, { Suspense } from 'react'
import * as router from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  BrowserView,
  MobileView
} from "react-device-detect";

import { Container, Collapse, NavbarToggler, Navbar, Row, Col } from 'components/reactstrap'
import AppSidebarNav from '@coreui/react/es/SidebarNav'
import AppSidebar from '@coreui/react/es/Sidebar'
import AppHeader from '@coreui/react/es/Header'
import AppAside from '@coreui/react/es/Aside'
import { ToastContainer, toast } from 'react-toastify'
import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from 'layouts/theme/theme'
import { GlobalStyles } from 'layouts/theme/global'

import { settingsRoutes } from 'routes'
import { AuthActions, CommonActions } from 'services/global'

import {
  mainBrowserNavigation,
  mainMobileNavigation,
  accountSettingsNavigation,
  shopSettingsNavigation
} from 'constants/navigation'

import {
  Aside,
  Header,
  Loading,
  SetTitle
} from 'components'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    version: state.common.version,
    is_authed: state.auth.is_authed,
    profile: state.auth.profile,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    authActions: bindActionCreators(AuthActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}


class SettingsLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      theme: window.localStorage.getItem('theme') || 'light',
      isOpen: false
    }
  }

  componentDidMount() {


    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(this.state.theme);

    document.documentElement.classList.remove('light')
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add(this.state.theme);

    if (!window.localStorage.getItem('accessToken')) {
      this.props.history.push('/auth/login')
    } else {
      this.props.authActions.getSelfUser().then(() => {

      }).catch(err => {
        this.props.authActions.logOut()
        this.props.history.push('/auth/login')
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
      for (let i = 0; i < document.getElementsByClassName('nav-link').length ; i ++) {
        let element = document.getElementsByClassName('nav-link')[i];
        element.addEventListener("mouseenter", function( event ) {   
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
    document.body.classList.add(theme === 'light' ? 'dark': 'light');

    document.documentElement.classList.remove('light')
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add(theme === 'light' ? 'dark': 'light');

    this.setState({ theme: theme === 'light' ? 'dark' : 'light' })
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    const theme = window.localStorage.getItem('theme') || this.state.theme || 'light'
    const { isOpen } = this.state

    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div className="admin-container">
          <div className="app">
            <AppHeader fixed className="border-bottom">
              <Suspense fallback={Loading()}>
                <Header {...this.props} theme={theme} changeTheme={this.changeTheme.bind(this)} />
              </Suspense>
            </AppHeader>
            <div className="app-body">
              <AppSidebar fixed className="pt-3 mb-5" display="lg">
                <Suspense fallback={Loading()}>
                  <BrowserView>
                    <AppSidebarNav navConfig={mainBrowserNavigation()} location={this.props.location} router={router}/>
                  </BrowserView>
                  <MobileView>
                    <AppSidebarNav navConfig={mainMobileNavigation()} location={this.props.location} router={router}/>
                  </MobileView>
                </Suspense>
              </AppSidebar>

              <main className="main mt-5 mb-5 settings-main">
                <Container fluid>

                  <Row>
                    <Col lg={3}>
                      <div>
                        <div className="settings-sidebar mb-4 mt-4 p-4">
                          <Navbar expand="xs" className="p-0">
                            <NavbarToggler onClick={this.toggle.bind(this)} />
                            <Collapse className="mr-5" isOpen={isOpen} navbar>
                              <div>
                                <h4 style={{ color: 'black', fontSize: '16px' }}>Account</h4>
                                <AppSidebarNav navConfig={accountSettingsNavigation} location={this.props.location} router={router} />
                              </div>
                            </Collapse>
                          </Navbar>
                        </div>
                        <div className="settings-sidebar mb-4 mt-4 p-4">
                          <Navbar expand="xs" className="p-0">
                            <NavbarToggler onClick={this.toggle.bind(this)} />
                            <Collapse className="mr-5" isOpen={isOpen} navbar>
                              <div>
                                <h4 style={{ color: 'black', fontSize: '16px' }}>Shop</h4>
                                <AppSidebarNav navConfig={shopSettingsNavigation} location={this.props.location} router={router} />
                              </div>
                            </Collapse>
                          </Navbar>
                        </div>
                      </div>
                    </Col>

                    <Col lg={9}>
                      <div className="p-0 mt-4">
                        <Suspense fallback={Loading()}>
                          <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
                          <Switch>
                            {
                              settingsRoutes.map(({ path, pathTo, redirect, title, component: Component }, key) => {
                                if (redirect) {
                                  return <Redirect from={path} to={pathTo} key={key} />
                                } else {
                                  return (
                                      <Route path={path} render={(props) => <SetTitle title={title}><Component {...props} /></SetTitle>} key={key}/>
                                  )
                                }
                              })
                            }
                          </Switch>
                        </Suspense>
                      </div>
                    </Col>
                  </Row>

                </Container>
              </main>
              <AppAside>
                <Suspense fallback={Loading()}>
                  <Aside />
                </Suspense>
              </AppAside>
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsLayout)
