import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, Row, Col } from 'reactstrap'
import { PayPalButton } from "react-paypal-button-v2";
import { CommonActions } from 'services/global'
import { Loader } from 'components'
import QRCode from 'react-qr-code'
import Clipboard from 'react-clipboard.js';
import SweetAlert from 'react-bootstrap-sweetalert';
import * as moment from 'moment/moment'

import sellix_logo from 'assets/images/Sellix_logo.svg'


import './style.scss'
import config from "../../constants/config";


class EmbededInvoice extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      invoice: {},
      timer: '60:00',
      time: {h:0, m:0, s:0},
      seconds: 24*60*60,
      showAlert: true,
      openQRModal: false,
      openFeedbackModal: false,
      copied: false
    }

    this.timer = 0;
    this.apiTimer = 1;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.getPayPalInvoice = this.getPayPalInvoice.bind(this)
  }


  openQrCodeModal() {
    this.setState({openQRModal: !this.state.openQRModal})
  }

  getPayPalInvoice() {
    return this.props.commonActions.getPayPalInvoice(this.state.invoice.uniqid).then(res => {
        if(res && res.data && res.data.invoice) {
            this.setState({
                invoice: res.data.invoice
            })
        }
    })
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    return {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
  }


  getInvoice() {
    this.props.commonActions.getInvoice(this.props.match.params.id).then(res => {
      this.setState({
        invoice: res.data.invoice
      })
    })
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
      if(this.state.invoice.gateway != 'paypal')
        this.apiTimer = setInterval(this.getInvoice.bind(this), 1000*10)
    }
  }


  hideAlert() {
    this.setState({showAlert: false})
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
    // Check if we're at zero.
    if (seconds < 0) { 
      clearInterval(this.timer);
    }
  }

  componentDidMount() {
    this.setState({loading:true})
    this.props.commonActions.getInvoice(this.props.match.params.id).then(res => {
      let seconds = 24*60*60 - (new Date().getTime() - new Date(res.data.invoice.created_at*1000).getTime()) / 1000

      let timeLeftVar = this.secondsToTime(seconds);

      this.setState({
        seconds: seconds,
        invoice: res.data.invoice,
        time: timeLeftVar,
        loading:false
      })
    })
    setInterval(async () => {
      if (this.state.copied)
        this.setState({ copied: false})
    }, 10000)
  }

  setInvoiceStatus(status) {
    if(status == 0){
      this.startTimer()
      return `${this.state.time.h} :
        ${(this.state.time.m>9?this.state.time.m:'0'+this.state.time.m) || '00'} :
        ${this.state.time.s>9?this.state.time.s:'0'+this.state.time.s || '00'}`
    }
    else if(status == 1)
      return 'Paid'
    else if(status == 2)
      return 'Cacelled'
    else if(status == 3)
     return 'Pending'
    else if(status == 4)
     return 'Partial'
  }


  getInvoiceStatus2(status) {
    if(status == 0){
      this.startTimer()
      return (
        <div className="d-flex align-items-center">
          <div className="sk-spinner sk-spinner-pulse"></div>
          Awaiting for payment</div>
      )  
    }
    else if(status == 1)
      return null
    else if(status == 2)
      return null
    else if(status == 3)
     return <div className="d-flex align-items-center">
              <div className="sk-spinner sk-spinner-pulse"></div>
              Waiting for Confirmation
            </div>
    else if(status == 4)
     return 'Partial Payment'

    return null
  }

  render() {
    const {loading, invoice, timer, showAlert, openQRModal, seconds} = this.state

    if(seconds < 0)
      invoice.status = 2

    return (
      <div>
        {
          loading ?
            <Row>
              <Col lg={12}>
                <Loader />
              </Col>
            </Row>
          :
              <div className="embeded-paying-screen">
                {invoice.status == 4 && 
                  <SweetAlert
                    info
                    showConfirm={false}
                    onCancel = {this.hideAlert.bind(this)}
                    title="We haven't received full amount"
                    show={showAlert}
                  >
                    Transaction has been received but it’s not enough, make the send to bitcoin address appear again and update the crypto_received and crypto amount to send in the invoice
                  </SweetAlert>
                }
                <div className="animated fadeIn">
                  <div className="invoice-card ml-auto mr-auto p-0 embed-block">
                      <Card className="bg-white p-0 detail mb-0">
                        <i className="fa fa-times close-popup"></i>
                        <div className="top p-3 pr-5">
                          <div className="d-flex justify-content-between align-items-center ">
                            <h4 className="text-grey">{(invoice.gateway || '').toUpperCase()}</h4>
                            <span className="badge text-primary bold status invoice-timer m-0" id="status">{this.setInvoiceStatus(invoice.status)}</span>
                          </div>
                          <p className="text-grey  mb-3">{invoice.uniqid}</p>
                          <div className="d-flex justify-content-between align-items-center ">
                            <h4 className="text-grey">{(invoice.product || {}).title}</h4>
                            { 
                              invoice.gateway != 'paypal' && 
                                <span className="text-grey d-flex align-items-center">
                                  <img src={config.PAYMENT_ICONS[invoice.gateway]} className="mr-1" width="15" height="15"/>
                                  {invoice.crypto_amount || 0}
                                </span>
                            }
                            
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-grey">{invoice.product_id || ''}</span>
                            <span className="text-grey">{config.CURRENCY_LIST[invoice.currency] || '$'}{invoice.total_display || 0}</span>
                          </div>
                          { openQRModal && (
                            <div className="text-center pb-1">
                              <QRCode value={invoice.crypto_uri || ''} size={226}/>
                            </div>
                          )}
                          {
                            (invoice.status == 3 || invoice.status == 1 || invoice.status == 2 || invoice.gateway == 'paypal')?'':<div style={{ position: "relative"}}>
                                <p className="text-grey bold mt-4 text-center">
                                    Please send exactly <span className="badge text-primary bold">
                                      {(invoice.crypto_amount || 0) - (invoice.crypto_received || 0)}</span> {config.PAYMENT_OPTS[invoice.gateway]} to
                                </p>
                                <p className="btc-address text-grey bold text-center">
                                  {invoice.crypto_address || ''}
                                  <Clipboard data-clipboard-text={invoice.crypto_address || ''} button-title="Copy" onSuccess={ () => { this.setState({ copied : true })}}>
                                    <i className="fa fa-clone" aria-hidden="true"></i>
                                  </Clipboard>
                                </p>
                                { this.state.copied && <small className="clip-alert">Copied</small> }
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                  <span className="text-grey cursor-pointer" onClick={this.openQrCodeModal.bind(this)}>QR Code</span>
                                  <span className="text-grey">Pay in Wallet</span>
                                </div>
        
                            </div>
                          }
                          
                          {(invoice.gateway == 'paypal' && invoice.status == 0) && 
                            <div className="mt-5">
                              <PayPalButton
                                createOrder={(data, actions) => {
                                    return invoice.paypal_tx_id;
                                }}
                                onApprove={(data, actions) => {
                                  
                                    this.getPayPalInvoice()
                                }}
                                onError = {() => {
                                }}
                                style={{
                                    layout: 'horizontal',
                                    color: 'blue',
                                }}
                                amount={invoice.total}
                                currency={invoice.currency}
                                options={{
                                    clientId: invoice.paypal_client_id,
                                    currency: invoice.currency
                                }}
                              />
                            </div>
                          }
                        </div>
                        <div className="bottom p-3">
                          {invoice.status == 1 && 
                            <SweetAlert
                              success
                              title="Order completed!"
                              show={showAlert}
                              showConfirm={false}
                              onConfirm={this.hideAlert.bind(this)}
                           
                            >
                              Your invoice has been paid. <br/>
                              You will receive the products within minutes, <br/>check your email!
                            </SweetAlert>
                          }
                  
                          {invoice.status == 2 && 
                            <SweetAlert
                              danger
                              title="Invoice Cancelled"
                              show={showAlert}
                              showConfirm={false}
                              onConfirm={this.hideAlert.bind(this)}
                            >
                              The invoice has expired or isn't available.
                            </SweetAlert>
                          }
                          { invoice.status != 1 && invoice.status != 2 &&
                          <div>
                            <h4 className="text-primary mb-3">Order Details</h4>
                            {
                              this.getInvoiceStatus2(invoice.status) != null && 
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="text-primary">Status</span>
                                  <h5 className="text-primary b-4">{this.getInvoiceStatus2(invoice.status)}</h5>
                                </div>
                            }
                            
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="text-primary">Seller</span>
                              <h5 className="text-primary b-4">{invoice.username }</h5>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="text-primary">Quantity</span>
                              <h5 className="text-primary b-4">{invoice.quantity}</h5>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="text-primary">Email</span>
                              <h5 className="text-primary b-4">{invoice.customer_email}</h5>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="text-primary">Created</span>
                              <h5 className="text-primary b-4">{moment(new Date(invoice.created_at*1000)).format('hh:mm:ss, DD/MM/YYYY')}</h5>
                            </div>
                            { 
                                invoice.gateway != 'paypal' && 
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-primary">Received</span>
                                    <h5 className="text-primary b-4 d-flex align-items-center">
                                      <img src={config.PAYMENT_ICONS[invoice.gateway]} className="mr-1" width="15" height="15"/>
                                      {invoice.crypto_received}</h5>
                                  </div>
                            }
                          </div>
                        }
                          {/*<div className="float-logo text-center">
                                                      <img src={sellix_logo} width="153" className="logo"/>
                                                    </div>*/}
                        </div>
                        <div className={"p-3 text-center iv-footer"}>
                          Payments processing powered by <strong><a href="https://sellix.io">Sellix</a></strong>
                        </div>
                      </Card>
                   </div>
                </div>
            </div>
          }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}


export default connect(null, mapDispatchToProps)(EmbededInvoice)
