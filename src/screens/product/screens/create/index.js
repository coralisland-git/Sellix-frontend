import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col, FormGroup, Form, Label, Tooltip, Input, BreadcrumbItem, Breadcrumb } from 'components/reactstrap'
import Select from 'react-select'
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import AppSwitch from '@coreui/react/es/Switch'
import {Loader, ImageUpload, FileUpload, DataSlider, Button, Spin} from 'components'
import * as ProductActions from '../../actions'
import { Formik } from 'formik';
import config, { converter } from 'constants/config';

import { CommonActions } from 'services/global'

import './style.scss'

import bitcoinIcon from 'assets/images/crypto/btc.svg'
import ethereumIcon from 'assets/images/crypto/eth.svg'
import stripeIcon from 'assets/images/crypto/stripe.svg'
import bitcoinCashIcon from 'assets/images/crypto/bitcoincash.svg'
import litecoinIcon from 'assets/images/crypto/ltc.svg'
import skrillIcon from 'assets/images/crypto/skrill.svg'
import perfectmoneyIcon from 'assets/images/crypto/perfectmoney.svg'
import object from "yup/lib/object";
import string from "yup/lib/string";
import number from "yup/lib/number";

const Yup = {
	object,
	string,
	number,
}


class CreateProduct extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			unlistedTooltipOpen: false,
			privateTooltipOpen: false,
			blockTooltipOpen: false,
			paypalTooltipOpen: false,
			riskTooltipOpen: false,
			selectedTab: 'write',
			files: [],
			images: [],
			initialValues: {
				title: '',
				price: '',
				description: '',
				currency: config.CURRENCY_OPTIONS[0],
				gateways: '',
				type: 'file',
				serials: '',
				service_text: '',
				file_stock: -1,
				service_stock: -1,
				stock_delimiter: config.DELIMITER_OPTIONIS[0].value,
				quantity_min: 0,
				quantity_max: 0,
				delivery_text: '',
				custom_fields: [],
				crypto_confirmations: 0,
				max_risk_level: 0,
				unlisted: 0,
				private: 0,
				block_vpn_proxies: 0,
				sort_priority: 1,
				image: null,
				file: null
			},
			showFileStock: false,
			showServiceStock: false,
			gateways: {},
			type: config.TYPE_OPTIONS[0],
			delimiter: config.DELIMITER_OPTIONIS[0],
			custom_fields: [],
			webhook_fields: []
		}

		this.addCustomField = this.addCustomField.bind(this)
		this.deleteCustomField = this.deleteCustomField.bind(this)
		this.saveCustomField = this.saveCustomField.bind(this)

		this.addWebhookField = this.addWebhookField.bind(this)
		this.deleteWebhookField = this.deleteWebhookField.bind(this)
    	this.saveWebhookField = this.saveWebhookField.bind(this)
	}

	componentWillUnmount() {
		// Make sure to revoke the data uris to avoid memory leaks
		this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
	}

	unlistedTooltipToggle() {
		this.setState({unlistedTooltipOpen: !this.state.unlistedTooltipOpen})
	}

	privateTooltipToggle() {
		this.setState({privateTooltipOpen: !this.state.privateTooltipOpen})
	}

	blockTooltipToggle() {
		this.setState({blockTooltipOpen: !this.state.blockTooltipOpen})
	}

	paypalTooltipToggle() {
		this.setState({paypalTooltipOpen: !this.state.paypalTooltipOpen})
	}


	addFile = file => {
		this.setState({
			files: file.map(file =>
				Object.assign(file, {
					preview: URL.createObjectURL(file)
				})
			)
		});
	};

	addImages = image => {
		this.setState({
			images: image.map(image =>
				Object.assign(image, {
					preview: URL.createObjectURL(image)
				})
			)
		});
	};


	addWebhookField() {
		const webhook_fields = Object.assign([], this.state.webhook_fields)
		webhook_fields.push('')

		this.setState({webhook_fields: webhook_fields})
	}

	deleteWebhookField(e, index) {
		const webhook_fields = Object.assign([], this.state.webhook_fields)
		webhook_fields.splice(index, 1)

		this.setState({webhook_fields: webhook_fields})
	}

	saveWebhookField(value, index) {
		const webhook_fields = Object.assign([], this.state.webhook_fields)
		webhook_fields[index] = value

		this.setState({webhook_fields: webhook_fields})
	}

	/**  Custom Fields **/

	addCustomField() {
		const custom_fields = Object.assign([], this.state.custom_fields)
		custom_fields.push({name: '', type: config.CUSTOM_TYPE[0], required: false})

		this.setState({custom_fields: custom_fields})
	}

	deleteCustomField(e, index) {
		const custom_fields = Object.assign([], this.state.custom_fields)
		custom_fields.splice(index, 1)

		this.setState({custom_fields: custom_fields})
	}

	saveCustomField(value, index, field) {
		const custom_fields = Object.assign([], this.state.custom_fields)
		custom_fields[index][field] = value

		this.setState({custom_fields: custom_fields})
	}


	handleSubmit = (values) => {
		this.setState({loading: true})
		const { gateways, custom_fields, showFileStock, showServiceStock, webhook_fields } = this.state
		delete gateways['']

		values.gateways = Object.keys(gateways).filter(key => { return gateways[key]}).toString()
		values.custom_fields = JSON.stringify({
			custom_fields: custom_fields.map(field => { return {...field, type: field.type.value}})
		})
		values.file_stock = showFileStock?values.file_stock:-1
		values.service_stock = showServiceStock?values.service_stock:-1	

		values.webhooks = webhook_fields
		values.currency = typeof values.currency === "string" ? values.currency : values.currency.value

		if(values.quantity_max == "") {
			values.quantity_max = "0"
		}

		this.props.actions.createProduct(values).then(res => {
			this.props.commonActions.tostifyAlert('success', res.message)
			this.props.history.goBack()
		}).catch(err => {
			this.props.commonActions.tostifyAlert('error', err.error)
		}).finally(() => {
			this.setState({loading: false})
		})
	}

	setGateWays(value, isChecked) {
		this.setState({
			gateways: {...this.state.gateways, [value]:isChecked}
		})
	}


	riskTooltipToggle = () => {
		this.setState({
			riskTooltipOpen: !this.state.riskTooltipOpen
		})
	}

	render() {
		const { 
			loading, 
			unlistedTooltipOpen, 
			privateTooltipOpen,
			blockTooltipOpen,
			files, 
			images,
			showFileStock,
			showServiceStock,
			selectedTab,
			initialValues,
			type,
			delimiter,
			custom_fields,
			webhook_fields
		} = this.state;


		const validationSchema = Yup.object().shape({
			title: Yup.string().required('Title is required'),
			price: Yup.number().required('Price is required'),
			description: Yup.string().required('Description is required'),
			currency: Yup.string().required('Currency is required'),
			type: Yup.string(),
			custom_fields: Yup.string(),
			gateways: Yup.string(),
			serials: Yup.string(),
			service_text: Yup.string(),
			file_stock: Yup.number(),
			service_stock: Yup.number(),
			quantity_min: Yup.number(),
			quantity_max: Yup.number(),
			stock_delimiter: Yup.string(),
			delivery_text: Yup.string(),
			crypto_confirmations: Yup.number(),
			max_risk_level: Yup.number(),
			unlisted: Yup.number(),
			private: Yup.number(),
			block_vpn_proxies: Yup.number(),
			sort_priority: Yup.number(),
		})

		return (
			<div className="create-product-screen mt-3">
				<div className="animated fadeIn">

					<Breadcrumb className="mb-0">
						<BreadcrumbItem active className="mb-0">
							<a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Products</a>
						</BreadcrumbItem>
					</Breadcrumb>

					<Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={validationSchema}>
						{props => (
							<Form onSubmit={props.handleSubmit}>
								<Card>

									<CardHeader>
										<Row className={"align-items-center"}>
											<Col md={12}>
												<h1>New Product</h1>
											</Col>
										</Row>
									</CardHeader>

									<CardBody className="p-4 mb-5 ">
										{loading && <Row><Col lg={12}><Loader /></Col></Row>}
										{!loading &&
												<Row className="mb-4">
													<Col lg={12}>
														<Row>
															<Col lg={12}>
																<h4 className="mb-4 mt-1">General Information</h4>
															</Col>
														</Row>
														<Row>
															<Col lg={8}>
																<FormGroup className="mb-3">
																	<Label htmlFor="title">Title</Label>
																	<Input
																		type="text"
																		id="title"
																		name="title"
																		placeholder="Title"
																		onChange={props.handleChange}
																		value={props.values.title}
																		className={props.errors.title && props.touched.title ? "is-invalid" : ""}
																	/>
																	{props.errors.title && props.touched.title && <div className="invalid-feedback">{props.errors.title}</div>}
																</FormGroup>
															</Col>
															<Col lg={4}>
																<FormGroup className="mb-3">
																	<Label htmlFor="price">Price</Label>
																	<div className="d-flex">
																		<div>
																			<Input
																				className={props.errors.price && props.touched.price ? "is-invalid" : ""}
																				style={{ paddingRight: "110px", width: "calc(100% + 89px)" }}
																				type="number"
																				id="price"
																				step="0.01"
																				name="price"
																				placeholder="Price"
																				onChange={props.handleChange}
																				value={props.values.price}
																			/>
																			{props.errors.price && props.touched.price && (
																				<div className="invalid-feedback">{props.errors.price}</div>
																			)}
																		</div>
																		<div style={{marginLeft: -10}}>
																		<Select
																			options={config.CURRENCY_OPTIONS}
																			id="currency"
																			name="currency"
																			placeholder="USD"
																			value={props.values.currency}
																			onChange={(option) => {
																				props.handleChange("currency")(option);
																			}}
																			isSearchable={false}
																			classNamePrefix={"react-select"}
																			className={props.errors.currency && props.touched.currency ? "is-invalid currency-select" : "currency-select"}
																		/>
																		{props.errors.products_bound && props.touched.products_bound &&
																			<div className="invalid-feedback">{props.errors.products_bound}</div>
																		}
																		</div>
																	</div>
																</FormGroup>
															</Col>
														</Row>

														<Row>
															<Col lg={12}>
																<FormGroup className="mb-3">
																	<Label htmlFor="description">Description</Label>
																	<div className={props.errors.description && props.touched.description ? "is-invalid" : ""}>

																		<ReactMde
																			value={props.values.description}
																			onChange={(value) => {
																				props.handleChange('description')(value)
																			}}
																			selectedTab={selectedTab}
																			onTabChange={(tab) => {
																				this.setState({selectedTab:tab})
																			}}
																			generateMarkdownPreview={markdown =>
																				Promise.resolve(converter.makeHtml(markdown))
																			}
																		/>

																	</div>
																	{props.errors.description && props.touched.description && (
																		<div className="invalid-feedback">{props.errors.description}</div>
																	)}
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={12}>
																<FormGroup className="mb-3">
																	<Label htmlFor="product_code">Payment Methods</Label>

																	<div className="d-flex flex-wrap justify-content-between">
																		<label className="custom-checkbox custom-control payment-checkbox ">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="paypal"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('paypal', e.target.checked)
																				}}
																			/>
																			<label className="custom-control-label" htmlFor="paypal">
																				<i className="fab fa-paypal" />
																				PayPal
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="btc"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('bitcoin', e.target.checked)
																				}}
																				/>
																			<label className="custom-control-label" htmlFor="btc">
																				<img src={bitcoinIcon} width="20" height="20"/>
																				Bitcoin
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="eth"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('ethereum', e.target.checked)
																				}}
																				/>
																			<label className="custom-control-label" htmlFor="eth">
																				<img src={ethereumIcon} width="20" height="20"/>
																				Ethereum
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="ltc"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('litecoin', e.target.checked)
																				}}
																				/>
																			<label className="custom-control-label" htmlFor="ltc">
																				<img src={litecoinIcon} width="20" height="20"/>
																				Litecoin
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="sp"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('stripe', e.target.checked)
																				}}
																				/>
																			<label className="custom-control-label" htmlFor="sp">
																				<img src={stripeIcon} width="20" height="20"/>
																				Stripe
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="pm"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('perfectmoney', e.target.checked)
																				}}
																				/>
																			<label className="custom-control-label" htmlFor="pm">
																				<img src={perfectmoneyIcon} width="20" height="20"/>
																				Perfect Money
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="btcc"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('bitcoincash', e.target.checked)
																				}}
																				/>
																			<label className="custom-control-label" htmlFor="btcc">
																				<img src={bitcoinCashIcon} width="20" height="20"/>
																				Bitcoin Cash
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox">
																			<input
																				className="custom-control-input"
																				type="checkbox"
																				id="sk"
																				name="SMTP-auth"
																				onChange={(e) => {
																					this.setGateWays('skrill', e.target.checked)
																				}}
																				/>
																			<label className="custom-control-label" htmlFor="sk">
																				<img src={skrillIcon} width="20" height="20"/>
																				Skrill
																			</label>
																		</label>

																		<label className="custom-checkbox custom-control payment-checkbox" />
																	</div>
																</FormGroup>
															</Col>
														</Row>
														<hr className="mt-4"/>

														<Row>
															<Col lg={12}>
																<h4 className="mb-4 mt-2 pb-1">Product Stock</h4>
															</Col>
														</Row>
														<Row>
															<Col lg={12}>
																<FormGroup className="mb-3">
																	<Label htmlFor="product_code">Type</Label>
																	<Select
																		placeholder="Type"
																		options={config.TYPE_OPTIONS}
																		className="mb-3"
																		classNamePrefix={"react-select"}
																		value={this.state.type}
																		isSearchable={false}
																		onChange={(option) => {
																			this.setState({
																				type: option
																			})
																			props.handleChange("type")(option.value);
																		}}
																		// menuIsOpen={true}
																		>
																	</Select>
																</FormGroup>
															</Col>
														</Row>
														{type.value === 'file' && <Row>
															<Col lg={12} className="mb-3">
																<FileUpload addFile={(file) => {
																	props.handleChange('file')(file[0]);
																	this.addFile(file)}} files={files}/>
															</Col>
															<Col lg={12}>
																<FormGroup row>
																	<Col xs="12" md="7" className="d-flex align-items-center">
																		<AppSwitch className="mx-1 file-switch mr-2"
																			style={{width: 50}}
																			variant={'pill'}
																			color={'primary'}
																			checked={showFileStock}
																			onChange={(e) => {
																				this.setState({
																					showFileStock: e.target.checked
																				})
																			}}
																			size="sm"
																			/><span>Set how many times this file can be sold </span>
																	</Col>
																</FormGroup>
															</Col>
														</Row>}

														{showFileStock && type.value === 'file' && <Row>
															<Col lg={4}>
																<FormGroup>
																	<Label htmlFor="product_code">Stock Amount <small className="font-italic">(leave <b>-1</b> for unlimited times)</small></Label>
																	<Input type="number" id="file_stock" name="file_stock"
																		min={-1}
																		value={props.values.file_stock}
																		onChange={props.handleChange}/>
																</FormGroup>
															</Col>
														</Row>}

														{type.value === 'serials' && <div><Row>
																<Col lg={12} className="mb-3">
																	<textarea
																		className="form-control" rows={5}
																		id="serials"
																		name="serials"
																		value={props.values.serials}
																		onChange={props.handleChange}
																	>
																	</textarea>
																</Col>
															</Row>
															<Row>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="product_code">Stock Delimiter</Label>
																		<Select
																			placeholder="Type"
																			options={config.DELIMITER_OPTIONIS}
																			isSearchable={false}
																			className="mb-3"
																			classNamePrefix={"react-select"}
																			value={this.state.delimiter}
																			onChange={(option) => {
																				this.setState({
																					delimiter: option
																				})

																				if(option.value !== 'custom') {
																					props.handleChange("stock_delimiter")(option.value)
																				} else {
																					props.handleChange("stock_delimiter")('')
																				}
																			}}>
																		</Select>
																	</FormGroup>
																</Col>
																{ delimiter.value === 'custom' &&
																	<Col lg={3}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="product_code">Custom Stock Delimiter</Label>
																			<Input type="text"
																				id="stock_delimiter"
																				name="stock_delimiter"
																				value={props.values.stock_delimiter}
																				onChange={props.handleChange}
																			/>
																		</FormGroup>
																	</Col>
																}
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="product_code">Minimum Quantity</Label>
																		<Input type="number"
																			id="quantity_min"
																			min={0}
																			name="quantity_min"
																			value={props.values.quantity_min}
																			onChange={props.handleChange}
																		/>
																	</FormGroup>
																</Col>
																<Col lg={3}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="product_code">Maximum Quantity</Label>
																		<Input type="number"
																			id="quantity_max"
																			min={1}
																			name="quantity_max"
																			value={props.values.quantity_max == 0 || props.values.quantity_max == -1 ? "" : props.values.quantity_max}
																			onChange={props.handleChange}
																		/>
																		<p style={{
																			margin: '10px 5px',
																			color: 'gray'
																		}}>Leave this field blank to set it to infinite</p>
																	</FormGroup>
																</Col>
														</Row></div>}

														{type.value === 'service' && <Row>
															<Col lg={12}>
																<FormGroup>
																	<Label htmlFor="product_code">Service Info</Label>
																	<textarea className="form-control"
																		id='service_text'
																		name="service_text"
																		value={props.values.service_text}
																		rows={5} onChange={props.handleChange}
																	/>
																</FormGroup>
															</Col>
															<Col lg={12}>
																<FormGroup row>
																	<Col xs="12" md="7" className="d-flex align-items-center">
																		<AppSwitch className="mx-1 file-switch mr-2"
																			style={{width: 50}}
																			variant={'pill'}
																			color={'primary'}
																			checked={showServiceStock}
																			onChange={(e) => {
																				this.setState({
																					showServiceStock: e.target.checked
																				})
																			}}
																			size="sm"
																			/><span>Set how many times this service can be sold </span>
																	</Col>
																</FormGroup>
															</Col>
														</Row>}

														{showServiceStock && type.value === 'service' && <Row>
															<Col lg={4}>
																<FormGroup>
																	<Label htmlFor="product_code">Stock Amount <small className="font-italic">(leave <b>-1</b> for unlimited times)</small></Label>
																	<Input type="number" id="service_stock" name="service_stock"
																		min={-1}
																		value={props.values.service_stock}
																		onChange={props.handleChange}/>
																</FormGroup>
															</Col>
														</Row>}

														<hr className="mt-4"/>
														<Row>
															<Col lg={12}>
																<h4 className="mb-4 mt-2">Customization</h4>
															</Col>
														</Row>
														<Row>
															<Col lg={12}>
																<FormGroup className="mb-3">
																	<Label htmlFor="product_code">Image <small className="font-italic">(optional)</small></Label>
																	<ImageUpload addFile={(file) => {
																	props.handleChange('image')(file[0]);
																	this.addImages(file)}} files={images}/>
																</FormGroup>
																<FormGroup className="mb-3">
																	<Label htmlFor="product_code">Note to Customer <small className="font-italic">(optional)</small></Label>
																	<Input
																		type="textarea"
																		rows={4}
																		id="delivery_text"
																		name="delivery_text"
																		placeholder="Note to Customer"
																		value={props.values.delivery_text}
																		onChange={props.handleChange}
																	/>
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={12}>
																<FormGroup className="mb-0">
																	<Label htmlFor="product_code" style={{width: '100%'}}>Custom Fields <small className="font-italic">(optional)</small></Label>
																</FormGroup>
															</Col>

															{
																custom_fields.map((field, index) => {
																	return(
																		<Col lg={12} key={index}>
																			<Row>
																				<Col lg={4}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="product_code" style={{width: '100%', fontSize: 13}}>Name</Label>
																						<Input type="text" value={field.name} onChange={(e) => {
																							this.saveCustomField(e.target.value, index, 'name')
																						}}/>
																					</FormGroup>
																				</Col>
																				<Col lg={4}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="product_code" style={{width: '100%', fontSize: 13}}>Type</Label>
																						<Select options={config.CUSTOM_TYPE}
																							value={field.type}
																						    classNamePrefix={"react-select"}
																						        isSearchable={false}
																							onChange={(option) => {
																								this.saveCustomField(option, index, 'type')
																							}}
																						/>
																					</FormGroup>
																				</Col>
																				<Col lg={3}>
																					<FormGroup className="mb-3">
																						<Label htmlFor="product_code" style={{width: '100%', fontSize: 13}}>Required</Label>
																						<div className="d-flex align-items-center mt-2">
																							<AppSwitch className="mx-1 file-switch mr-3"
																								style={{width: 50, marginTop: 10}}
																								variant={'pill'}
																								color={'primary'}
																								checked={field.required}
																								onChange={(e) => {
																									this.saveCustomField(e.target.checked, index, 'required')
																								}}
																								size="sm"/>
																							<a onClick={(e) => this.deleteCustomField(e, index)} style={{fontSize: 20}}>
																								<i className="fas fa-trash"/></a>
																						</div>
																					</FormGroup>
																				</Col>
																			</Row>
																		</Col>
																	)
																})
															}

															<Col lg={12}>
																<FormGroup className="mb-3">
																	<Button color="default" onClick={this.addCustomField}>Add Custom Field</Button>
																</FormGroup>
															</Col>
														</Row>

														<hr className="mt-4"/>
														<Row>
															<Col lg={12}>
																<h4 className="mb-4 mt-2">Miscellaneous</h4>
															</Col>
														</Row>

														<Row>
															<Col lg={12}>
																<FormGroup className="mb-0">
																	<Label htmlFor="product_code" style={{width: '100%'}}>Webhook URLs <small className="font-italic">(optional)</small></Label>
																</FormGroup>
															</Col>

															{
																webhook_fields.map((field, index) => {
																	return(
																		<Col lg={12} key={index}>
																			<Row className="webhook-field">
																				<Col lg={11}>
																					<FormGroup className="mb-3">
																						<Input type="text" value={field}
																							placeholder="https://www.example.com/endpoint"
																							onChange={(e) => {
																							this.saveWebhookField(e.target.value, index)
																						}}/>
																					</FormGroup>
																				</Col>
																				<Col lg={1}>
																					<FormGroup className="mb-3">
																						<div className="d-flex align-items-center mt-2">
																							<a onClick={(e) => this.deleteWebhookField(e, index)} style={{fontSize: 20}}>
																								<i className="fas fa-trash"/>
																							</a>
																						</div>
																					</FormGroup>
																				</Col>
																			</Row>
																		</Col>
																	)
																})
															}

															<Col lg={12}>
																<FormGroup className="mb-3">
																	<Button color="default" onClick={this.addWebhookField}>Add webhook</Button>
																</FormGroup>
															</Col>
														</Row>

														<Row>
															<Col lg={6}>
																<FormGroup className="mb-3">
																	<Label htmlFor="product_code">Crypto Currency Confirmations</Label>
																	<DataSlider
																		domain={[0, 6]}
																		value={[props.values.crypto_confirmations]}
																		ticks={[0, 1, 2, 3, 4, 5, 6]}
																		receiveValue = {(value) => {
																			props.handleChange('crypto_confirmations')(value)
																		}}

																		className={'CCC'}
																	/>
																</FormGroup>
															</Col>
															<Col lg={6}>
																<FormGroup className="mb-3">
																	<Label htmlFor="product_code">
																		Max Risk Level&nbsp;&nbsp;
																		<span id="riskTooltip"><i className="fa fa-question-circle" /></span>
																	</Label>
																	<Tooltip
																		placement="right"
																		isOpen={this.state.riskTooltipOpen}
																		target="riskTooltip"
																		toggle={this.riskTooltipToggle}>
																		For now this feature is for development purposes only, it will serve in the future to determine if a customer could be a scammer or an high risk profile and therefore block non-crypto payments.
																	</Tooltip>
																	<DataSlider
																		domain={[0, 100]}
																		suffix="%"
																		value={[props.values.max_risk_level]}
																		ticks={[0, 50, 100]}
																		receiveValue = {(value) => {
																			props.handleChange('max_risk_level')(value)
																		}}
																	/>
																</FormGroup>
															</Col>
														</Row>
														<Row>
															<Col lg={12} className="d-flex flex-wrap">
																<FormGroup check inline className="mb-3 mr-4">
																	<div className="custom-checkbox custom-control">
																		<input
																			className="custom-control-input"
																			type="checkbox"
																			id="unlisted"
																			name="SMTP-auth"
																			checked={props.values.unlisted == 1}
																			onChange={(e) => {
																				props.handleChange('unlisted')(e.target.checked?1:0)
																			}}
																		/>
																		<label className="custom-control-label" htmlFor="unlisted">
																			Unlisted &nbsp;
																			<span id="unlistedTooltip"><i className="fa fa-question-circle" /></span>
																			<Tooltip placement="right" isOpen={unlistedTooltipOpen} target="unlistedTooltip"
																				toggle={this.unlistedTooltipToggle.bind(this)}>
																				The product wont be displayed on your Shop, but can still be accessed via direct URL.
																			</Tooltip>
																		</label>
																	</div>
																</FormGroup>
																<FormGroup check inline className="mb-3 mr-4">
																	<div className="custom-checkbox custom-control">
																		<input
																			className="custom-control-input"
																			type="checkbox"
																			id="private"
																			name="SMTP-auth"
																			checked={props.values.private == 1}
																			onChange={(e) => {
																				props.handleChange('private')(e.target.checked?1:0)
																			}}
																			/>
																		<label className="custom-control-label" htmlFor="private">
																			Private &nbsp;
																			<span id="privateTooltip"><i className="fa fa-question-circle" /></span>
																			<Tooltip placement="right" isOpen={privateTooltipOpen} target="privateTooltip"
																				toggle={this.privateTooltipToggle.bind(this)}>
																				Only you can access this product
																			</Tooltip>
																		</label>
																	</div>
																</FormGroup>
																<FormGroup check inline className="mb-3 mr-4">
																	<div className="custom-checkbox custom-control">
																		<input
																			className="custom-control-input"
																			type="checkbox"
																			id="block"
																			name="SMTP-auth"
																			checked={props.values.block_vpn_proxies == 1}
																			onChange={(e) => {
																				props.handleChange('block_vpn_proxies')(e.target.checked ? 1 : 0)
																			}}
																			/>
																		<label className="custom-control-label" htmlFor="block">
																			Block VPNs/Proxies &nbsp;
																			<span id="blockTooltip"><i className="fa fa-question-circle" /></span>
																			<Tooltip placement="right" isOpen={blockTooltipOpen} target="blockTooltip"
																				toggle={this.blockTooltipToggle.bind(this)}>
																				Block VPNs/Proxies
																			</Tooltip>
																		</label>
																	</div>
																</FormGroup>
																<FormGroup check inline className="mb-3 mr-4">
																	<div className="custom-checkbox custom-control">
																		<input
																			className="custom-control-input"
																			type="checkbox"
																			id="paypal-email"
																			name="SMTP-auth"
																			/>

																	</div>
																</FormGroup>
															</Col>
														</Row>
													</Col>
												</Row>
										}
									</CardBody>

									<Button color="primary" type="submit" className="" style={{ width: 200 }}>
										{loading ? <Spin/> : 'Save Product' }
									</Button>

								</Card>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		)
	}
}


const mapDispatchToProps = (dispatch) => ({
	commonActions: bindActionCreators(CommonActions, dispatch),
	actions: bindActionCreators(ProductActions, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateProduct)
