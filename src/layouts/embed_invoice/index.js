import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import { Container } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { ThemeProvider  } from 'styled-components';
import { lightTheme } from 'layouts/theme/theme'
import { GlobalStyles } from 'layouts/theme/global'

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

  render() {
    const containerStyle = {
      zIndex: 1999
    }

    if (this.props.location.pathname.indexOf("/ivembed") > -1){
      require('./extra.scss')
    }

    return (
      <ThemeProvider theme={lightTheme}>
        <GlobalStyles />
          <div className="admin-container app-embed">
            <div className="">
              <div className="">
                  <Container className="p-0">
                    <Suspense fallback={Loading()}>
                      <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />
                      <Switch>
                        {invoiceRoutes.map((prop, key) => <Route {...prop} key={key} />)}
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