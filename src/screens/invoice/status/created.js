import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, Row, Col } from 'reactstrap'
import SweetAlert from 'react-bootstrap-sweetalert';
import * as moment from 'moment/moment'
import { QRCodeModal } from 'components'
import { PayPalButton } from "react-paypal-button-v2";
import { CommonActions } from 'services/global'
import { Loader, Button } from 'components'
import StripeForm from '../stripeForm'
import config from 'constants/config'

import sellix_logo from 'assets/images/Sellix_logo.svg'
import backIcon from 'assets/images/x.png'
import perfectmoneyIcon from 'assets/images/crypto/perfectmoney.svg'
import skrillLinkIcon from 'assets/images/skrill_link.svg'

import './style.scss'



const PerfectMoney = ({ perfectmoney_id, username, uniqid, total_display, currency }) => {

  return <div className="mt-5">
    <div className="d-flex input-group">
      <form id="pm-form" className="w-100" action="https://perfectmoney.is/api/step1.asp" target="_blank" method="POST">
        <input type="hidden" name="PAYEE_ACCOUNT" value={perfectmoney_id}/>
        <input type="hidden" name="PAYEE_NAME" value={username}/>
        <input type='hidden' name='PAYMENT_ID' value={uniqid}/>
        <input type="hidden" name="PAYMENT_AMOUNT" value={total_display}/>
        <input type="hidden" name="PAYMENT_UNITS" value={currency}/>
        <input type="hidden" name="STATUS_URL" value="https://api.sellix.io/v1/invoices/perfectmoney"/>
        <input type="hidden" name="PAYMENT_URL" value={`https://sellix.io/invoice/${uniqid}`}/>
        <input type="hidden" name="PAYMENT_URL_METHOD" value="LINK"/>
        <input type="hidden" name="NOPAYMENT_URL" value={`https://sellix.io/invoice/${uniqid}`}/>
        <input type="hidden" name="NOPAYMENT_URL_METHOD" value="LINK"/>
        <input type="hidden" name="SUGGESTED_MEMO" value=""/>
        <input type="hidden" name="INTERFACE_LANGUAGE" value="en_US"/>
        <input type="hidden" name="BAGGAGE_FIELDS" value="IDENT"/>

        <Button type="submit" name="PAYMENT_METHOD" className="perfectmoney-button w-100 p-0" value="Pay Now!" class="tabeladugme" id="pm-button">
          <img src={perfectmoneyIcon} /> Perfect Money
        </Button>
      </form>
    </div>
  </div>
}



class Invoice extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      invoice: {},
      timer: '60:00',
      time: { h:0, m:0, s:0 },
      seconds: 2*60*60,
      showAlert: true,
      openQRModal: false,
      openFeedbackModal: false,
      fakeSuccess: false
    }

    this.timer = 0;
    this.apiTimer = 1;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.getPayPalInvoice = this.getPayPalInvoice.bind(this)
  }

  openQrCodeModal = () => {
    this.setState({ openQRModal: true })
  }

  closeQrCodeModal() {
    this.setState({openQRModal: false})
  }

  getPayPalInvoice() {
    return this.props.getPayPalInvoice(this.state.invoice.uniqid).then(res => {
        if(res && res.data && res.data.invoice) {
            this.setState({
                invoice: res.data.invoice
            })
        }
    })
  }

  openFeedBackModal() {
    this.setState({openFeedbackModal: true})
  }

  okHandler() {
    this.setState({openFeedbackModal: false})

    this.props.history.push({
      pathname: `/shop/${this.props.match.params.username}/feedback/id`
    })
  }


  secondsToTime = (secs) => {

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


  getInvoice = () => {
    this.props.getInvoiceViaWebsocket(this.props.match.params.id).then(invoice => {
      this.setState({
        invoice
      })
    })
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
      if(this.state.invoice.gateway != 'paypal') {
        this.apiTimer = setInterval(this.getInvoice, 1000*10)
      }
    }
  }

  hideAlert = () => {
    this.setState({ showAlert: false })
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

  gotoPaypal(e, id) {
    this.props.history.push({
      pathname: '/paypal-pay',
      search: `?id=${id}`
    })
  }

  componentDidMount() {
    this.setState({ loading:true });
    const { getInvoice, match } = this.props;
    const { id } = match.params;

    document.title = `Invoice ${id} | Sellix`;

    getInvoice(id)
        .then(({ data: { invoice }}) => {
          let seconds = 2 * 60 * 60 - (new Date().getTime() - new Date(invoice.created_at * 1000).getTime()) / 1000
          let time = this.secondsToTime(seconds);
          this.setState({ seconds, invoice, time })
        })
        .finally(() => this.setState({ loading: false }))
  }

  setInvoiceStatus = (status) => {

    const { fakeSuccess, time } = this.state;

    if(+status === 0  && !fakeSuccess) {
      this.startTimer();
      return `${time.h} : ${(time.m > 9 ? time.m : '0' + time.m) || '00'} : ${time.s > 9 ? time.s : '0' + time.s || '00'}`;
    } else if(+status === 1 || fakeSuccess)
      return 'Paid'
    else if(+status === 2)
      return 'Cacelled'
    else if(+status === 3)
     return 'Pending'
    else if(+status === 4)
     return 'Partial'
  }


  getInvoiceStatus2(status) {

    const { invoice } = this.state;

    if(+status === 0){
      this.startTimer()
      return <div className="d-flex align-items-center"><div className="sk-spinner sk-spinner-pulse" />Awaiting for payment</div>
    } else if(+status === 1 || +status === 2) {
      return null
    } else if(+status === 3) {
      return <div className="d-flex align-items-center"><div className="sk-spinner sk-spinner-pulse" />Waiting for Confirmation ({((invoice.crypto_transactions || []).slice(-1)[0] || {}).confirmations }/{invoice.crypto_confirmations || 0})</div>
    } else if(+status === 4) {
      return <div className="d-flex align-items-center"><div className="sk-spinner sk-spinner-pulse" />Partial Payment</div>
    } else {
      return null
    }
  }


  getCryptoReceived({ gateway, crypto_received }) {
    if(gateway === 'paypal' || gateway === 'perfectmoney' || gateway === 'skrill' || gateway === 'stripe') {
      return null
    } else {
      return (
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-primary">Received</span>
            <h5 className="text-primary mb-0 d-flex align-items-center">
              <img src={config.PAYMENT_ICONS[gateway]} className="mr-1" width="15" height="15" />{crypto_received}
            </h5>
          </div>
      )
    }
  }

  getCryptoAmount({gateway, crypto_amount}) {
    if(gateway === 'paypal' || gateway === 'perfectmoney' || gateway === 'skrill' || gateway === 'stripe') {
      return null
    } else {
      return (
        <span className="text-grey d-flex align-items-center">
          <img src={config.PAYMENT_ICONS[gateway]} className="mr-1" width="15" height="15"/>{crypto_amount || 0}
        </span>
      )
    }
  }

  getPaymentForm = ({ gateway, status, crypto_amount, crypto_received, crypto_address }) => {
    if(gateway === 'paypal' || gateway === 'perfectmoney' || gateway === 'skrill') {
      return ''
    }

    if(gateway === 'stripe') {
      const { invoice, fakeSuccess } = this.state;

      if(+status === 1 || fakeSuccess) {
        return ""
      }
      return <StripeForm invoice={invoice} onSuccess={() => this.setState({ fakeSuccess: true })} />
    }

    if(+status < 1 || +status > 3)
      return(
        <div>
          <p className="text-grey bold mt-4 text-center">
              Please send exactly
            <span className="badge text-primary bold">{((crypto_amount || 0) - (crypto_received || 0)).toFixed(8)}</span>
            {config.PAYMENT_OPTS[gateway]} to
          </p>
          <p className="btc-address text-grey bold text-center">
            {crypto_address || ''}
          </p>
          <div className="d-flex justify-content-between align-items-center ">
            <span className="text-grey cursor-pointer" onClick={this.openQrCodeModal}>QR Code</span>
            <span className="text-grey">Pay in Wallet</span>
          </div>
        </div>
      )
  }

  render() {
    const {loading, invoice, timer, showAlert, openQRModal, seconds, fakeSuccess} = this.state;

          invoice.status = 4;

    return (
      <div>
        {loading && <Row><Col lg={12}><Loader /></Col></Row>}
        {!loading &&
            <div className="bitcoin-paying-screen">
                <QRCodeModal openModal={openQRModal} value={invoice.crypto_uri || ''} closeModal={this.closeQrCodeModal.bind(this)}/>


              {+invoice.status === 4 &&
              <SweetAlert info showConfirm={false} onCancel={this.hideAlert} title="We haven't received full amount" show={showAlert}>
                Transaction has been received but it’s not enough. We only received {invoice.crypto_received} of {invoice.crypto_amount}, please send the remaining amount in order to fulfill the invoice
              </SweetAlert>
              }

                <div className="animated fadeIn">
                  <Row className="m-3">
                    <div className="invoice-card ml-auto mr-auto p-0">
                      <div className="float-logo"><img src={sellix_logo} width="153"/></div>
                      
                      <Card className="bg-white p-0 detail pt-3">

                        <div className="text-right pr-3">
                          <img
                              src={backIcon}
                              width="15"
                              height="15"
                              onClick={() => {clearInterval(this.apiTimer); this.props.history.goBack()}}
                              style={{cursor: "pointer"}}
                          />
                        </div>
                        
                        <div className="top p-4 pt-4">

                          <div className="d-flex justify-content-between align-items-center ">
                            <h4 className="text-grey">{(invoice.gateway || '').toUpperCase()}</h4>
                            <span className="badge text-primary bold status invoice-timer m-0" id="status">{this.setInvoiceStatus(invoice.status)}</span>
                          </div>

                          <p className="text-grey  mb-3">{invoice.uniqid}</p>

                          <div className="d-flex justify-content-between align-items-center ">
                            <h4 className="text-grey">{(invoice.product || {}).title}</h4>
                            {this.getCryptoAmount({...invoice})}
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-grey">{invoice.product_id || ''}</span>
                            <span className="text-grey">{config.CURRENCY_LIST[invoice.currency] || '$'}{invoice.total_display || 0}</span>
                          </div>
                          
                          {
                            this.getPaymentForm({...invoice})
                          }

                          {
                          (invoice.gateway == 'paypal' && invoice.status == 0) && 
                            <div className="mt-5">
                              <PayPalButton
                                createOrder={() => invoice.paypal_tx_id}
                                onApprove={this.getPayPalInvoice()}
                                onError = {() => {}}
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

                          {(invoice.gateway == 'perfectmoney' && invoice.status == 0) && 
                            <PerfectMoney {...invoice} />
                          }

                          {
                          (invoice.gateway == 'skrill' && invoice.status == 0) && 
                            <div className="mt-5">
                              <div className="d-flex input-group">
                                <a target="_blacnk" href={invoice.skrill_link} className="w-100 p-0 text-center skrill-button">
                                  <img src={skrillLinkIcon} height="45"/>
                                </a>
                              </div>
                            </div>
                          }
                        </div>
                        
                        <div className="bottom order-detail-info p-4">
                          {(invoice.status == 1 || fakeSuccess) && 
                            <SweetAlert
                              success
                              title="Order completed!"
                              show={showAlert}
                              showConfirm={false}
                              onConfirm={this.hideAlert}
                            >
                              Your invoice has been paid. <br/>
                              You will receive the products within minutes, <br/>check your email!
                            </SweetAlert>
                          }
                  
                          {invoice.status == 2 && !fakeSuccess &&
                            <SweetAlert
                              danger
                              title="Invoice Cancelled"
                              show={showAlert}
                              showConfirm={false}
                              onConfirm={this.hideAlert}
                            >
                              The invoice has expired or isn't available.
                            </SweetAlert>
                          }

                          
                          { invoice.status != 1 && invoice.status != 2 && !fakeSuccess &&
                            <div>
                              <h4 className="text-primary mb-3">Order Details</h4>
                              {
                                this.getInvoiceStatus2(invoice.status) != null && 
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-primary">Status</span>
                                    <h5 className="text-primary mb-0">{this.getInvoiceStatus2(invoice.status)}</h5>
                                  </div>
                              }
                              
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-primary">Seller</span>
                                <h5 className="text-primary mb-0">{invoice.username }</h5>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-primary">Quantity</span>
                                <h5 className="text-primary mb-0">{invoice.quantity}</h5>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-primary">Email</span>
                                <h5 className="text-primary mb-0">{invoice.customer_email}</h5>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-primary">Created</span>
                                <h5 className="text-primary mb-0">{moment(new Date(invoice.created_at*1000)).format('hh:mm:ss, DD/MM/YYYY')}</h5>
                              </div>
                              { 
                                this.getCryptoReceived({...invoice})
                              }
                            </div>
                          }
                        </div>

                      </Card>

                      <Card>
                        Leave some feedback?
                        We'll use your comments to help other customers make a more informed purchase.
                        <textarea name="d" id="" cols="30" rows="10" placeholder={"Write a comment?"} />
                        Like Dislike
                        Submit
                      </Card>

                      <Card>
                        Test | Test | Test | Test
                        <pre>123ads</pre>
                        Copy to clipboard
                        Save as
                      </Card>

                    </div>
                  </Row>
                </div>
            </div>
          }
      </div>
    )
  }
}


const mapStateToProps = (state) => ({ })
const mapDispatchToProps = (dispatch) => ({
  getPayPalInvoice: bindActionCreators(CommonActions.getPayPalInvoice, dispatch),
  getInvoice: bindActionCreators(CommonActions.getInvoice, dispatch),
  getInvoiceViaWebsocket: bindActionCreators(CommonActions.getInvoiceViaWebsocket, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(Invoice)