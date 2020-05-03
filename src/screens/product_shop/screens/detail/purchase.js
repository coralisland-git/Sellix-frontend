import backIcon from "assets/images/x.png";
import config from "constants/config";
import { Collapse, Input } from "reactstrap";
import { withRouter } from "react-router-dom";
import React from "react";
import { api, formData } from 'utils';
import { Button } from 'components';

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
			</div>
		</Button>
)}

class Purchase extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			openCoupon: false,
			showPaymentOptions: false,
			quantity: this.props.productInfo.quantity_min == -1 ? 1 : this.props.productInfo.quantity_min,
			appliedCoupon: null,
			couponSuccess: false,
			couponError: false,
			couponLoader: false
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

		if(!this.isValidCount(parseInt(quantity)+1)) {
			return true
		}

		this.setState({
			quantity: Number(quantity) + 1
		}, () => {
			this.props.setCount(this.state)
		})
	}


	setCoupon = coupon_code => {
		this.setState({
			coupon_code
		}, () => {
			// this.props.setCoupon(this.state.coupon_code)
		})
	}

	isValidCount = (count) => {
		if(isNaN(count)) {
			return false
		}

		if(count < 1) {
			return false
		}

		const { type, stock, file_stock, service_stock, quantity_max, quantity_min } = this.props.productInfo;

		if((quantity_max != -1 && count > quantity_max) ||
		   (quantity_min != -1 && count < quantity_min)) {
			return false
		}

		if((type == 'serials' && stock != -1 && count > stock)) {
			return false
		}

		if(type == 'file' && file_stock != -1 && count > file_stock) {
			return false
		}

		if(type == 'service' && service_stock != -1 && count > service_stock) {
			return false
		}

		return true;
	}

	stockUnion = () => {
		const { type, stock, file_stock, service_stock, quantity_max, quantity_min } = this.props.productInfo;

		console.log('type', type, {
			'serials': stock,
			'file': file_stock,
			'service': service_stock
		}[type])

		return {
			'serials': stock,
			'file': file_stock,
			'service': service_stock
		}[type]
	}

	isOutOfStock = () => {
		const { type, stock, file_stock, service_stock, quantity_max, quantity_min } = this.props.productInfo;

		const quantityMin = quantity_min == -1 ? 1 : quantity_min

		const stockUnion = this.stockUnion()

		console.log('isOutOfStock', stockUnion, quantityMin, stockUnion < quantityMin)

		return parseInt(stockUnion) < parseInt(quantityMin)
	}

	outOfStockMessage = () => {
		const { type, stock, file_stock, service_stock, quantity_max, quantity_min } = this.props.productInfo;

		const stockUnion = this.stockUnion()

		if(stockUnion == 0) {
			return "Product is not available"
		}

		const isPlural = stockUnion > 1

		const are = isPlural ? 'are' : 'is'
		const s = isPlural ? 's' : ''

		return `There ${are} ${stockUnion} item${s} left, but minimum quantity for purchase is ${quantity_min}`
	}

	setCount = (count) => {

		const { type, stock, file_stock, service_stock, quantity_max, quantity_min } = this.props.productInfo;

		if(!isNaN(count)) {

			let validatedCount = Number(count);

			if((type == 'serials' && quantity_max != -1 && validatedCount >= quantity_max) ||
				(type == 'serials' && quantity_max != -1 && validatedCount >= stock) ||
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

	applyCoupon = () => {
		this.setState({
			couponSuccess: false,
			couponError: false,
			couponLoading: true,
			appliedCoupon: null
		})

		const { coupon_code } = this.state

		let data = {
			method: 'POST',
			url: '/coupons/check',
			data: formData({
				code: coupon_code,
				product_id: this.props.productInfo.uniqid
			})
		}

		api(data).then(res => {
			if(res.status == 200) {
				this.props.setCoupon(coupon_code)
				return this.setState({
					appliedCoupon: res.data.coupon,
					couponSuccess: true,
					couponLoading: false
				})
			} else if(res.status == 400)
				return this.setState({
					couponError: true,
					couponLoading: false
				})
			else throw res
		}).catch(err => {
			throw err
		})
	}


	render() {

		let { productInfo, setPaymentOptions } = this.props;
		let { paymentOptions = [] } = productInfo;
		let { openCoupon, showPaymentOptions, couponSuccess, couponError, couponLoading, appliedCoupon, quantity } = this.state;
		let currency = config.CURRENCY_LIST[productInfo.currency];

		if(this.isOutOfStock() && quantity > 0) {
			this.setState({ quantity: 0 })
		}

		return <div>
			<div className="p-3 pt-2 pb-2">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h4 className="mt-2 grey">Purchase</h4>
					<div onClick={this.backToProducts} style={{ cursor: "pointer" }} >
						<img src={backIcon} className="mb-2" width="15" alt={''}/>
					</div>
				</div>

				<div className="text-center">
					<h3>{currency}{(productInfo.price_display * quantity * (appliedCoupon ? (100 - appliedCoupon.discount) / 100 : 1)).toFixed(2) || 0}</h3>
					<div className="mt-3">
						{!showPaymentOptions && <Button color="primary" className="mr-auto ml-auto d-block" onClick={this.showPaymentOptions} style={this.isOutOfStock() ? {
							width: 170,
							opacity: 0.7,
							pointerEvents: 'none'
						} : {width: 170}}>Purchase</Button>}
						{showPaymentOptions && paymentOptions.length === 0 && <p className="mt-3 mb-3 text-grey">This product has no payment options.</p>}
						<Collapse isOpen={showPaymentOptions}>
							<div className={paymentOptions.length > 4 ? "d-flex flex-wrap justify-content-between" : ""}>
								{paymentOptions.map((option, key) => <ButtonOptions option={option} key={key} setPaymentOptions={setPaymentOptions} />)}
							</div>
						</Collapse>
					</div>
					<div className="d-flex justify-content-center align-items-center mt-3 stock-count" style={this.isOutOfStock() ? {
						opacity: 0.5,
						pointerEvents: 'none'
					} : {}}>
						<span className={"quantity-picker " + (!this.isValidCount(quantity-1) ? 'text-grey' : '')} style={{ padding: "1rem" }} onClick={this.decreaseCount}><i className="fas fa-minus"/></span>
						<span style={{ fontSize: 20, minWidth: 25, marginBottom: 2.5 }}>
			                <input
				                type="text"
				                value={quantity}
				                onChange={(e) => this.setCount(e.target.value)}
				                onBlur={(e) => this.onBlur(e.target.value)}
			                />
		                </span>
						<span className={"quantity-picker " + (!this.isValidCount(parseInt(quantity)+1) ? 'text-grey' : '')} onClick={this.increaseCount} style={{ padding: "1rem" }}><i className="fas fa-plus"/></span>
					</div>

					{this.isOutOfStock() && <div>
						<p className="text-red mt-3">{this.outOfStockMessage()}</p>
					</div>}

					{!this.isOutOfStock() && <>
						{openCoupon ?
							<div className="mt-3">
								<div style={{display: 'flex'}} className="coupon-apply-container">
									<Input type="text" id="coupon" name="coupon" placeholder="Coupon code" onChange={(e) => {this.setCoupon(e.target.value)}}/>
									<Button color="primary" className="mr-auto ml-auto d-block" onClick={this.applyCoupon} style={{
										width: 100
									}}>Apply</Button>
									<style>
										{`
											.coupon-apply-container > *:first-child {
												border-radius: 3px 0 0 3px !important;
											}
											.coupon-apply-container > *:nth-child(2) {
												border-radius: 0 3px 3px 0 !important;
											}
										`}
									</style>
								</div>
								<p className="text-grey text-left mt-2 coupon-help" style={{
									display: 'flex',
									justifyContent: 'center',
									paddingTop: '10px'
								}}>
									{couponSuccess && <span className="text-green">{parseInt(appliedCoupon.discount)}% Coupon is applied!</span>}
									{couponError && <span className="text-red">Coupon does not exist or is expired</span>}
									{/* {couponLoading && Loading()} */}
								</p>
							</div> :
							<p className="text-grey mt-3 cursor-pointer" onClick={this.openCoupon}>Apply a Coupon</p>
						}
					</>}

				</div>
			</div>
		</div>
	}
}

export default withRouter(Purchase);
