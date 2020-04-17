import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Button, Row, Col, Input } from 'reactstrap'
import {
	BootstrapTable,
	TableHeaderColumn,
	SearchField
} from 'react-bootstrap-table'
import { Loader } from 'components'
import { confirmAlert } from 'react-confirm-alert'
import { tableOptions } from 'constants/tableoptions'
import config from 'constants/config'
import { CommonActions } from 'services/global'

import * as ProductActions from './actions'
import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
	return {
		all_products: state.product.all_products
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(ProductActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch)
	}
}

class Product extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			search_key: null
		}

		this.initializeData = this.initializeData.bind(this)
		this.caretRender = this.caretRender.bind(this)
		this.gotoEditPage = this.gotoEditPage.bind(this)
		this.deleteProduct = this.deleteProduct.bind(this)
		this.renderOptions = this.renderOptions.bind(this)
	}

	componentDidMount() {
		this.initializeData()
	}

	initializeData() {
		this.setState({ loading: true })
		this.props.actions
			.getProductList()
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err.error || 'Seomthing went wrong!'
				)
			})
			.finally(() => {
				this.setState({ loading: false })
			})
	}

	gotoEditPage(e, id) {
		this.props.history.push({
			pathname: `/dashboard/${user}/products/all/edit/${id}`
		})
	}

	deleteProduct(e, id) {
		confirmAlert({
			title: 'Are you sure?',
			message: 'You want to delete this product?',
			buttons: [
				{
					label: 'Yes, Delete it!',
					onClick: () => {
						this.setState({ loading: true })
						this.props.actions
							.deleteProduct({
								uniqid: id
							})
							.then((res) => {
								this.props.actions.getProductList()
								this.props.commonActions.tostifyAlert('success', res.message)
							})
							.catch((err) => {
								this.props.commonActions.tostifyAlert(
									'error',
									err.error || 'Seomthing went wrong!'
								)
							})
							.finally(() => {
								this.setState({ loading: false })
							})
					}
				},
				{
					label: 'No',
					onClick: () => {
						return true
					}
				}
			]
		})
	}

	renderProductInfo(cell, row) {
		if (row.title && row.uniqid) {
			return (
				<div style={{ display: 'flex' }}>
					<div className="img-container">
						{row.image_attachment ? (
							<img
								src={`https://api.sellix.io/v1/attachments/image/${row.image_attachment}`}
								alt={row.title}
							/>
						) : (
							<i className="bx bxs-image"></i>
						)}
					</div>
					<div>
						<p>
							<a href={`/dashboard/${user}/products/all/edit/${row.uniqid}`}>
								{row.title}
							</a>
						</p>
						<p className="caption">{row.uniqid}</p>
					</div>
				</div>
			)
		} else {
			return <p className="caption">No specified</p>
		}
	}

	renderProductType(_cell, row) {
		if (row.type) {
			return (
				<div className="badge badge-normal" style={{ margin: '0 auto' }}>
					{row.type}
				</div>
			)
		} else {
			return <p className="caption">No specified</p>
		}
	}

	renderProductPrice(_cell, row) {
		return (
			<p>
				{config.CURRENCY_LIST[row.currency]}
				{row.price_display}
			</p>
		)
	}

	renderFileStock(cell, row) {
		if (row.type === 'serials') {
			return <p>{row.stock}</p>
		}
		if (row.type === 'service') {
			if (row.service_stock === '-1') {
				return (
					<p>
						<span style={{ fontSize: 20 }}>∞</span>
					</p>
				)
			}
			if (row.service_stock != '-1') {
				return <p>{row.service_stock}</p>
			}
		}
		if (row.type === 'file') {
			if (row.file_stock === '-1') {
				return (
					<p>
						<span style={{ fontSize: 20 }}>∞</span>
					</p>
				)
			}
			if (row.file_stock != '-1') {
				return <p>{row.file_stock}</p>
			}
		}
	}

	renderOptions(cell, row) {
		return (
			<div className="d-flex actions">
				<a onClick={(e) => this.gotoEditPage(e, row.uniqid)}>
					<i className="bx bx-edit-alt"></i>
				</a>
				<a>
					<i className="bx bx-line-chart" />
				</a>
				<a onClick={(e) => this.deleteProduct(e, row.uniqid)}>
					<i className="bx bx-trash-alt" />
				</a>
			</div>
		)
	}

	searchProducts(products) {
		const { search_key } = this.state
		const search_fields = ['title', 'type', 'stock', 'revenue']

		const data = products.filter((product) => {
			for (let i = 0; i < search_fields.length; i++)
				if (
					product[search_fields[i]] &&
					product[search_fields[i]].includes(search_key)
				)
					return true
			return false
		})

		return data
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
		const { loading, search_key } = this.state
		const all_products = search_key
			? this.searchProducts(this.props.all_products)
			: this.props.all_products

		return (
			<div className="product-screen">
				<div className="animated fadeIn">
					<Card className="grey">
						<CardHeader>
							<Row style={{ alignItems: 'center' }}>
								<Col md={4}>
									<h1>Products</h1>
								</Col>
								<Col md={8}>
									<div className="d-flex justify-content-end">
										<div className="searchbar white">
											<i className="fas fa-search" />
											<Input
												placeholder="Search..."
												className="header-search-input"
												onChange={(e) => {
													this.setState({ search_key: e.target.value })
												}}
											/>
										</div>
										<Button
											className="ml-3"
											color="primary"
											onClick={() =>
												this.props.history.push(
													`/dashboard/${user}/products/all/new`
												)
											}
										>
											Add Product
										</Button>
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
												options={tableOptions()}
												data={all_products}
												version="4"
												pagination
												totalSize={all_products ? all_products.length : 0}
												className="product-table"
												trClassName="cursor-pointer"
											>
												<TableHeaderColumn
													isKey
													dataField="uniqid"
													dataFormat={this.renderProductInfo}
													dataSort
													caretRender={this.caretRender}
													width="44%"
												>
													Info
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="file_stock"
													dataSort
													dataAlign="center"
													caretRender={this.caretRender}
													dataFormat={this.renderFileStock}
													width="13%"
												>
													Stock
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="price_display"
													dataFormat={this.renderProductPrice}
													dataSort
													dataAlign="center"
													caretRender={this.caretRender}
													width="13%"
												>
													Price
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="type"
													dataFormat={this.renderProductType}
													dataAlign="center"
													caretRender={this.caretRender}
													dataSort
													width="13%"
												>
													Type
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="id"
													dataAlign="right"
													width="17%"
													dataFormat={this.renderOptions}
												>
													Options
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

export default connect(mapStateToProps, mapDispatchToProps)(Product)
