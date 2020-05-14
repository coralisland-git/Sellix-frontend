import React from 'react'
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import { Link } from "react-scroll";
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { ToastContainer, toast } from 'react-toastify'
import { landingRoutes } from 'routes'
import { AuthActions, CommonActions } from 'services/global'

import {
    Collapse,
    Navbar,
    NavbarBrand,
    Nav
} from 'reactstrap'
import { Button } from 'components'
import sellix_logo from 'assets/images/home/logo-1@2x.png'
import sellix_logo_footer from 'assets/images/Sellix_logo_beta.svg'
import LandingFooter from './footer'

import './style.scss'

const mapStateToProps = (state) => ({
    is_authed: state.auth.is_authed
})

const mapDispatchToProps = (dispatch) => ({
    authActions: bindActionCreators(AuthActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
})


class LandingLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        isOpen: false
    }
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen})
  }

  componentDidMount () {
    const preUrl = `/${window.localStorage.getItem('userId')}`

    this.props.authActions.getSelfUser()

    if (window.localStorage.getItem('accessToken') && this.props.is_authed && this.props.match.path !== '/contact') {
      this.props.history.push(preUrl)
    }

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

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    const { isOpen } = this.state;
    const { history } = this.props;

    const page = this.props.match.url
    const user = window.localStorage.getItem('userId')
    const dashboardUrl = user ? `/dashboard/${user}/home` : '/'

    return (
    <div className="landing-layout">
        <div className="animated fadeIn">
            <div className="initial-container">
              <ToastContainer position="top-right" autoClose={5000} style={containerStyle} hideProgressBar={true}/>
              <header className={`pt-2 pb-2 ${page == '/'?'home-header':''}`}>
                <Navbar  color="white" light expand="lg">
                  <NavbarBrand href="/">
                      <img className="logo" src={page === '/'?sellix_logo:sellix_logo_footer}/>
                  </NavbarBrand>

                  {
                    page == '/' &&
                      <Collapse className="mr-5" isOpen={isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                          <Link
                            activeClass="active"
                            to="home_section"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration= {500}
                          >Home</Link>
                          <Link
                            activeClass="active"
                            to="feature_section"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration= {500}
                          >Features</Link>
                          <Link
                            activeClass="active"
                            to="started_section"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration= {500}
                          >Get Started</Link>
                        </Nav>
                      </Collapse>
                    }

                    <div>
                      { user?
                          <Button className="mr-3 landing-primary-button text-white menu"
                            onClick={() => this.props.history.push(dashboardUrl)}
                          >
                            Dashboard
                          </Button>
                          :
                          <>
                            <Button className="landing-secondary-button menu mr-2"
                              onClick={() => this.props.history.push('/auth/login')}>
                              Log In
                            </Button>
                            <Button className="landing-primary-button menu"
                              onClick={() => this.props.history.push('/auth/register')}>
                              Sign Up
                            </Button>
                          </>
                        }
                    </div>
                  </Navbar>
                </header>
                <Router>
                  <Switch>
                  {
                      landingRoutes.map((prop, key) => {
                      if (prop.redirect)
                          return <Redirect from={prop.path} to={prop.pathTo} key={key} />
                      return (
                          <Route
                            path={prop.path}
                            component={prop.component}
                            key={key}
                          />
                      )
                      })
                  }
                  </Switch>
                </Router>
                
                <LandingFooter dashboardUrl={dashboardUrl} />
                
            </div>
        </div>
    </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingLayout)
