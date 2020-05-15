import React from "react";
import * as moment from "moment";
import config from "constants/config";


const getCryptoReceived = ({ gateway, crypto_received }) => {
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

const RenderOrderDetail = ({ status, invoice }) => {

	return <div>
		<h4 className="text-primary mb-3">Order Details</h4>
		{
			status !== null &&
			<div className="d-flex justify-content-between align-items-center mb-2">
				<span className="text-primary">Status</span>
				<h5 className="text-primary mb-0">{status}</h5>
			</div>
		}
		<div className="d-flex justify-content-between align-items-center mb-2">
			<span className="text-primary">Seller</span>
			<h5 className="text-primary mb-0">{invoice.username}</h5>
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
		{getCryptoReceived({...invoice})}
	</div>
}

export default RenderOrderDetail