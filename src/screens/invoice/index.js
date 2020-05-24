import React from 'react'
import { connect } from 'react-redux'
import { api } from 'utils'
import { bindActionCreators } from 'redux'
import { Card, Row, Col } from 'components/reactstrap'
import { CommonActions } from 'services/global'
import { getInvoiceInfo, downloadInvoice } from './actions'
import { Loader } from 'components'
import LeaveFeedback from '../feedbacks_shop/screens/createComponent'
import config, { converter } from 'constants/config'
import FileSaver from 'file-saver';
import QRMode from './sections/qrMode'
import DefaultMode from './sections/defaultMode'
import RenderProduct from './sections/renderProduct'
import RenderQRCode from './sections/renderQRCode'
import OrderDetail from './sections/renderOrderDetail'
import { AlertSuccess, AlertCanceled, AlertPartial } from './sections/alerts'


import 'react-circular-progressbar/dist/styles.css';

import './style.scss'



class Invoice extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      invoice: {},
      timer: '60:00',
      time: { h:0, m:0, s:0 },
      seconds: 24*60*60,
      showAlert: true,
      fakePayPalSuccess: false,
      qrCellSize: null
    }

    this.timer = 0;
    this.apiTimer = 1;
  }

  setFakePayPalSuccess = () => {
    this.setState({
      fakePayPalSuccess: true
    })
  }

  setTheme = ({ theme }) => {
    console.log(theme)
    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(theme);
  }

  getPayPalInvoice = () => {

    const id = this.getInvoiceId()

    return this.props.getPayPalInvoice(this.state.invoice.uniqid)
        .then(res => {
          if(res && res.data && res.data.invoice) {
            this.setState({ invoice: res.data.invoice });
            this.setTheme(res.data.invoice)
            if(+res.data.invoice.status === 1) {
              return this.props.getInvoiceInfo(id)
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
    const { getInvoice } = this.props;

    const id = this.getInvoiceId()

    getInvoice(id)
        .then(({ data: { invoice } }) => {
          this.setState({
            invoice: {
              ...invoice,
              crypto_mode: this.state.invoice.crypto_mode,
              developer_title: this.state.invoice.developer_title,
              developer_return_url: this.state.invoice.developer_return_url,
            }
          })
          this.setTheme(invoice)
          if(+invoice.status === 1) {
            return this.props.getInvoiceInfo(id)
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
    if (this.timer === 0 && this.state.seconds > 0) {
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

  getInvoiceId = () => {
    const { id } = this.props.embed ? this.props : this.props.match.params;

    return id
  }

  onQrDraw = ({ cellSize }) => {
    if(cellSize !== this.state.qrCellSize) {
      this.setState({ qrCellSize: cellSize })
    }
  }

  componentDidMount() {

    const { getInvoice, getInvoiceInfo, match, location } = this.props;
    const id = this.getInvoiceId();

    document.title = `Invoice ${id} | Sellix`;

    let invoice = location.state ? location.state.invoice : null;

    if(invoice) {
      let seconds = 24 * 60 * 60 - (new Date().getTime() - new Date(invoice.created_at * 1000).getTime()) / 1000
      let time = this.secondsToTime(seconds);
      this.setState({ seconds, invoice, time })
      this.setTheme(invoice);
    } else {
      this.setState({ loading: true });
      getInvoice(id)
          .then(({ data: { invoice }}) => {
            let seconds = 24 * 60 * 60 - (new Date().getTime() - new Date(invoice.created_at * 1000).getTime()) / 1000
            let time = this.secondsToTime(seconds);
            this.setState({ seconds, invoice, time })
            this.setTheme(invoice);
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
  }

  setInvoiceStatus = (status, showHhMmSs) => {

    const { fakePayPalSuccess, time } = this.state;

    if(+status === 0  && !fakePayPalSuccess) {
      this.startTimer();

      if(showHhMmSs) {
        const { h, m, s } = time
        return `${(h > 9 ? h : '0' + h) || '00'}:${m > 9 ? m : '0' + m || '00'}:${s > 9 ? s : '0' + s || '00'}`;
      }

      if(time.h > 0) {
        const { h, m } = time
        return `${(h > 9 ? h : '0' + h) || '00'}:${m > 9 ? m : '0' + m || '00'}`;
      } else {
        const m = time.h * 60 + time.m
        return `${(m > 9 ? m : '0' + m) || '00'}:${time.s > 9 ? time.s : '0' + time.s || '00'}`;
      }
    } else if(+status === 1 || fakePayPalSuccess)
      return 'Paid'
    else if(+status === 2)
      return 'Cancelled'
    else if(+status === 3)
      return 'Pending'
    else if(+status === 4)
      return 'Partial'
  }

  getInvoiceStatus = (status) => {

    const { invoice } = this.state;

    if(+status === 0){
      this.startTimer()
      return <div className="d-flex align-items-center"><div className="sk-spinner sk-spinner-pulse" />Awaiting for payment</div>
    } else if(+status === 1 || +status === 2) {
      if (this.props.location.pathname.indexOf("/payment") > -1){
        if (invoice.developer_return_url)
          window.location = invoice.developer_return_url
      }
      return null
    } else if(+status === 3) {
      return <div className="d-flex align-items-center"><div className="sk-spinner sk-spinner-pulse" />Waiting for Confirmation ({((invoice.crypto_transactions || []).slice(-1)[0] || {}).confirmations }/{invoice.crypto_confirmations || 0})</div>
    } else if(+status === 4) {
      return <div className="d-flex align-items-center"><div className="sk-spinner sk-spinner-pulse" />Partial Payment</div>
    } else {
      return null
    }
  }


  onSaveFile = () => {
    let id = this.getInvoiceId()

    let secret = localStorage.getItem(id);
    if(secret) {
      let url = `${config.API_ROOT_URL}/invoices/download/${id}/${secret}`;

      api.get(url, { responseType: 'blob' })
          .then(response => {
            FileSaver.saveAs(response);
          })
    }
  }

  qrCode = (props) => <RenderQRCode {...props} {...this.state} {...this.props} onQrDrow={this.onQrDraw} />

  render() {

    let { loading, invoice, showAlert, fakePayPalSuccess, info } = this.state;
    let { theme } = this.props;

    console.log(invoice)

    // invoice.status = 4

    const isQrMode = invoice.crypto_uri != null && invoice.crypto_mode === 'qrcode';

    const innerComponent = isQrMode ?
        <QRMode qrCode={this.qrCode} setInvoiceStatus={this.setInvoiceStatus} {...this.state} theme={theme} /> :
        <DefaultMode tostifyAlert={this.props.tostifyAlert} qrCode={this.qrCode} setInvoiceStatus={this.setInvoiceStatus} setFakePayPalSuccess={this.setFakePayPalSuccess} getPayPalInvoice={this.getPayPalInvoice} {...this.state} theme={theme} />

    return <div className={!info && isQrMode ? "d-flex h-100" : info ? "d-flex h-100" : "d-flex h-100 align-items-center"}>
        <div className={"w-100 mb-4"}>

          {!info && isQrMode ?
            <div className="detail-product-screen bitcoin-paying-screen" style={{marginTop: '25px'}}>
              <div className={""}>

                <div className="purchase-card ml-auto mr-auto">
                  <Row className="pr-3 pl-3 pt-0">
                    <Col lg={12} className="ml-auto mr-auto pb-4">
                      <Row>
                        {+invoice.status === 4 && showAlert && <AlertPartial hideAlert={this.hideAlert} invoice={invoice} />}

                        {invoice.product &&
                          <Col md={6} lg={7} xl={8}>
                            <Card className="bg-white p-4 detail">
                              <h4 className="text-primary mb-4">{invoice.product.title}</h4>
                              <div className="description" dangerouslySetInnerHTML={{__html: converter.makeHtml(invoice.product.description)}} />
                            </Card>
                          </Col>
                        }

                        <Col md={6} lg={5} xl={4} className="left-bar" id="affix-bar">
                          <div className="animated fadeIn">
                            <Card className="bg-white d-flex align-items-center justify-content-center mt-xs-4" style={loading ? { height: '490px' } : {}}>
                              {loading && <Loader/>}
  
                              {!loading && innerComponent}

                              <div className={"bottom order-detail-info mt-4 p-4 " + ((isQrMode || +invoice.status === 1 || +invoice.status === 2) && "no-padding")  + (invoice.status == 2 ? " w-100" : "")} style={{ borderRadius: "3px", overflow: "hidden" }}>

                                {(+invoice.status === 1 || fakePayPalSuccess) && <AlertSuccess />}

                                {(+invoice.status === 2 && !fakePayPalSuccess) && <AlertCanceled />}

                              </div>

                            </Card>
                          </div>

                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>

              </div>
            </div>
              :
              <div>
                {loading && <Row><Col lg={12}><Loader /></Col></Row>}

                {!loading &&
                <div className="bitcoin-paying-screen animated fadeIn">

                  {+invoice.status === 4 && showAlert && <AlertPartial hideAlert={this.hideAlert} invoice={invoice} />}

                  <Row className="justify-content-center">

                    {info &&
                      <>
                      <Col lg={12}>
                        <div className="text-left mb-5">
                          <h1 className={"m-0"} style={{ fontSize: "1.4rem" }}>
                            Your Order for <strong>{info.product.title}</strong> is completed.
                          </h1>
                        </div>
                      </Col>
                      <Col lg={8}>
                        <Card className={"p-4"} style={{ minHeight: "267px" }}>
                          <h4 style={{ fontWeight: 400 }}>{info.product.title}</h4>
                          <span className={"pb-4"} style={{ fontSize: 13, lineHeight: "1rem"}}>{info.delivery_text}</span>
                          <RenderProduct info={info} product_type={invoice.product_type} onSaveFile={this.onSaveFile} tostifyAlert={this.props.tostifyAlert} />
                        </Card>
                      </Col>
                    </>
                    }


                    <Col className="ml-3 mr-3">

                      <Card className={info ? "invoice-card p-0 bg-white mb-2 mt-0 pb-2" : "invoice-card p-0 bg-white mb-2 mt-sm-4 pb-2"}>
                        
                        <h3 className="text-center mb-3 product-title value-color mt-4">{invoice.product && invoice.product.title}</h3>
                        <p className="text-center mb-3 product-user caption-color">{invoice.username}</p>

                        {innerComponent}

                      </Card>
                      <Card className={"invoice-card p-0 bg-white mb-2"}>
                        <div className={"bottom order-detail-info p-4 " + ((isQrMode || +invoice.status === 1 || +invoice.status === 2) && "no-padding")  + (invoice.status == 2 ? " w-100" : "") } style={{ borderRadius: "3px", overflow: "hidden" }}>
                          {(+invoice.status === 1 || fakePayPalSuccess) && <AlertSuccess />}

                          {(+invoice.status === 2 && !fakePayPalSuccess) && <AlertCanceled />}

                          {(+invoice.status !== 1 && +invoice.status !== 2 && !fakePayPalSuccess && !isQrMode) && <OrderDetail invoice={invoice} status={this.getInvoiceStatus(invoice.status)}/>}
                          </div>
                      </Card>

                      {info && <Card className={"mb-5"}>
                        <LeaveFeedback uniqid={info.feedback_uniqid} />
                      </Card>}
                    </Col>

                  </Row>

                </div>
                }
              </div>
          }
        </div>
      <div/>
    </div>
  }
}

const mapStateToProps = (state) => ({
  theme: state.common.theme
})

const mapDispatchToProps = (dispatch) => ({
  getPayPalInvoice: bindActionCreators(CommonActions.getPayPalInvoice, dispatch),
  getInvoice: bindActionCreators(CommonActions.getInvoice, dispatch),
  getInvoiceInfo: bindActionCreators(getInvoiceInfo, dispatch),
  downloadInvoice: bindActionCreators(downloadInvoice, dispatch),
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invoice)
