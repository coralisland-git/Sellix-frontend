import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { ToastContainer, toast } from 'react-toastify'
import { documentationRoutes } from 'routes'

import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from 'layouts/theme/theme'
import { GlobalStyles } from 'layouts/theme/global'

import {
  AuthActions,
  CommonActions
} from 'services/global'
import AppHeader from '@coreui/react/es/Header'
import { NotFound, Loading, Header } from 'components'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    is_authed: state.auth.is_authed
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    authActions: bindActionCreators(AuthActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class documentationLayout extends React.Component {

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
      theme: theme
    }
  }

  componentDidMount () {

    document.title = `Developers | Sellix`;

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

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    const theme = window.localStorage.getItem('theme') || this.state.theme || 'light'

    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div className={"admin-container documentation " + window.localStorage.getItem('theme') || 'light'}>
          <div className="app">          
            <AppHeader fixed className="border-bottom">
              <Suspense fallback={Loading()}>              
                <Header {...this.props} 
                  isShop={true} 
                  isDocumentation={true} 
                  theme={theme} 
                  changeTheme={this.changeTheme.bind(this)} 
                />
              </Suspense>
            </AppHeader>
            <div className="app-body">
              <main className="main">                
                <Suspense fallback={Loading()}>
                  <ToastContainer position="top-right" autoClose={5000} style={containerStyle} hideProgressBar={true}/>
                  <Switch>
                  {
                    documentationRoutes.map((prop, key) => {              
                      return (
                        <Route
                          path={prop.path}
                          component={prop.component}
                          exact={true}
                          key={key}
                        />
                      )
                    })
                  }
                  <Route path="*" component={NotFound}/>
                  </Switch>
                </Suspense>                
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(documentationLayout)
