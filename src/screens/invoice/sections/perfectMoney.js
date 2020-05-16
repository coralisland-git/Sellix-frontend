import React from "react";
import { Button } from "components";
import perfectmoneyIcon from "../../../assets/images/crypto/perfectmoney.svg";


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

export default PerfectMoney;
