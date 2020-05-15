import React, { useState, useRef } from "react";
import { Loader } from "components";
import ReactTooltip from "react-tooltip";
import {CopyToClipboard} from "react-copy-to-clipboard";
import copyIcon from "../../../assets/images/copy.svg";
import config from "../../../constants/config";
import infoIconRed from "../../../assets/images/infoRed.svg";
import infoIcon from "../../../assets/images/info.svg";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import checkMarkIcon from "../../../assets/images/green_checkmark.svg";
import RenderInfoSlider from "./renderInfoSlide";


const QRMode = ({ invoice, seconds, theme, setInvoiceStatus, qrCode }) => {

  const [ infoPanel, setInfoPanel ] = useState(false)
  const [ linkPanel, setLinkPanel ] = useState(false)
  const [ copied, setCopied ] = useState(false)


  const progressShouldBeRed = seconds && seconds < 60 * 60

  const buildStyle = {
    strokeLinecap: 'butt',
    textSize: '24px',
    pathColor: progressShouldBeRed ? '#ef476f' : `#4F6EF7`,
    textColor: progressShouldBeRed ? '#ef476f' : `#4F6EF7`,
    trailColor: '#d6d6d6',
    backgroundColor: '#3e98c7'
  }

  const background = { background: theme === 'light' ? '#f0f3f599' : '#edf0fe' };

  const copyToClipboard = () => {
    console.log(copied)
    if(!copied) {
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 1500)
    }
  }

  const copyIconRef = useRef(null)


  return <>

    {(+invoice.status === 0 || +invoice.status === 4) && <>
      <p className={"qrCode-message"}>Scan the QR code or copy and paste the payment details into your wallet</p>

      <div style={background} className={"qr-container " + (progressShouldBeRed && "progress-red")}>

        <div>
          <ReactTooltip place="top" backgroundColor="#4F6EF7" effect="solid" className="copy-tooltip" afterShow={() => {}} />

          <CopyToClipboard text={invoice.crypto_address} onCopy={() => setTimeout(() => { copyToClipboard() }, 300)}>
            <img src={copyIcon}
                 height="30"
                 data-tip={"Copy " + config.PAYMENT_OPTS_FULL_NAME[invoice.gateway] + " Address"}
                 data-place="top"
                 onClick={() => setLinkPanel(true)}
                 style={{ cursor: 'pointer', height: '25px' }}
                 ref={copyIconRef}
                 alt={""}
            />
          </CopyToClipboard>

          <h3>{((invoice.crypto_amount || 0) - (invoice.crypto_received || 0)).toFixed(8)} {config.PAYMENT_OPTS[invoice.gateway]}</h3>

          <div className={"position-relative"}>
            <img src={progressShouldBeRed ? infoIconRed : infoIcon} className="qrCode-progress-overlay progress-overlay" onClick={() => setInfoPanel(true)}/>
            <CircularProgressbar
                value={seconds / (24 * 60 * 60) * 100}
                text={setInvoiceStatus(invoice.status)}
                counterClockwise={true}
                strokeWidth={10}
                className={progressShouldBeRed && "red"}
                styles={buildStyles(buildStyle)}
            />
          </div>

        </div>

        <CopyToClipboard text={invoice.crypto_address} onCopy={() => setTimeout(() => { copyToClipboard() }, 300)}>
          {qrCode({onClick: () => setLinkPanel(true)})}
        </CopyToClipboard>

        <div className={"payment-link-slide-down-panel " + (linkPanel && "open ") + (copied && "show-copy")} style={{ background: theme === 'light' ? 'white' : '#edf0fe' }}>
          <h5>{config.PAYMENT_OPTS_FULL_NAME[invoice.gateway]} Address</h5>
          <CopyToClipboard text={invoice.crypto_address} onCopy={() => copyToClipboard()}>
            <div>
              <span>{invoice.crypto_address}</span>
              <img src={copyIcon} height="20" alt={""}/>
              <div className="copy-mode">
                <img src={checkMarkIcon} height="20" alt={""}/>
                <span>Copied</span>
              </div>
            </div>
          </CopyToClipboard>
        </div>
        <div className="bg-overlay" onClick={() => {
          setInfoPanel(false);
          setLinkPanel(false);
        }} />

        <RenderInfoSlider
            infoPanel={infoPanel}
            theme={theme}
            invoice={invoice}
            close={() => setInfoPanel(false)}
            setInvoiceStatus={setInvoiceStatus}
        />

      </div>

    </>}

    {+invoice.status === 3 && <>
      <Loader/>
      <h4 className={"text-center mb-5"}>
        Awaiting Confirmation <br/>({((invoice.crypto_transactions || []).slice(-1)[0] || {}).confirmations}/{invoice.crypto_confirmations || 0})
      </h4>
    </>}
  </>
}

export default QRMode;
