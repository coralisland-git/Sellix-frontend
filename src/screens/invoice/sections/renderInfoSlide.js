import React from "react";
import config from "constants/config";


const RenderInfoSlider = ({ infoPanel, theme, invoice, setInvoiceStatus, close }) => {

  return <>
    <div className={"payment-info-slide-up-panel " + (infoPanel && "open")} style={{ background: theme === 'light' ? 'white' : '#edf0fe' }}>
      <h6>Please send your payment within <b>{setInvoiceStatus(invoice.status)}</b></h6>
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
        <div>
          <span>Amount:</span>
          <span><b>{invoice.crypto_amount - invoice.crypto_received}</b> {config.PAYMENT_OPTS[invoice.gateway]}</span>
        </div>
      </div>
    </div>
    <div className="bg-overlay" onClick={close} />
  </>

}

export default RenderInfoSlider