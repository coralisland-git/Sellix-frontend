import backIcon from "../../../../assets/images/x.png";
import config from "../../../../constants/config";
import { Collapse, Button, Input } from "reactstrap";
import { withRouter } from "react-router-dom";
import React from "react";

const ButtonOptions = ({ option, setPaymentOptions, index }) => {
	if(option === '') {
		return null
	}

	return (
		<Button className="pay-button mb-2 pl-2 mr-auto ml-auto pr-2 d-block" onClick={setPaymentOptions(config.PAYMENT_LABELS[option])} style={{width: 145}}>
			{/*pay-button mt-3 pl-3 mr-auto ml-auto pr-3 d-block*/}
			{/*170*/}
			<div className="d-flex justify-content-between align-items-center">
				<div>
					<img src={config.PAYMENT_ICONS[option]} className="mr-2" width="20" height="20" alt={''}/>
					{config.PAYMENT_LABELS[option]}
				</div>
				<div><i className="fas fa-xs fa-chevron-right"/></div>
			</div>
		</Button>
)}

class Purchase extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			openCoupon: false,
			showPaymentOptions: false,
			quantity: 1
		}
	}

	openCoupon = () => {
		this.setState({
			openCoupon: true
		})
	}

	showPaymentOptions = () => {
		this.setState({
			showPaymentOptions: true
		})
	}

	backToProducts = () => {
		console.log(this.props.history, this.state.showPaymentOptions)
		if(this.state.showPaymentOptions) {
			this.setState({ showPaymentOptions: false })
		} else {
			this.props.history.push(`/${this.props.productInfo.username}`)
		}
	}

	decreaseCount = () => {
		let { quantity } = this.state;
		let { quantity_min } = this.props.productInfo;

		this.setState({
			quantity: Number(quantity > quantity_min ? quantity - 1 : quantity)
		}, () => {
			this.props.setCount(this.state)
		})
	}


	increaseCount = () => {

		const { quantity } = this.state;
		const { type, stock, file_stock, service_stock, quantity_max } = this.props.productInfo;

		if((type == 'serials' && quantity_max != -1 && quantity >= quantity_max) ||
			(type == 'serials' && quantity_max == -1 && quantity >= stock)) {
			return true
		}

		if(type == 'file' &&  file_stock != -1 && quantity >= file_stock) {
			return true
		}

		if(type == 'service' &&  service_stock != -1 && quantity >= service_stock) {
			return true
		}

		this.setState({
			quantity: Number(quantity + 1)
		}, () => {
			this.props.setCount(this.state)
		})
	}


	setCoupon = coupon_code => {
		this.setState({
			coupon_code
		}, () => {
			this.props.setCoupon(this.state.coupon_code)
		})
	}

	setCount = (count) => {

		const { type, stock, file_stock, service_stock, quantity_max, quantity_min } = this.props.productInfo;

		if(!isNaN(count)) {

			let validatedCount = Number(count);

			if((type == 'serials' && quantity_max != -1 && validatedCount >= quantity_max) ||
				(type == 'serials' && quantity_max == -1 && validatedCount >= stock)) {
				validatedCount = Math.min(stock, validatedCount)
			}

			if(type == 'file' &&  file_stock != -1 && validatedCount >= file_stock) {
				validatedCount = Math.min(file_stock, validatedCount)
			}

			if(type == 'service' &&  service_stock != -1 && validatedCount >= service_stock) {
				validatedCount = Math.max(quantity_min, validatedCount)
			}

			this.setState({
				quantity: Number(validatedCount)
			}, () => {
				this.props.setCount(this.state)
			})
		}
	}

	onBlur = (count) => {
		if(count < this.props.productInfo.quantity_min) {
			this.setState({
				quantity: Number(this.props.productInfo.quantity_min)
			}, () => {
				this.props.setCount(this.state)
			})
		}
	}


	render() {

		let { productInfo, quantity, setPaymentOptions } = this.props;
		let { paymentOptions = [] } = productInfo;
		let { openCoupon, showPaymentOptions } = this.state;
		let currency = config.CURRENCY_LIST[productInfo.currency];

		return <div>
			<div className="p-3 pt-2 pb-2">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h4 className="mt-2 grey">Purchase</h4>
					<img src={backIcon} className="mb-2" width="15" onClick={this.backToProducts} style={{ cursor: "pointer" }} />
				</div>

				<div className="text-center">
					<h3>{currency}{(productInfo.price_display * quantity).toFixed(2) || 0}</h3>
					<div className="mt-3">
						{!showPaymentOptions && <Button color="primary" className="mr-auto ml-auto d-block" onClick={this.showPaymentOptions} style={{width: 170}}>Purchase</Button>}
						{showPaymentOptions && paymentOptions.length === 0 && <p className="mt-3 mb-3 text-grey">This product has no payment options.</p>}
						<Collapse isOpen={showPaymentOptions}>
							<div className={paymentOptions.length > 4 ? "d-flex flex-wrap justify-content-between" : ""}>
								{paymentOptions.map((option, key) => <ButtonOptions option={option} key={key} setPaymentOptions={setPaymentOptions} />)}
							</div>
						</Collapse>
					</div>
					<div className="d-flex justify-content-center align-items-center mt-3 stock-count">
						<span className={quantity === 1 ? 'text-grey' : ''} style={{ padding: "1rem" }} onClick={this.decreaseCount}><i className="fas fa-minus"/></span>
						<span style={{ fontSize: 20, minWidth: 25, marginBottom: 2.5 }}>
			                <input
				                type="text"
				                value={quantity}
				                onChange={(e) => this.setCount(e.target.value)}
				                onBlur={(e) => this.onBlur(e.target.value)}
			                />
		                </span>
						<span onClick={this.increaseCount} style={{ padding: "1rem" }}><i className="fas fa-plus"/></span>
					</div>

					{openCoupon ?
						<div className="mt-3">
							<Input type="text" id="coupon" name="coupon" placeholder="Coupon code" onChange={(e) => {this.setCoupon(e.target.value)}}/>
							<p className="text-grey text-left mt-2 coupon-help">This coupon will be automatically checked and applied if working when you proceed with the invoice</p>
						</div> :
						<p className="text-grey mt-3 cursor-pointer" onClick={this.openCoupon}>Apply a Coupon</p>
					}

				</div>
			</div>
		</div>
	}
}

export default withRouter(Purchase);