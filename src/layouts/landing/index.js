import React from 'react'
import Router from 'react-router-dom/es/BrowserRouter'
import Route from 'react-router-dom/es/Route'
import Switch from 'react-router-dom/es/Switch'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import layoutHOC from '../../HOC/layoutHOC'
import { AuthActions, CommonActions } from 'services/global'
import LandingFooter from './footer'
import LandingHeader from './header'
import { Changelog, Fees, Home, Terms, Ticket } from "../../screens";
import { NotFound } from "../../components";
import './style.scss'

const userId = window.localStorage.getItem('userId')

class LandingLayout extends React.Component {

  componentDidMount () {
    const preUrl = `/${userId}`


    document.body.classList.remove('dark');
    document.body.classList.add('light');

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
  }

  render() {

    const { history, match } = this.props;

    const dashboardUrl = userId ? `/dashboard/${userId}/home` : '/'

    return (
      <div className="landing-layout">
          <div className="animated fadeIn">
              <div className="initial-container">

                  <LandingHeader page={match.url} user={userId} history={history} dashboardUrl={dashboardUrl} />

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

export default layoutHOC(connect(mapStateToProps, mapDispatchToProps)(LandingLayout))
