import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { ToastContainer, toast } from 'react-toastify'
import { AuthActions, CommonActions } from 'services/global'

import LandingFooter from './footer'
import LandingHeader from './header'

import './style.scss'
import {Changelog, Fees, Home, Terms, Ticket} from "../../screens";
import {NotFound} from "../../components";


const userId = window.localStorage.getItem('userId')

class LandingLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        isOpen: false
    }
  }

  componentDidMount () {
    const preUrl = `/${window.localStorage.getItem('userId')}`

    if(this.props.match.path === '/contact') {
      this.props.getSelfUser()
          .catch(res => {
            this.props.history.push("/auth/login")
      })
    } else {
      this.props.getSelfUser()
    }

    if (window.localStorage.getItem('accessToken') && this.props.is_authed && this.props.match.path !== '/contact') {
      this.props.history.push(preUrl)
    }

    this.props.setTostifyAlertFunc((status, message) => {
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
    })
  }

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    const { isOpen } = this.state;
    const { history, match } = this.props;

    const dashboardUrl = userId ? `/dashboard/${userId}/home` : '/'

    return (
      <div className="landing-layout">
          <div className="animated fadeIn">
              <div className="initial-container">
                <ToastContainer position="top-right" autoClose={5000} style={containerStyle} hideProgressBar={true}/>

                  <LandingHeader page={match.url} isOpen={isOpen} user={userId} history={history} dashboardUrl={dashboardUrl} />

                  <Router>
                    <Switch>
                      <Route component={Fees} path={'/fees'} />
                      <Route component={Changelog} path={'/changelog'} />
                      <Route component={Terms} path={'/terms'} />
                      <Route component={NotFound} path={'/404'} />
                      <Route component={Ticket} path={'/contact'} />
                      <Route exact={true} component={Home} path={'/'} />
                    </Switch>
                  </Router>

                  <LandingFooter dashboardUrl={dashboardUrl} />
              </div>
          </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  is_authed: state.auth.is_authed
})

const mapDispatchToProps = (dispatch) => ({
  getSelfUser: bindActionCreators(AuthActions.getSelfUser, dispatch),
  setTostifyAlertFunc: bindActionCreators(CommonActions.setTostifyAlertFunc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LandingLayout)
