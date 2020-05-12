import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ToastContainer, toast } from 'react-toastify'
import { authRoutes } from 'routes'
import { AuthActions, CommonActions } from 'services/global'
import { NotFound } from 'components'


import './style.scss'


class AuthLayout extends Component {

  componentDidMount () {
    const preUrl = `/${window.localStorage.getItem('userId')}`
      
    if (window.localStorage.getItem('accessToken') && this.props.is_authed) {
      this.props.history.push(preUrl)
    }

    this.props.commonActions.setTostifyAlertFunc(
        (status, message) => {
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
    )
  }

  render() {

    const containerStyle = {
      zIndex: 1999
    }

    const user = window.localStorage.getItem('userId')

    if(user && !window.location.pathname.includes('/auth/change/email'))  {
      window.location = `/dashboard/${user}/home`;
      return ""
    }

    return (
      <div className="initial-container">
        <ToastContainer position="top-right" autoClose={5000} style={containerStyle} hideProgressBar={true}/>
          <Switch>
            {authRoutes.map((prop, key) => <Route {...prop} exact={true} key={key}/>)}
            <Route path="*" component={NotFound}/>
          </Switch>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  is_authed: state.auth.is_authed
});

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(AuthActions, dispatch),
  commonActions: bindActionCreators(CommonActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLayout)
