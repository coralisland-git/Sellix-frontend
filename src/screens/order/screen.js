import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	ButtonGroup,
	Input
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import {
	BootstrapTable,
	TableHeaderColumn,
	SearchField
} from 'react-bootstrap-table'
import moment from 'moment'
import config from 'constants/config'
import { Loader, Spin } from 'components'
import { tableOptions } from 'constants/tableoptions'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as OrderActions from './actions'
import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
	return {
		order_list: state.order.order_list
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(OrderActions, dispatch)
	}
}

const ORDER_STATUS = {
	'0': 'Pending',
	'1': 'Completed',
	'2': 'Cancelled',
	'3': 'Confirmation',
	'4': 'Partial'
}

const PAYMENT_OPTS = {
	paypal: 'PayPal',
	bitcoin: 'BTC',
	litecoin: 'LTC',
	ethereum: 'ETH',
	skrill: 'Skrill',
	stripe: 'Stripe',
	bitcoincash: 'BTH',
	perfectmoney: 'Perfect Money'
}

const renderStatusIcon = (status) => {
	switch (Number(status)) {
		case 0:
			return <i className="bx bx-time-five"></i>
		case 1:
			return <i className="bx bx-check-circle"></i>
		case 2:
			return <i className="bx bx-x-circle"></i>
		case 3:
			return <i class="bx bx-loader-alt bx-spin bx-rotate-180"></i>
		case 4:
			return <i class="bx bx-sticker"></i>
		default:
			return <></>
	}
}

class Order extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}

		this.initializeData = this.initializeData.bind(this)
		this.gotoDetail = this.gotoDetail.bind(this)
		this.renderOrderInfo = this.renderOrderInfo.bind(this)
		this.caretRender = this.caretRender.bind(this)
	}

	componentDidMount() {
		this.initializeData()
	}

	initializeData() {
		this.setState({ loading: true })
		this.props.actions
			.getOrderList()
			.then((res) => {
				if (res.status === 200) {
					this.setState({ loading: false })
				}
			})
			.finally(() => {
				this.setState({ loading: false })
			})
	}

	gotoDetail(e, id) {
		this.props.history.push({
			pathname: `/dashboard/${user}/orders/view/${id}`
		})
	}

	renderOrderInfo(cell, row) {
		return (
			<div>
				<p>
					<a onClick={(e) => this.gotoDetail(e, row.uniqid)}>
						<i
							className={`flag-icon flag-icon-${row.country.toLowerCase()}`}
							title={row.location}
						></i>
						&nbsp;&nbsp;&nbsp;
						{`${PAYMENT_OPTS[row.gateway]} - ${row.customer_email}`}
					</a>
				</p>
				<p className="caption">
					{row.uniqid} -{' '}
					{row.developer_invoice == '1'
						? row.developer_title
						: row.product_title}
				</p>
			</div>
		)
	}

	renderOrderStatus(cell, row) {
		return (
			<div
				className={`badge badge-${ORDER_STATUS[row.status].toLowerCase()}`}
				style={{ margin: '0 auto', width: '35%' }}
			>
				<div
					style={{
						width: '30%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{renderStatusIcon(row.status)}
				</div>
				<div
					style={{
						width: '70%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{ORDER_STATUS[row.status]}
				</div>
				{/* {row.status == 3 && <Spin />} */}
			</div>
		)
	}

	renderOrderValue(cell, row) {
		return (
			<div className="order">
				<p className="order-value">
					{'+' + config.CURRENCY_LIST[row.currency] + row.total_display}
				</p>
				<p className="caption">
					{row.crypto_amount ? row.crypto_amount + ' ' : ''}{' '}
					{PAYMENT_OPTS[row.gateway]}
				</p>
			</div>
		)
	}

	renderOrderTime(cell, row) {
		return (
			<div>
				<p>
					{new moment(new Date(row.created_at * 1000)).format('DD, MMM YYYY')}
				</p>
				<p>{new moment(new Date(row.created_at * 1000)).format('HH:mm')}</p>
			</div>
		)
	}

	caretRender(direction) {
		return (
			<div style={{ marginLeft: 12.4, display: 'inline' }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3.621"
					height="11.98"
					style={{
						marginRight: 3,
						transform: `scale(${direction === 'desc' ? 1.2 : 1.1})`,
						transition: 'all 0.2s linear'
					}}
					opacity={direction === 'asc' ? 0.4 : 1}
					viewBox="0 0 3.621 11.72"
				>
					<path
						d="M6.834,15.272V4.586h.54V15.272l1.159-1.159.382.382L7.1,16.306,5.293,14.5l.382-.382Z"
						transform="translate(-5.293 -4.586)"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3.621"
					height="11.98"
					style={{
						transform: `scale(${direction === 'asc' ? 1.2 : 1.1})`,
						transition: 'all 0.2s linear'
					}}
					opacity={direction === 'desc' ? 0.4 : 1}
					viewBox="0 0 3.621 11.72"
				>
					<path
						d="M6.834,5.619V16.306h.54V5.619L8.532,6.778,8.914,6.4,7.1,4.586,5.293,6.4l.382.382Z"
						transform="translate(-5.293 -4.586)"
					/>
				</svg>
			</div>
		)
	}

	render() {
		const { loading } = this.state
		const { order_list } = this.props

		return (
			<div className="order-screen">
				<div className="animated fadeIn">
					<Card className="grey">
						<CardHeader>
							<Row style={{ alignItems: 'center' }}>
								<Col md={4}>
									<h1>Orders</h1>
								</Col>
								<Col md={8}>
									<div className="d-flex justify-content-end">
										<div className="searchbar white">
											<i className="fas fa-search" />
											<Input
												placeholder="Search..."
												className="header-search-input"
											></Input>
										</div>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody className="p-0">
							{loading ? (
								<Row>
									<Col lg={12}>
										<Loader />
									</Col>
								</Row>
							) : (
								<Row>
									<Col lg={12}>
										<div>
											<BootstrapTable
												options={{
													...tableOptions(),
													onRowClick: (row) => {
														this.gotoDetail(null, row.uniqid)
													},
													sizePerPage: 15
												}}
												data={order_list}
												version="4"
												pagination
												totalSize={order_list ? order_list.length : 0}
												className="product-table"
												trClassName="cursor-pointer"
											>
												<TableHeaderColumn
													isKey
													dataField="uniqid"
													caretRender={this.caretRender}
													dataFormat={this.renderOrderInfo}
													dataSort
													width="45%"
												>
													Info
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="status"
													caretRender={this.caretRender}
													dataAlign="center"
													dataFormat={this.renderOrderStatus}
													dataSort
													width="20%"
												>
													Status
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="value"
													caretRender={this.caretRender}
													dataAlign="center"
													dataSort
													dataFormat={this.renderOrderValue}
													width="20%"
												>
													Value
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="datetime"
													caretRender={this.caretRender}
													dataAlign="right"
													dataFormat={this.renderOrderTime}
													dataSort
													width="15%"
												>
													Time
												</TableHeaderColumn>
											</BootstrapTable>
										</div>
									</Col>
								</Row>
							)}
						</CardBody>
					</Card>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)
