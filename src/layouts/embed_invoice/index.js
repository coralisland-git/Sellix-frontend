import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as router from 'react-router-dom';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import { Container } from 'reactstrap'
import {
  AppFooter,
  AppHeader,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import { ThemeProvider, createGlobalStyle  } from 'styled-components';
import { darkTheme, lightTheme } from 'layouts/theme/theme'
import { GlobalStyles } from 'layouts/theme/global'

import { paymentRoutes } from 'routes'
import {  
  CommonActions
} from 'services/global'


import {
  Loading
} from 'components'

import './style.scss'
import { invoiceRoutes } from '../../routes';

const mapStateToProps = (state) => {
  return ({
    version: state.common.version,
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({    
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class EmbedInvoiceLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: window.localStorage.getItem('theme') || 'light'
    }
  }

  componentDidMount () {
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
    window.localStorage.setItem('theme', theme === 'light' ? 'dark': 'light')

    this.setState({theme: theme === 'light' ? 'dark': 'light'})
  }

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    if (this.props.location.pathname.indexOf("/ivembed") > -1){
      require('./extra.scss')
    }

    const theme = window.localStorage.getItem('theme') || this.state.theme || 'light'

    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme:darkTheme}>
        <GlobalStyles />
          <div className="admin-container app-embed">
            <div className="">
              <div className="">
                  <Container className="p-0" fluid>
                    <Suspense fallback={Loading()}>
                      <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
                      <Switch>
                        {
                          invoiceRoutes.map((prop, key) => {
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
                    </Suspense>
                  </Container>
                </div>
            </div>
          </div>
      </ThemeProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbedInvoiceLayout)