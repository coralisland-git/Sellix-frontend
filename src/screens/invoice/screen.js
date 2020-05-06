import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, Row, Col, Container } from 'reactstrap'
import SweetAlert from 'react-bootstrap-sweetalert';
import * as moment from 'moment/moment'
import { QRCodeModal } from 'components'
import { PayPalButton } from "react-paypal-button-v2";
import { CommonActions } from 'services/global'
import { getInvoiceInfo, downloadInvoice } from './actions'
import { Loader, Button } from 'components'
import StripeForm from './stripeForm'
import LeaveFeedback from '../feedbacks_shop/screens/create/screen'
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
          <img src={perfectmoneyIcon} alt={""}/> Perfect Money
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
    this.getPayPalInvoice = this.getPayPalInvoice.bind(this)
  }

  openQrCodeModal = () => {
    this.setState({openQRModal: true})
  }

  closeQrCodeModal = () => {
    this.setState({openQRModal: false})
  }

  getPayPalInvoice() {
    return this.props.getPayPalInvoice(this.state.invoice.uniqid)
        .then(res => {
          if(res && res.data && res.data.invoice) {
              this.setState({ invoice: res.data.invoice });
              if(+res.data.invoice.status === 1) {
                return getInvoiceInfo(this.props.match.params.id)
              }
          }
        })
        .then((res) => {
          if(res && res.data && res.data.info) {
            this.setState({
              info: res.data.info
            })
          }
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
    const { getInvoiceViaWebsocket, match: { params: { id }} } = this.props;
    getInvoiceViaWebsocket(id)
        .then(invoice => {
          this.setState({ invoice })
          if(+invoice.status === 1) {
            return getInvoiceInfo(id)
          }
        })
        .then((res) => {
          if(res && res.data && res.data.info) {
            this.setState({
              info: res.data.info
            })
          }
        })
  }

  startTimer = () => {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
      if(this.state.invoice.gateway !== 'paypal') {
        this.apiTimer = setInterval(this.getInvoice, 1000*10)
      }
    }
  }

  hideAlert = () => {
    this.setState({ showAlert: false })
  }

  countDown = () => {
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
    this.setState({ loading:true });
    const { getInvoice, getInvoiceInfo, match } = this.props;
    const { id } = match.params;

    document.title = `Invoice ${id} | Sellix`;

    getInvoice(id)
        .then(({ data: { invoice }}) => {
          let seconds = 2 * 60 * 60 - (new Date().getTime() - new Date(invoice.created_at * 1000).getTime()) / 1000
          let time = this.secondsToTime(seconds);
          this.setState({ seconds, invoice, time })
          if(+invoice.status === 1) {
            return getInvoiceInfo(id)
          }
        })
        .then((res) => {
          if(res && res.data && res.data.info) {
            this.setState({
              info: res.data.info
            })
          }
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

  getInvoiceStatus2 = (status) => {

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

  getCryptoReceived = ({ gateway, crypto_received }) => {
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

  getCryptoAmount = ({ gateway, crypto_amount }) => {
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
    if(gateway === 'paypal' || gateway === 'skrill' || gateway === 'perfectmoney') {
      return ''
    }

    if(gateway === 'stripe') {
      const { invoice, fakeSuccess } = this.state;

      if(+status === 1 || fakeSuccess) {
        return ""
      }
      return <StripeForm invoice={invoice} onSuccess={() => this.setState({ fakeSuccess: true })}/>
    }

    if(+status < 1 || +status > 3)
      return(
        <div>
          <p className="text-grey bold mt-4 text-center">
              Please send exactly <span className="badge text-primary bold">
                {((crypto_amount || 0) - (crypto_received || 0)).toFixed(8)}</span> {config.PAYMENT_OPTS[gateway]} to
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

  onSaveFile = () => {
    let { invoice, info } = this.state;
    let { downloadInvoice, match: { params: { id }} } = this.props;

    let secret = localStorage.getItem(id);
    let url = `https://api.sellix.io/v1/invoices/download/${id}/${secret}`;

    let win = window.open(url, '_blank');
        win.focus();
    // d
    downloadInvoice(id)
    // if(invoice.product_type === "file") {
    //
    // } else if(invoice.product_type === "serials") {
    //
    // } else if(invoice.product_type === "service") {
    //
    // }
  }

  render() {

    const { loading, invoice, showAlert, openQRModal, fakeSuccess, info,  } = this.state;

    return (
      <div>
        {loading && <Row><Col lg={12}><Loader /></Col></Row>}

        {!loading &&
            <div className="bitcoin-paying-screen animated fadeIn mt-5 ">
                <QRCodeModal openModal={openQRModal} value={invoice.crypto_uri || ''} closeModal={this.closeQrCodeModal}/>

                {+invoice.status === 4 &&
                  <SweetAlert info showConfirm={false} onCancel={this.hideAlert} title="We haven't received full amount" show={showAlert}>
                    Transaction has been received but it’s not enough. We only received {invoice.crypto_received} of {invoice.crypto_amount}, please send the remaining amount in order to fulfill the invoice
                  </SweetAlert>
                }

                {info && <Row>
                  <Col lg={12} className={"mb-5 text-center"}><h1>{invoice.username}</h1></Col>
                </Row>}

                <Row className="justify-content-center">

                  {info && <Col lg={7}>
                    <Card className={"p-4"}>
                      <h3 className={"pb-2 pt-2 m-0"}>{info.product.title}</h3>
                      <span className={"pb-4"}>{info.delivery_text}</span>
                      <pre style={{ fontSize: ".8rem", lineHeight: ".7rem", maxHeight: "4rem"}} className={"mb-4 m-0"}>
                        {invoice.product_type === "file"}
                        {invoice.product_type === "serials" && info.serials.map(v => <span><strong>{v.split(':')[0]}:</strong>&nbsp;&nbsp;<span>{v.split(':')[1]}</span><br/><br/></span> )}
                        {invoice.product_type === "service" && <span dangerouslySetInnerHTML={{ __html: info.service_text }}/>}
                      </pre>
                      <div className={"d-flex"}>
                        {invoice.product_type !== "file" && <Button color={"primary"} style={{ width: "200px"}} className={"mr-4"}><i className={"fas fa-copy"}/> Copy to clipboard</Button>}
                        <Button color={"default"} style={{ width: "150px"}} onClick={this.onSaveFile}><i className={"fas fa-save"}/> Save as ...</Button>
                      </div>
                    </Card>
                    </Col>}

                  {/*<Col lg={{ size: 4, offset: 4 }} >*/}
                  <Col lg={{ size: 5 }} >
                    <Card className="invoice-card p-0 bg-white pt-3">
                      <div className="float-logo">
                        <img src={sellix_logo} width="153" alt={""}/>
                      </div>

                      {!info && <div className="text-right pr-3">
                        <img src={backIcon} width="15" height="15" onClick={() => {clearInterval(this.apiTimer); this.props.history.goBack()}} style={{ cursor: "pointer" }} alt={""}/>
                      </div>}

                      <div className={info ? "top px-4 pb-4 pt-0" : "top p-4 pt-4"}>

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
                          (invoice.gateway === 'paypal' && +invoice.status === 0) &&
                            <div className="mt-5">
                              <PayPalButton
                                  createOrder={() => invoice.paypal_tx_id}
                                  onApprove={this.getPayPalInvoice()}
                                  onError = {() => {}}
                                  style={{ layout: 'horizontal', color: 'blue', }}
                                  amount={invoice.total}
                                  currency={invoice.currency}
                                  options={{ clientId: invoice.paypal_client_id, currency: invoice.currency }}
                              />
                            </div>
                        }

                        {(invoice.gateway === 'perfectmoney' && +invoice.status === 0) &&
                          <PerfectMoney {...invoice}/>
                        }

                        {
                          (invoice.gateway === 'skrill' && +invoice.status === 0) &&
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
                        {(+invoice.status === 1 || fakeSuccess) &&
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

                        {+invoice.status === 2 && !fakeSuccess &&
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

                        { +invoice.status !== 1 && +invoice.status !== 2 && !fakeSuccess &&
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

                    {info && <Card><LeaveFeedback uniqid={info.feedback_uniqid} /></Card>}
                  </Col>

                </Row>

            </div>
          }
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  getPayPalInvoice: bindActionCreators(CommonActions.getPayPalInvoice, dispatch),
  getInvoice: bindActionCreators(CommonActions.getInvoice, dispatch),
  getInvoiceViaWebsocket: bindActionCreators(CommonActions.getInvoiceViaWebsocket, dispatch),
  getInvoiceInfo: bindActionCreators(getInvoiceInfo, dispatch),
  downloadInvoice: bindActionCreators(downloadInvoice, dispatch),
})

export default connect(null, mapDispatchToProps)(Invoice)
