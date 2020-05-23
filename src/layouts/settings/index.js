import React from 'react'
import * as router from 'react-router-dom';
import {Route, Switch, Redirect, NavLink} from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrowserView, MobileView } from "react-device-detect";

import { Container, Collapse, NavbarToggler, Navbar, Row, Col } from 'components/reactstrap'
import AppSidebarNav from '@coreui/react/es/SidebarNav'
import AppSidebar from '@coreui/react/es/Sidebar'
import AppHeader from '@coreui/react/es/Header'

import { settingsRoutes } from 'routes'
import { AuthActions } from 'services/global'
import layoutHOC from '../../HOC/layoutHOC'

import {
  mainBrowserNavigation,
  mainMobileNavigation
} from 'constants/navigation'

import { Header, SetTitle } from 'components'

import './style.scss'




class SettingsLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {

    if (!window.localStorage.getItem('accessToken')) {
      this.props.history.push('/auth/login')
    } else {
      this.props.getSelfUser()
          .catch(err => {
            this.props.logOut()
            this.props.history.push('/auth/login')
          })
    }
  }


  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {

    const { isOpen } = this.state;
    const user = window.localStorage.getItem("userId")

    return (
        <div className="admin-container">
          <div className="app">
            <AppHeader fixed className="border-bottom">
              <Header theme={this.props.theme} changeTheme={this.props.changeTheme} />
            </AppHeader>

            <div className="app-body">
              <AppSidebar fixed className="pt-3 mb-5" display="lg">
                <BrowserView>
                  <AppSidebarNav navConfig={mainBrowserNavigation()} location={this.props.location} router={router}/>
                </BrowserView>
                <MobileView>
                  <AppSidebarNav navConfig={mainMobileNavigation()} location={this.props.location} router={router}/>
                </MobileView>
              </AppSidebar>

              <main className="main mt-5 mb-5 settings-main">
                <Container fluid>

                  <Row>
                    <Col lg={3}>
                      <div>
                        <div className="settings-sidebar mb-4 mt-4 p-4">
                          <Navbar expand="xs" className="p-0">
                            <NavbarToggler onClick={this.toggle} />
                            <Collapse className="mr-5" isOpen={isOpen} navbar>
                              <div>
                                <h4 style={{ color: 'black', fontSize: '16px' }}>Account</h4>
                                <div className="scrollbar-container sidebar-nav ps">
                                  <ul className="nav">
                                    <li className="nav-item">
                                      <NavLink className="nav-link" activeClassName={"active"} to={`/settings/${user}/general`}>General</NavLink>
                                    </li>
                                    <li className="nav-item">
                                      <NavLink className="nav-link" activeClassName={"active"} to={`/settings/${user}/security`}>Security</NavLink>
                                    </li>
                                    <li className="nav-item">
                                      <NavLink className="nav-link" activeClassName={"active"} to={`/settings/${user}/notifications`}>Notifications</NavLink>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Collapse>
                          </Navbar>
                        </div>
                        <div className="settings-sidebar mb-4 mt-4 p-4">
                          <Navbar expand="xs" className="p-0">
                            <NavbarToggler onClick={this.toggle} />
                            <Collapse className="mr-5" isOpen={isOpen} navbar>
                              <div>
                                <h4 style={{ color: 'black', fontSize: '16px' }}>Shop</h4>
                                <div className="scrollbar-container sidebar-nav ps">
                                  <ul className="nav">
                                    <li className="nav-item">
                                      <NavLink className="nav-link" activeClassName={"active"} to={`/settings/${user}/payments`}>Payments</NavLink>
                                    </li>
                                    <li className="nav-item">
                                      <NavLink className="nav-link" activeClassName={"active"} to={`/settings/${user}/design`}>Design</NavLink>
                                    </li>
                                    <li className="nav-item">
                                      <NavLink className="nav-link" activeClassName={"active"} to={`/settings/${user}/analytics`}>Analytics</NavLink>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Collapse>
                          </Navbar>
                        </div>
                      </div>
                    </Col>

                    <Col lg={9}>
                      <div className="p-0 mt-4">
                        <Switch>
                          {settingsRoutes.map(({ path, pathTo, redirect, title, component: Component }, key) =>
                              redirect ?
                                  <Redirect from={path} to={pathTo} key={key} /> :
                                      <Route path={path} render={(props) => <SetTitle title={title}><Component {...props} /></SetTitle>} key={key}/>
                          )}
                        </Switch>
                      </div>
                    </Col>
                  </Row>

                </Container>
              </main>
            </div>
          </div>
        </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getSelfUser: bindActionCreators(AuthActions.getSelfUser, dispatch),
  logOut: bindActionCreators(AuthActions.logOut, dispatch)
})

export default layoutHOC(connect(null, mapDispatchToProps)(SettingsLayout))
