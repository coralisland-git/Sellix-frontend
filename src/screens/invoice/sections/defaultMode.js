import React, { useState } from "react";
import config from "../../../constants/config";
import PerfectMoney from "./perfectMoney";
import skrillLinkIcon from "../../../assets/images/skrill_link.svg";
import StripeForm from "./stripe/stripeForm";
import { PayPalButton } from "react-paypal-button-v2";


const DefaultMode = ({ invoice, info, theme, setInvoiceStatus, qrCode, getPayPalInvoice, setFakePayPalSuccess, fakePayPalSuccess }) => {

  const [ openQRModal, setQRModal ] = useState(false)

  const getCryptoAmount = ({ gateway, crypto_amount }) => {
    if(gateway === 'paypal' || gateway === 'perfectmoney' || gateway === 'skrill' || gateway === 'stripe') {
      return null
    } else {
      return <span className="text-grey d-flex align-items-center">
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

    if(+status < 1 || +status > 3)
      return(
          <div>
            <p className="text-grey bold mt-4 text-center">
              Please send exactly <span className="badge text-primary bold">{((crypto_amount || 0) - (crypto_received || 0)).toFixed(8)}</span> {config.PAYMENT_OPTS[gateway]} to
            </p>
            <p className="btc-address text-grey bold text-center" style={{height: openQRModal ? '310px' : '40px', transition: 'height 0.3s ease-out', overflow: 'hidden'}}>
            <span style={{opacity: openQRModal ? 0 : 1, transition: 'opacity 0.3s ease-out',}}>{crypto_address || ''}</span>
              <div className="qr-container" style={{height: openQRModal ? 'auto' : 0, opacity: openQRModal ? 1 : 0, transition: 'opacity 0.3s ease-out', paddingLeft: '25px', marginTop: openQRModal ? '-50px' : '-40px'}}>
                {qrCode({ onClick: () => {}, qrBgColor: theme === 'dark' ? '#edf0fe' : null, borderRadius: '5px', openQRModal})}
              </div>
            </p>
            <div className="d-flex justify-content-between align-items-center ">
              <span className="text-grey cursor-pointer" onClick={() => setQRModal(!openQRModal)}>QR Code</span>
              <span className="text-grey">Pay in Wallet</span>
            </div>
          </div>
      )
  }


  return <div className={info ? "d-none top px-4 pb-4 mt-2" : "top p-4 pt-4 mt-2"}>

    <div className="d-flex justify-content-between align-items-center ">
      <h4 className="text-grey">{(invoice.gateway || '').toUpperCase()}</h4>
      <span className="badge text-primary bold status invoice-timer m-0" id="status">{setInvoiceStatus(invoice.status, true)}</span>
    </div>

    <p className="text-grey mb-3">{invoice.uniqid}</p>

    <div className="d-flex justify-content-between align-items-center ">
      <h4 className="text-grey">{(invoice.product || {}).title}</h4>
      {getCryptoAmount({...invoice})}
    </div>

    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="text-grey">{invoice.product_id || ''}</span>
      <span className="text-grey">{config.CURRENCY_LIST[invoice.currency] || '$'}{invoice.total_display || 0}</span>
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
