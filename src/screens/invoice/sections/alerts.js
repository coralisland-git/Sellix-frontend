import React from "react";

export const AlertPartial = ({ hideAlert, invoice }) => {
	return <div className={"sw-container fixed"} onClick={hideAlert}>
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
}

export const AlertCanceled = () => {
	return <div className={"sw-container"}>
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
}

export const AlertSuccess = () => {
	return <div className={"sw-container"}>
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
				<span style={{ whiteSpace: "nowrap"}}>Your invoice has been paid.</span> <br/>
				<span style={{ whiteSpace: "nowrap"}}>You will receive the products within minutes,</span> <br/>
				<span style={{ whiteSpace: "nowrap"}}>check your email!</span>
			</div>
		</div>
	</div>
}
