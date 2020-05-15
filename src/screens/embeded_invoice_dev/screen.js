import React from 'react'
import { connect } from 'react-redux'
import { api } from 'utils'
import { bindActionCreators } from 'redux'
import { Card, Row, Col } from 'reactstrap'
import * as moment from 'moment/moment'
import { QRCodeModal } from 'components'
import { PayPalButton } from "react-paypal-button-v2";
import { CommonActions } from 'services/global'
import { getInvoiceInfo, downloadInvoice } from './actions'
import { Loader, Button } from 'components'
import StripeForm from './stripeForm'
import LeaveFeedback from '../feedbacks_shop/screens/createComponent/screen'
import ProductScreen from '../product_shop/screens/detail/screen'
import config from 'constants/config'
import FileSaver from 'file-saver';
import ReactTooltip from 'react-tooltip'

import sellix_logo from 'assets/images/Sellix_logo.svg'
import perfectmoneyIcon from 'assets/images/crypto/perfectmoney.svg'
import skrillLinkIcon from 'assets/images/skrill_link.svg'
import infoIcon from 'assets/images/info.svg'
import infoIconRed from 'assets/images/infoRed.svg'
import copyIcon from 'assets/images/copy.svg'
import qrCornerImg from 'assets/images/qr-corner.png'
import dummyQrCode from 'assets/images/dummy-qr-code.png'
import checkMarkIcon from 'assets/images/green_checkmark.svg'
import { QRCode } from 'react-qrcode-logo';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'react-circular-progressbar/dist/styles.css';

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

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const RenderProduct = ({ product_type, info, onSaveFile, copyToClipboard }) => {

  if(product_type === "file" && info.file_attachment) {
    return <div>
        <pre className={"mb-4 m-0"}>
          <span>File Name: {info.file_attachment.original_name}</span><br/>
          <span>Size: {formatBytes(info.file_attachment.size)}</span>
        </pre>
        <Button color={"default"} style={{ width: "150px"}} onClick={onSaveFile}><i className={"fas fa-save"}/>&nbsp;&nbsp;Download File</Button>
    </div>
  }

  if(product_type === "serials" && info.serials.length) {
    return <div>
        <pre className={"mb-4 m-0"}>
          {info.serials.map((v, key) => <span key={key} style={{ fontSize: "12px", lineHeight: 1}}>{v}<br/></span>)}
        </pre>

        <div className={"d-flex"}>
          <Button color={"primary"} style={{ width: "200px"}} className={"mr-4"} onClick={copyToClipboard}><i className={"fas fa-copy"}/> Copy to clipboard</Button>
          <Button color={"default"} style={{ width: "150px"}} onClick={onSaveFile}><i className={"fas fa-save"}/>&nbsp;&nbsp;Save as File</Button>
        </div>
    </div>
  }

  if(product_type === "service" && info.service_text) {
    return <div>
        <pre className={"mb-4 m-0"}>
          <span dangerouslySetInnerHTML={{ __html: info.service_text }}/>
        </pre>

        <div className={"d-flex"}>
          <Button color={"primary"} style={{ width: "200px"}} className={"mr-4"} onClick={copyToClipboard}><i className={"fas fa-copy"}/> Copy to clipboard</Button>
          <Button color={"default"} style={{ width: "150px"}} onClick={onSaveFile}><i className={"fas fa-save"}/>&nbsp;&nbsp;Save as File</Button>
        </div>
    </div>
  }

  return null
}


