import React, { useState } from "react";
import config from "../../../constants/config";
import PerfectMoney from "./perfectMoney";
import skrillLinkIcon from "../../../assets/images/skrill_link.svg";
import StripeForm from "./stripe/stripeForm";
import { PayPalButton } from "react-paypal-button-v2";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from 'assets/images/invoice/clipboard.svg'

const DefaultMode = ({ invoice, info, theme, setInvoiceStatus, qrCode, getPayPalInvoice, setFakePayPalSuccess, fakePayPalSuccess, tostifyAlert }) => {

  const [ openQRModal, setQRModal ] = useState(false)

  const getCryptoAmount = ({ gateway, crypto_amount }) => {
    if(gateway === 'paypal' || gateway === 'perfectmoney' || gateway === 'skrill' || gateway === 'stripe') {
      return null
    } else {
      return <span className="text-grey d-flex align-items-center caption-color">
          <img src={config.PAYMENT_ICONS[gateway]} className="mr-1" width="15" height="15" alt={""}/>{crypto_amount || 0}
        </span>
    }
  }

  const getPaymentForm = ({ gateway, status, crypto_address, crypto_amount, crypto_received }) => {

    if(gateway === 'paypal' || gateway === 'skrill' || gateway === 'perfectmoney') {
      return ''
    }

    if(gateway === 'stripe') {

      if(+status === 1 || fakePayPalSuccess) {
        return ""
      }
      return <StripeForm invoice={invoice} onSuccess={setFakePayPalSuccess}/>
    }

    const copyToClipboard = () => {
      tostifyAlert('success', "Copied to Clipboard.")
    }

    if(+status < 1 || +status > 3)
      return(
          <div>
            <hr className="invoice-divider"/>
            <p className="text-grey bold mt-4 text-center f-18 text-bold caption-color">
              Send exactly <span className="badge text-bold text-primary f-18">{((crypto_amount || 0) - (crypto_received || 0)).toFixed(8)} {config.PAYMENT_OPTS[gateway]}</span> to
            </p>
            <div className="btc-address text-grey bold text-center f-18 mb-3" style={{height: openQRModal ? '335px' : '50px', transition: 'height 0.3s ease-out', overflow: 'hidden'}}>
              <CopyToClipboard text={crypto_address || ''} onCopy={() => copyToClipboard()}>
                <span className="f-16 mb-1 value-color clipboard-text" style={{fontWeight: 400, opacity: openQRModal ? 0 : 1, transition: 'opacity 0.3s ease-out', cursor: "pointer" }}><span className="value-color f-16">{crypto_address || ''}</span> <img src={copyIcon}/></span>
                
              </CopyToClipboard>
              <div className="qr-container" style={{height: openQRModal ? 'auto' : 0, opacity: openQRModal ? 1 : 0, transition: 'opacity 0.3s ease-out', padding: openQRModal ? "10px" : 0, marginTop: openQRModal ? '-50px' : '-40px'}}>
                {qrCode({ onClick: () => {}, qrBgColor: theme === 'dark' ? '#edf0fe' : null, borderRadius: '5px', openQRModal})}
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center ">
              <span className="text-grey cursor-pointer caption-color" onClick={() => setQRModal(!openQRModal)}><i className="fas fa-qrcode"/> QR Code</span>
              <span className="text-grey caption-color">Pay in Wallet</span>
            </div>
          </div>
      )
  }


  return <div className={info ? "d-none top px-4 pb-4" : "top p-4 pt-4"}>

    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 className="text-grey value-color">{(invoice.gateway || '').toUpperCase()}</h4>
        <p className="text-grey mb-0 caption-color">{invoice.uniqid}</p>
      </div>
      <span className="badge-grey text-primary bold status invoice-timer m-0" id="status">{setInvoiceStatus(invoice.status, true)}</span>
    </div>

    <div className="d-flex justify-content-between align-items-center ">
      <h4 className="text-grey value-color">{ invoice.product_id? (invoice.product || {}).title : invoice.developer_title }</h4>
      {getCryptoAmount({...invoice})}
    </div>

    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="text-grey caption-color">{invoice.product_id || ''}</span>
      <span className="text-grey caption-color">{config.CURRENCY_LIST[invoice.currency] || '$'}{invoice.total_display || 0}</span>
    </div>

    {getPaymentForm({...invoice})}

    {(invoice.gateway === 'paypal' && +invoice.status === 0) && <div className="mt-5">
      <PayPalButton
          createOrder={() => invoice.paypal_tx_id}
          onApprove={getPayPalInvoice}
          onError = {() => {}}
          style={{ layout: 'horizontal', color: 'blue', }}
          amount={invoice.total}
          currency={invoice.currency}
          options={{ clientId: invoice.paypal_client_id, currency: invoice.currency }}
      />
    </div>}

    {(invoice.gateway === 'perfectmoney' && +invoice.status === 0) && <PerfectMoney {...invoice}/>}

    {(invoice.gateway === 'skrill' && +invoice.status === 0) && <div className="mt-5">
      <div className="d-flex input-group">
        <a target="_blacnk" href={invoice.skrill_link} className="w-100 p-0 text-center skrill-button">
          <img src={skrillLinkIcon} height="45" alt={""}/>
        </a>
      </div>
    </div>}

  </div>
}

export default DefaultMode;
