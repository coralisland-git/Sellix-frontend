import React from 'react'
import {Card, CardBody, Row, Col, FormGroup, Label} from 'components/reactstrap'
import {Loader} from 'components'
import config from "constants/config";
import './style.scss'


const CRYPTOS = ['bitcoin', 'litecoin', 'ethereum', 'bitcoincash']

class Invoice extends React.Component {

	render() {

		const {loading, order} = this.props;

		if (+order.developer_invoice === 1) {
			return <Card>
				<CardBody>
					{loading && <Row><Col lg={12}><Loader/></Col></Row>}
					{!loading && <Row>
						<Col lg={12}>
							<FormGroup className="mb-4">
								<Label className="title">Developer Settings</Label>
							</FormGroup>
						</Col>
						<Col lg={12}>
							<Row>
								<Col lg={12}>
									<div className="d-flex">
										<p className="title">Title:</p>
										<p className="title">{order.developer_title}</p>
									</div>
									<div className="d-flex">
										<p className="title">Webhook:</p>
										<p className="title">{order.developer_webhook}</p>
									</div>
									<div className="d-flex">
										<p className="title">Return url:</p>
										<p className="title">{order.developer_return_url}</p>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
					}
				</CardBody>
			</Card>
		}

		if (order.gateway && CRYPTOS.includes(order.gateway)) {
			return <Card>
				<CardBody>
					{loading && <Row><Col lg={12}><Loader/></Col></Row>}
					{!loading && <Row>
						<Col lg={12}>
							<FormGroup className="mb-4">
								<h4 className="title">{config.PAYMENT_OPTS[order.gateway]} Details</h4>
							</FormGroup>
						</Col>
						<Col lg={12}>
							<Label className="title">General Info</Label>
							<Row>
								<Col lg={12}>
									<div className="d-info">
										<p className="d-addr">
											<label>Address:</label> <img src={config.PAYMENT_ICONS[order.gateway]} width="15" alt={"Currency"}/> -
											{order.gateway === 'bitcoin' && <a href={`https://www.blockchain.com/btc/address/${order.crypto_address}`} target="blank">{order.crypto_address}</a>}
											{order.gateway === 'litecoin' && <a href={`https://live.blockcypher.com/ltc/address/${order.crypto_address}`} target="blank">{order.crypto_address}</a>}
											{order.gateway === 'ethereum' && <a href={`https://etherscan.io/address/${order.crypto_address}`} target="blank">{order.crypto_address}</a>}
										</p>
										{order.crypto_amount - order.crypto_received > 0 &&
                                            <p className="d-addr">
                                                <label>Needed:</label> {(order.crypto_amount - order.crypto_received).toFixed(8)}
                                            </p>
										}
										<p className="hash m-0">
											<label>Received:</label> {Number(order.crypto_received).toFixed(8)}
										</p>
										<p className="hash">
											<label>Amount:</label> {Number(order.crypto_amount).toFixed(8)}
										</p>
									</div>
								</Col>
							</Row>
						</Col>
						{
							!["0", "2"].includes(order.status) && <Col lg={12}>
								<Label className="title">Transactions</Label>
								<Row>
									<Col lg={12}>
										{
											order.crypto_transactions && order.crypto_transactions.map(trans =>
												<div className="d-flex">
													<p className="hash">
														{trans.crypto_amount} <img src={config.PAYMENT_ICONS[order.gateway]} width="15" alt={"Currency"}/> -{order.gateway === 'bitcoin' && <a href={`https://www.blockchain.com/btc/tx/${trans.hash}`} target="blank">{trans.hash}</a>}
														{order.gateway === 'litecoin' && <a href={`https://live.blockcypher.com/ltc/tx/${trans.hash}`} target="blank">{trans.hash}</a>}
														{order.gateway === 'ethereum' && <a href={`https://etherscan.io/tx/${trans.hash}`} target="blank">{trans.hash}</a>}
													</p>
												</div>
											)
										}
									</Col>
								</Row>
							</Col>
						}
						{
							order.crypto_transactions && order.crypto_transactions.length === 1 && order.crypto_payout_transaction && (
								<Col lg={12}>
									<Label className="title">Payout</Label>
									<Row>
										<Col lg={12}>
											<div className="d-flex">
												<p className="hash">
													{order.crypto_payout_transaction.crypto_amount} <img
													src={config.PAYMENT_ICONS[order.gateway]} width="15" alt={"Currency"}/> -
													{order.gateway === 'bitcoin' && <a href={`https://www.blockchain.com/btc/tx/${order.crypto_payout_transaction.hash}`} target="blank">{order.crypto_payout_transaction.hash}</a>}
													{order.gateway === 'litecoin' && <a href={`https://live.blockcypher.com/ltc/tx/${order.crypto_payout_transaction.hash}`} target="blank">{order.crypto_payout_transaction.hash}</a>}
													{order.gateway === 'ethereum' && <a href={`https://etherscan.io/tx/${order.crypto_payout_transaction.hash}`} target="blank">{order.crypto_payout_transaction.hash}</a>}
												</p>
											</div>
										</Col>
									</Row>
								</Col>
							)
						}
					</Row>
					}
				</CardBody>
			</Card>
		}

		return null
	}
}

export default Invoice
