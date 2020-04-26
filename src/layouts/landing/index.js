import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ToastContainer, toast } from 'react-toastify'
import { landingRoutes } from 'routes'
import { AuthActions, CommonActions } from 'services/global'

import {
    Button,
    Container,
    Collapse,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap'

import sellix_logo from 'assets/images/home/logo-1@2x.png'
import sellix_logo_footer from 'assets/images/Sellix_logo_beta.svg'
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

    if (window.localStorage.getItem('accessToken') && this.props.is_authed) {
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
    const user = window.localStorage.getItem('userId')
    let dashboardUrl = user? `/dashboard/${user}/home` : '/'

    return (
    <div className="landing-layout">
        <div className="animated fadeIn">
            <div className="initial-container">
              <ToastContainer position="top-right" autoClose={5000} style={containerStyle} hideProgressBar={true}/>
            
                <Router>
                  <Switch>
                  {landingRoutes.map(({ path, component: Component, name, exact}, key) => (
                    <Route path={path} key={key} exact={exact} render={() => (
                         <>
                             <header className={`pt-3 pb-3 ${name === 'Home'?'home-header':''}`}>
                                 <Navbar  color="white" light expand="lg">
                                     <NavbarBrand href="/">
                                         <img className="logo" src={name === 'Home'?sellix_logo:sellix_logo_footer}/>
                                     </NavbarBrand>
                                     <Collapse className="mr-3" isOpen={isOpen} navbar>
                                         <Nav className="ml-auto" navbar>
                                             <NavItem className="active">
                                                 <NavLink href="/">Home</NavLink>
                                             </NavItem>
                                             <NavItem>
                                                 <NavLink href="/">Features</NavLink>
                                             </NavItem>
                                             <NavItem>
                                                 <NavLink href="/auth/register">Get Started</NavLink>
                                             </NavItem>
                                             <NavItem>
                                                 <NavLink href="/" />
                                             </NavItem>

                                         </Nav>
                                     </Collapse>
                                     <div>
                                         { user?
                                             <Button className="mr-3 landing-primary-button text-white menu" onClick={() => history.push(dashboardUrl)}>
                                                 Dashboard
                                             </Button>
                                             :
                                             <>
                                                 <Button className="landing-secondary-button menu mr-2" onClick={() => history.push('/auth/login')}>
                                                     Log In
                                                 </Button>
                                                 <Button className="landing-primary-button menu" onClick={() => history.push('/auth/register')}>
                                                     Sign Up
                                                 </Button>
                                             </>
                                         }
                                     </div>
                                 </Navbar>
                             </header>
                             <Component/>
                         </>
                     )} />
                  ))}
                  </Switch>
                </Router>

                <footer>
                  <div className="footer-hr"/>
                  <div className="section white text-center" style={{paddingBottom: 100, paddingTop: 50}}>
                    <Container className="home-container p-0" fluid>
                        <div className="d-flex justify-content-between text-left flex-wrap">
                        <div className="mb-3">
                            <NavbarBrand className="p-0" href="/">
                            <img  className="logo" src={sellix_logo_footer} width="137"/>
                            </NavbarBrand>
                            <p className="mt-2">Copyright © 2020, Sellix.io.</p>
                        </div>
                        <div className="mb-3" style={{maxWidth: 295}}>
                            <h5 className="mb-3">About Us</h5>
                            <p className="mt-4">Sellix is an online e-commerce payment processing 
                            website that lets you create your own store with a couple of clicks.</p>
                        </div>
                        <div className="mb-3">
                            <h5 className="mb-3">Sellix</h5>
                            <Nav vertical>
                            <NavItem>
                                <NavLink href={dashboardUrl}>Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/auth/register">Register</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/terms">Terms</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/changelog">Changelog</NavLink>
                            </NavItem>
                            </Nav>
                        </div>
                        <div className="mb-3">
                            <h5 className="mb-3">Products</h5>
                            <Nav vertical>
                            <NavItem>
                                <NavLink href="#">API</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#">Payments</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/fees">Fees</NavLink>
                            </NavItem>
                            </Nav>
                        </div>
                        <div className="mb-3">
                            <h5 className="mb-3">Help</h5>
                            <Nav vertical>
                            <NavItem>
                                <NavLink href="#">Help Center</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#">Contact Us</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://t.me/sellixio">Telegram</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#">Status</NavLink>
                            </NavItem>
                            </Nav>
                        </div>
                        </div>
                    </Container>
                </div>
                </footer>
            </div>
        </div>
    </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingLayout)
