import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { authRoutes } from 'routes'
import { NotFound } from 'components'
import layoutHOC from '../../HOC/layoutHOC'


class AuthLayout extends Component {

  constructor(props) {
    super(props);

    document.body.classList.remove('light');
    document.body.classList.remove('dark');
  }

  componentDidMount () {
    const preUrl = `/${window.localStorage.getItem('userId')}`;
    const token = window.localStorage.getItem('accessToken');

    if (token && this.props.is_authed) {
      this.props.history.push(preUrl)
    }
  }

  render() {

    const user = window.localStorage.getItem('userId')

    if(user && !window.location.pathname.includes('/auth/change/email'))  {
      window.location = `/dashboard/${user}/home`;
      return ""
    }

    return (
      <div className="initial-container">
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

export default layoutHOC(connect(mapStateToProps)(AuthLayout))
