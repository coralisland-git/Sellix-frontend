import React, { Component, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container } from 'components/reactstrap'
import AppHeader from '@coreui/react/es/Header'
import { ToastContainer, toast } from 'react-toastify'
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from 'layouts/theme/theme'
import { GlobalStyles } from 'layouts/theme/global'
import { dashboardRoutes } from 'routes'
import { AuthActions, CommonActions } from 'services/global'
import { Header, Loading, SetTitle } from 'components'
import Nav from './nav'

import './style.scss'


class AdminLayout extends Component {

  constructor(props) {
    super(props);
    let theme = window.localStorage.getItem('theme') || 'light'

    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(theme);

    document.documentElement.classList.remove('light')
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add(theme);
    this.state = {
      theme
    }
  }

  componentDidMount() {

    const { history, location, getSelfUser, setTostifyAlertFunc, logOut } = this.props;

    const userId = window.localStorage.getItem('userId')

    if (!window.localStorage.getItem('accessToken')) {
      history.push('/auth/login')
    } else {      

      if(location.pathname === '/webhooks'){
        history.push(`/dashboard/${userId}/developer/webhooks/all`)
      }

      if(location.pathname === '/webhooks/simulate'){
        history.push(`/dashboard/${userId}/developer/webhooks/logs`)
      }

      getSelfUser()
          .then(({ status, data }) => {
            if(status === 200) {

            } else {
              logOut()
              history.push('/auth/login')
            }
          })
          .catch(err => {
            logOut()
            history.push('/auth/login')
          })

      setTostifyAlertFunc((status, message) => {
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

    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    if (iOS) {
      for (let i = 0; i < document.getElementsByClassName('nav-link').length; i++) {
        let element = document.getElementsByClassName('nav-link')[i];
        element.addEventListener("mouseenter", function (event) {
          element.click();
        }, false);
      }
    }
  }

  changeTheme = () => {
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

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    const { location } = this.props;

    const theme = window.localStorage.getItem('theme') || this.state.theme || 'light'

    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div className={"admin-container " + window.localStorage.getItem('theme') || 'light'}>
          <div className="app">

            <AppHeader fixed className="border-bottom">
              <Header {...this.props} theme={theme} changeTheme={this.changeTheme} />
            </AppHeader>

            <div className="app-body">
              <Nav location={location} />

              <main className="main mb-5">
                <Container className="p-0 h-100" fluid>
                  <Suspense fallback={Loading()}>
                    <ToastContainer position="top-right" autoClose={5000} style={containerStyle} hideProgressBar={true} />
                    <Switch>
                      {
                        dashboardRoutes.map(({ path, pathTo, redirect, title, component: Component }, key) => (
                            redirect ?
                                <Redirect from={path} to={pathTo} key={key} /> :
                                <Route path={path} render={(props) => <SetTitle title={title}><Component {...props} /></SetTitle>} key={key} />
                        ))
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


const mapStateToProps = (state) => ({
  version: state.common.version,
  profile: state.auth.profile,
  is_authed: state.auth.is_authed
});

const mapDispatchToProps = (dispatch) => ({
  getSelfUser: bindActionCreators(AuthActions.getSelfUser, dispatch),
  logOut: bindActionCreators(AuthActions.logOut, dispatch),
  markAsRead: bindActionCreators(AuthActions.markAsRead, dispatch),
  setTostifyAlertFunc: bindActionCreators(CommonActions.setTostifyAlertFunc, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout)
