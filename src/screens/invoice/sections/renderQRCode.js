import React from "react";
import config from "constants/config";
import qrCornerImg from "../../../assets/images/qr-corner.png";
import { QRCode } from 'react-qrcode-logo';


const RenderQRCode = ({ onClick, borderRadius, qrBgColor, theme, invoice, onQrDrow, qrCellSize }) => {

  return <div onClick={onClick} className="qr-wrapper"  style={borderRadius ? { borderRadius, overflow: 'hidden', width: "auto", marginLeft: "-7px" } : {}}>
    <QRCode
        bgColor={qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')}
        value={invoice.crypto_uri}
        size="270"
        ecLevel={invoice.gateway === 'bitcoincash' ? "H" : "Q"}
        qrStyle="dots"
        onQrDraw={onQrDrow}
    />
    <img src={config.PAYMENT_ICONS[invoice.gateway]} width={qrCellSize * 11} style={{
      background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe'),
      position: 'absolute',
      left: "50%",
      transform: "translateX(-50%)",
      padding: qrCellSize + 'px'
    }} alt={""}/>
    <img className="qr-corner top left" src={qrCornerImg}  width={qrCellSize * 8} style={{
      left: qrCellSize + 'px',
      top: qrCellSize + 'px',
      background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')
    }} alt={""}/>
    <img className="qr-corner top right" src={qrCornerImg} width={qrCellSize * 8} style={{
      right: qrCellSize + 'px',
      top: qrCellSize + 'px',
      background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')
    }} alt={""}/>
    <img className="qr-corner bottom left" src={qrCornerImg} width={qrCellSize * 8} style={{
      left: qrCellSize + 'px',
      bottom: qrCellSize + 'px',
      background: qrBgColor ? qrBgColor : (theme === 'light' ? 'white' : '#edf0fe')
    }} alt={""}/>
  </div>

}

export default RenderQRCode