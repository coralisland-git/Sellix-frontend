import React from "react";
import * as moment from "moment";
import config from "constants/config";


const getCryptoReceived = ({ gateway, crypto_received }) => {
	if(gateway === 'paypal' || gateway === 'perfectmoney' || gateway === 'skrill' || gateway === 'stripe') {
		return null
	} else {
		return (
			<div className="d-flex justify-content-between align-items-center">
				<span className="caption-color">Received</span>
				<span className="mb-0 d-flex align-items-center value-color">
					<img src={config.PAYMENT_ICONS[gateway]} className="mr-1" width="15" height="15" />{crypto_received}
				</span>
			</div>
		)
	}
}

const RenderOrderDetail = ({ status, invoice }) => {

	return <div className="pb-2">
		<h4 className="text-center mb-4 caption-color text-bold mt-1 mb-1">Order Details</h4>
		{
			status !== null &&
			<div className="d-flex justify-content-between align-items-center mb-3">
				<span className="caption-color">Status</span>
				<span className="value-color mb-0">{status}</span>
			</div>
		}
		<div className="d-flex justify-content-between align-items-center mb-3">
			<span className="caption-color">Seller</span>
			<span className="value-color mb-0">{invoice.username}</span>
		</div>
		<div className="d-flex justify-content-between align-items-center mb-3">
			<span className="caption-color">Quantity</span>
			<span className="value-color mb-0">{invoice.quantity}</span>
		</div>
		<div className="d-flex justify-content-between align-items-center mb-3">
			<span className="caption-color">Email</span>
			<span className="value-color mb-0">{invoice.customer_email}</span>
		</div>
		<div className="d-flex justify-content-between align-items-center mb-3">
			<span className="caption-color">Created</span>
			<span className="value-color mb-0">{moment(new Date(invoice.created_at*1000)).format('hh:mm:ss, DD/MM/YYYY')}</span>
		</div>
		{getCryptoReceived({...invoice})}
	</div>
}

export default RenderOrderDetail