class EmbededInvoiceDev extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      invoice: {},
      timer: '60:00',
      time: { h:0, m:0, s:0 },
      seconds: 24*60*60,
      showAlert: true,
      openQRModal: false,
      openFeedbackModal: false,
      fakeSuccess: false,
      paymentInfoSlideUpPanel: false,

      copyIconTooltipShown: false,

      qrCellSize: null
    }

    this.timer = 0;
    this.apiTimer = 1;
  }

  openQrCodeModal = () => {
    this.setState({openQRModal: true})
  }

  closeQrCodeModal = () => {
    this.setState({openQRModal: false})
  }

  setTheme = ({ theme }) => {
    document.body.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.add(theme);

    document.documentElement.classList.remove('light')
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add(theme);
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
    const { getInvoiceViaWebsocket } = this.props;

    const id = this.getInvoiceId()

    getInvoiceViaWebsocket(id)
        .then(invoice => {
          this.setState({
            invoice: {
              ...invoice,
              crypto_mode: this.state.invoice.crypto_mode
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

  getInvoiceId = () => {
    const { id } = this.props.embed ? this.props : this.props.match.params;

    return id
  }

  componentDidMount() {
    this.setState({ loading:true });
    const { getInvoice, getInvoiceInfo, match } = this.props;
    const id = this.getInvoiceId()

    document.title = `Invoice ${id} | Sellix`;

    if(localStorage.getItem('invoice-' + id)) {
      this.setState({
        invoice: JSON.parse(localStorage.getItem('invoice-' + id))
      })
      localStorage.removeItem('invoice-' + id)
    }

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

    setTimeout(() => {
      if(!this.state.copyIconTooltipShown) {
        // ReactTooltip.show(this.copyIconRef)
      }
    }, 5000)
  }

  setInvoiceStatus = (status, showHhMmSs) => {

    const { fakeSuccess, time } = this.state;

    if(+status === 0  && !fakeSuccess) {
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
    } else if(+status === 1 || fakeSuccess)
      return 'Paid'
    else if(+status === 2)
      return 'Cancelled'
    else if(+status === 3)
     return 'Pending'
    else if(+status === 4)
     return 'Partial'
  }

  getInvoiceTimePercentage = () => {
    const { seconds } = this.state;
    return seconds / (24 * 60 * 60) * 100
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

  getAmountToSend = ()  => {
    const { crypto_amount, crypto_received } = this.state.invoice
    return ((crypto_amount || 0) - (crypto_received || 0)).toFixed(8)
  }

  getPaymentForm = ({ gateway, status, crypto_amount, crypto_received, crypto_address }) => {

    const { openQRModal } = this.state
    const { theme } = this.props

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
                {this.getAmountToSend()}</span> {config.PAYMENT_OPTS[gateway]} to
          </p>
          <p className="btc-address text-grey bold text-center" style={{
            height: openQRModal ? '310px' : '40px',
            transition: 'height 0.3s ease-out',
            overflow: 'hidden'
          }}>
            <span style={{
              opacity: openQRModal ? 0 : 1,
              transition: 'opacity 0.3s ease-out',
            }}>{crypto_address || ''}</span>
            <div className="qr-container" style={{
              height: openQRModal ? '300px' : 0,
              opacity: openQRModal ? 1 : 0,
              transition: 'opacity 0.3s ease-out',
              paddingLeft: '25px',
              marginTop: '-40px'
            }}>
              {this.qrCode({
                onClick: () => {},
                qrBgColor: theme === 'dark' ? '#edf0fe' : null,
                borderRadius: '5px'
              })}
            </div>
          </p>
          <div className="d-flex justify-content-between align-items-center ">
            <span className="text-grey cursor-pointer" onClick={openQRModal ? this.closeQrCodeModal : this.openQrCodeModal}>QR Code</span>
            <span className="text-grey">Pay in Wallet</span>
          </div>
        </div>
      )
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

  copyToClipboard = () => {
    let { invoice, info } = this.state;

    let el = document.createElement('textarea');
        el.value = invoice.product_type === "serials" ? info.serials : invoice.product_type === "service" ? info.service_text : "";
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.props.tostifyAlert('success', "Copied to Clipboard.")
  }

  copyAddressToClipboardOnCopied = () => {
    if(!this.state.paymentLinkSlideDownPanelShowCopy) {
      this.setState({paymentLinkSlideDownPanelShowCopy: true})
      setTimeout(() => {
        this.setState({paymentLinkSlideDownPanelShowCopy: false})
      }, 1500)
    }
  }

  paymentLinkSlideDownPanel = () => {
    const { invoice, paymentLinkSlideDownPanelOpen, paymentLinkSlideDownPanelShowCopy, forceShowTooltip } = this.state

    const { theme } = this.props

    if(paymentLinkSlideDownPanelOpen && (forceShowTooltip === true || forceShowTooltip === null)) {
      this.setState({
        forceShowTooltip: false
      })
    }

    return <>
      <div className={"payment-link-slide-down-panel " + (paymentLinkSlideDownPanelOpen && "open ") + (paymentLinkSlideDownPanelShowCopy && "show-copy")} style={{
        background: theme === 'light' ? 'white' : '#edf0fe'
      }}>
        <h5>{config.PAYMENT_OPTS_FULL_NAME[invoice.gateway]} Address</h5>
        <CopyToClipboard text={invoice.crypto_address}
          onCopy={() => this.copyAddressToClipboardOnCopied()}>
          <div>
            <span>{invoice.crypto_address}</span>
            <img src={copyIcon} height="20"/>
            <div className="copy-mode">
              <img src={checkMarkIcon} height="20"/>
              <span>Copied</span>
            </div>
          </div>
        </CopyToClipboard>
      </div>
      <div className="bg-overlay" onClick={() => {
        this.setState({
          paymentLinkSlideDownPanelOpen: false
        })
      }}/>
    </>
  }

  paymentInfoSlideUpPanel = () => {

    const { invoice, paymentInfoSlideUpPanelOpen } = this.state

    const { theme } = this.props

    return <>
      <div className={"payment-info-slide-up-panel " + (paymentInfoSlideUpPanelOpen && "open")} style={{
        background: theme === 'light' ? 'white' : '#edf0fe'
      }}>
        <h6>Please send your payment within <b>{this.setInvoiceStatus(invoice.status)}</b></h6>
        <div>
          <div>
            <span>Total Price:</span>
            <span>{invoice.total_display} {invoice.currency}</span>
          </div>
          <div>
            <span>Exchange Rate:</span>
            <span>{invoice.crypto_exchange_rate} USD</span>
          </div>
          <div>
            <span>Subtotal:</span>
            <span>{invoice.crypto_amount} {config.PAYMENT_OPTS[invoice.gateway]}</span>
          </div>
          {/* <div>
            <span>Network Cost:</span>
            <span>0.09 USD</span>
          </div> */}
          <div>
            <span>Amount:</span>
            <span><b>{invoice.crypto_amount - invoice.crypto_received}</b> {config.PAYMENT_OPTS[invoice.gateway]}</span>
          </div>
        </div>
      </div>
      <div className="bg-overlay" onClick={() => {
        this.setState({
          paymentInfoSlideUpPanelOpen: false
        })
      }}/>
    </>
  }

  progressShouldBeRed = () => {
    const { seconds } = this.state;

    return seconds && seconds < 60 * 60
  }

  qrCode = ({ onClick, qrBgColor, borderRadius }) => {

    const { invoice, qrCellSize } = this.state
    const { theme } = this.props

    return <div onClick={onClick} className="qr-wrapper"  style={borderRadius ? {
      borderRadius,
      overflow: 'hidden'
    } : {}}>
      <QRCode bgColor={qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')} value={invoice.crypto_uri} size="270" ecLevel={invoice.gateway == 'bitcoincash' ? "H" : "Q"} qrStyle="dots" 
      // logoImage={config.PAYMENT_ICONS[invoice.gateway]}
        onQrDraw={({cellSize}) => {
          if(cellSize != this.state.qrCellSize)  {
            this.setState({
              qrCellSize: cellSize
            })
          }
        }}
      />
      <img src={config.PAYMENT_ICONS[invoice.gateway]} width={qrCellSize * 11} style={{
        background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe'),
        left: `calc(50% - ${qrCellSize * 5.5}px)`,
        position: 'absolute',
        padding: qrCellSize + 'px'
      }}/>
      <img className="qr-corner top left" src={qrCornerImg}  width={qrCellSize * 8} style={{
        left: qrCellSize + 'px',
        top: qrCellSize + 'px',
        background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')
      }}/>
      <img className="qr-corner top right" src={qrCornerImg} width={qrCellSize * 8} style={{
        right: qrCellSize + 'px',
        top: qrCellSize + 'px',
        background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')
      }}/>
      <img className="qr-corner bottom left" src={qrCornerImg} width={qrCellSize * 8} style={{
        left: qrCellSize + 'px',
        bottom: qrCellSize + 'px',
        background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')
      }}/>
    </div>
  }

  render() {    

    var { loading, invoice, showAlert, openQRModal, fakeSuccess, info, seconds, qrCellSize } = this.state;

    const { theme } = this.props

    const progressShouldBeRed = this.progressShouldBeRed()

    const isCrypto = invoice.crypto_uri != null

    const isQrMode = isCrypto && invoice.crypto_mode === 'qrcode'

    const innerComponent = isQrMode ? <>
      {(invoice.status == 0 || invoice.status == 4) && <>
        <p style={{
          margin: '0 40px',
          textAlign: 'center',
          lineHeight: '1.5',
          marginTop: '30px'
        }}>Scan the QR code or copy and paste the payment details into your wallet</p>

        <div style={{
          background: theme === 'light' ? '#f0f3f599' : '#edf0fe',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          margin: '30px 15px 0px 15px',
          position: 'relative'
        }} className={"qr-container " + (progressShouldBeRed && "progress-red")}>
          <div>
            <ReactTooltip place="top" backgroundColor="#4F6EF7" effect="solid" className="copy-tooltip" afterShow={() => {
              this.setState({
                copyIconTooltipShown: true
              })
            }}/>
            <CopyToClipboard text={invoice.crypto_address}
                              onCopy={() => {
                              setTimeout(() => {
                                this.copyAddressToClipboardOnCopied()
                                }, 300)
                              }}>
              <img src={copyIcon} height="30" data-tip={"Copy " + config.PAYMENT_OPTS_FULL_NAME[invoice.gateway] + " Address"} data-place="top" onClick={() => {
                this.setState({
                  paymentLinkSlideDownPanelOpen: true
                })
              }} style={{
                cursor: 'pointer',
                height: '25px'
              }} ref={ref => this.copyIconRef = ref}/>
            </CopyToClipboard>
            <h3>{this.getAmountToSend()} {config.PAYMENT_OPTS[invoice.gateway]}</h3>
            <div style={{position: 'relative'}}>
              <img src={progressShouldBeRed ? infoIconRed : infoIcon} style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 9,
                  display: 'block'
                }} className="progress-overlay" onClick={() => {
                  this.setState({
                    paymentInfoSlideUpPanelOpen: true
                  })
                }}/>
              <CircularProgressbar value={this.getInvoiceTimePercentage()} text={
                    this.setInvoiceStatus(invoice.status)
                  } counterClockwise={true}
                  strokeWidth={10}
                  className={progressShouldBeRed && "red"}
                  styles={buildStyles({

                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',

                    // Text size
                    textSize: '24px',

                    // Colors
                    pathColor: progressShouldBeRed ? '#ef476f' : `#4F6EF7`,
                    textColor: progressShouldBeRed ? '#ef476f' : `#4F6EF7`,
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
            </div>
          </div>
          {/* <img width="270" src={dummyQrCode}/> */}
          <CopyToClipboard text={invoice.crypto_address}
                              onCopy={() => {
                                setTimeout(() => {
                                this.copyAddressToClipboardOnCopied()
                                }, 300)
                              }}>
            {this.qrCode({
              onClick: () => {
                this.setState({
                  paymentLinkSlideDownPanelOpen: true
                })
              }
            })}
          </CopyToClipboard>
          {this.paymentLinkSlideDownPanel()}
          {this.paymentInfoSlideUpPanel()}
        </div>
      </>
      }
      {invoice.status == 3 && <>
          <Loader/>
          <h4 style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>Awaiting Confirmation <br/>({((invoice.crypto_transactions || []).slice(-1)[0] || {}).confirmations }/{invoice.crypto_confirmations || 0})</h4>
        </>
      }
    </> : <>
    <div className={info ? "top px-4 pb-4 pt-0" : "top p-4 pt-4"}>

      <div className="d-flex justify-content-between align-items-center ">
        <h4 className="text-grey">{(invoice.gateway || '').toUpperCase()}</h4>
        <span className="badge text-primary bold status invoice-timer m-0" id="status">{this.setInvoiceStatus(invoice.status, true)}</span>
      </div>

      <p className="text-grey mb-3">{invoice.uniqid}</p>

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
                onApprove={() => this.getPayPalInvoice()}
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
    </>

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
                {+invoice.status === 4 && showAlert &&
                    <>
                      <div className={"sw-container fixed"} onClick={this.hideAlert}>
                        <div className="sw">

                          <div className={"sw-icon-info"}>
                            <div className={"elem-1"} />
                            <div className={"elem-2"} />
                          </div>

                          <h2 className="sw-title">We haven't received full amount</h2>
                          <div className="sw-text text-muted lead">
                            Transaction has been received but it’s not enough. We only received {invoice.crypto_received} of {invoice.crypto_amount}, please send the remaining amount in order to fulfill the invoice
                          </div>
                        </div>
                      </div>
                  </>
                }
                <div className="bitcoin-paying-screen animated fadeIn">
                  <div className="invoice-card ml-auto mr-auto p-0 embed-block">
                      <Card className="bg-white p-0 detail mb-0">
                        <i className="fa fa-times close-popup"></i>
                        {innerComponent}

                        <div className={"bottom order-detail-info p-4 " + ((isQrMode || invoice.status == 1 || invoice.status == 2) && "no-padding")}>
                          {(+invoice.status === 1 || fakeSuccess) &&
                              <>
                                <div className={"sw-container"}>
                                  <div className="sw">

                                    <div className={"sw-icon-success"}>
                                      <div className={"elem-1"} />
                                      <span className={"elem-2"} />
                                      <span className={"elem-3"} />
                                      <div className={"elem-4"} />
                                      <div className={"elem-5"} />
                                      <div className={"elem-6"} />
                                    </div>

                                    <h2 className="sw-title">Order completed!</h2>
                                    <div className="sw-text text-muted lead">
                                      Your invoice has been paid. <br/>You will receive the products within minutes, <br/>check your email!
                                    </div>
                                  </div>
                                </div>
                            </>
                          }

                          {+invoice.status === 2 && !fakeSuccess &&
                              <>
                                <div className={"sw-container"}>
                                  <div className="sw">

                                    <div className={"sw-icon-cancel"}>
                                          <span className="elem-1">
                                            <span className="elem-2" />
                                            <span className="elem-3" />
                                          </span>
                                    </div>

                                    <h2 className="sw-title">Invoice Cancelled</h2>
                                    <div className="sw-text text-muted lead">
                                      The invoice has expired or isn't available.
                                    </div>
                                  </div>
                                </div>
                              </>
                          }

                          { +invoice.status !== 1 && +invoice.status !== 2 && !fakeSuccess && !isQrMode &&
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


const mapStateToProps = (state) => {
  return ({
    theme: state.common.theme
  })
}

const mapDispatchToProps = (dispatch) => ({
  getPayPalInvoice: bindActionCreators(CommonActions.getPayPalInvoice, dispatch),
  getInvoice: bindActionCreators(CommonActions.getInvoice, dispatch),
  getInvoiceViaWebsocket: bindActionCreators(CommonActions.getInvoiceViaWebsocket, dispatch),
  getInvoiceInfo: bindActionCreators(getInvoiceInfo, dispatch),
  downloadInvoice: bindActionCreators(downloadInvoice, dispatch),
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(EmbededInvoiceDev)
