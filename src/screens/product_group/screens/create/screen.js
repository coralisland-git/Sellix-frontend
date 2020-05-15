import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	FormGroup,
	Form,
	Label,
	Tooltip,
	Input
} from 'reactstrap'
import Select from 'react-select'
import 'react-quill/dist/quill.snow.css';
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

import { Loader, ImageUpload, Button } from 'components'
import * as ProductActions from '../../actions'
import { Formik } from 'formik';
import * as Yup from "yup";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { Product } from 'screens'

import { CommonActions } from 'services/global'

import './style.scss'



const mapDispatchToProps = (dispatch) => {
	return ({
		commonActions: bindActionCreators(CommonActions, dispatch),
		productActions: bindActionCreators(Product.actions, dispatch),
		actions: bindActionCreators(ProductActions, dispatch)
	})
}

const mapStateToProps = (state) => {
	return ({
	  all_products: state.product.all_products
	})
  }

const converter = new Showdown.Converter({
	tables: true,
	simplifiedAutoLink: true,
	strikethrough: true,
	tasklists: true,
	simpleLineBreaks: true
});

const TYPE_OPTIONS = [
	{ value: 'file', label: 'File' },
	{ value: 'serials', label: 'Serials' },
	{ value: 'service', label: 'Service' },
]

const DELIMITER_OPTIONIS = [
	{ value: 'comma', label: 'Comma' },
	{ value: 'newline', label: 'New Line' },
	{ value: 'custom', label: 'Custom' }
]

const CUSTOM_TYPE = [
	{ value: 'number', label: 'Number' },
	{ value: 'text', label: 'Text' },
	{ value: 'hidden', label: 'Hidden' },
	{ value: 'largetextbox', label: 'Large Textbox' },
	{ value: 'checkbox', label: 'Checkbox' },
]


class CreateProductGroup extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			unlistedTooltipOpen: false,
			privateTooltipOpen: false,
			blockTooltipOpen: false,
			paypalTooltipOpen: false,
			selectedTab: 'write',
			files: [],
			images: [],
			initialValues: {
				title: "",
				unlisted: 0,
				products_bound: '',
				sort_priority: 1
			},
			showFileStock: false,
			showServiceStock: false,
			gateways: {},
			type: TYPE_OPTIONS[0],
			delimiter: DELIMITER_OPTIONIS[0],
			custom_fields: []
		}

		this.addCustomField = this.addCustomField.bind(this)
		this.deleteCustomField = this.deleteCustomField.bind(this)
		this.saveCustomField = this.saveCustomField.bind(this)
	}

	componentWillUnmount() {
		// Make sure to revoke the data uris to avoid memory leaks
		this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
	}

	componentDidMount() {
		this.props.productActions.getProductList().catch(err => {
			console.log(err)
		})
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


	/**  Custom Fields **/

	addCustomField() {
		const custom_fields = Object.assign([], this.state.custom_fields)
		custom_fields.push({name: '', type: CUSTOM_TYPE[0], required: false})

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


	handleSubmit(values) {
		this.setState({loading: true})

		this.props.actions.createProductGroup(values).then(res => {
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

	render() {
		const { 
			loading, 
			unlistedTooltipOpen, 
			privateTooltipOpen,
			blockTooltipOpen,
			paypalTooltipOpen,
			files, 
			images,
			showFileStock,
			showServiceStock,
			editorState,
			selectedTab,
			initialValues,
			type,
			delimiter,
			custom_fields
		} = this.state

		const { all_products } = this.props

		const product_options = all_products.map(pro => {return {value: pro.uniqid, label: pro.title}})

		return (
			<div className="create-product-screen mt-3">
				<div className="animated fadeIn">

					<Breadcrumb className="mb-0">
						<BreadcrumbItem active className="mb-0">
							<a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Products</a>
						</BreadcrumbItem>
					</Breadcrumb>

					<Formik
							initialValues={initialValues}
							onSubmit={(values) => {
								this.handleSubmit(values)
							}}
							validationSchema={Yup.object().shape({
								title: Yup.string().required('Title is required'),
								unlisted: Yup.number(),
								sort_priority: Yup.number(),
								products_bound: Yup.string().required('Products is required'),
							})}>
								{props => (
									<Form onSubmit={props.handleSubmit}>
										<Card>

											<CardHeader>
												<Row style={{alignItems: 'center'}}>
													<Col md={12}>
														<h1>New Product Group</h1>
													</Col>
												</Row>
											</CardHeader>

											<CardBody className="p-4 mb-5 ">
												{
													loading ?
														<Row>
															<Col lg={12}>
																<Loader />
															</Col>
														</Row>
													:
														<Row>
															<Col lg={3} className="p-0">
																<div className="page_description_card bg-grey p-3 mr-2">
                                                                    <h6 className="text-grey mb-3">REFERENCE</h6>
                                                                    <p className="page_description text-grey">
                                                                    Product Groups let you organize all your items in your shop page.
                                                                    <br/>
                                                                    <br/>
                                                                    They are displayed like normal products, with a card containing the image chosen, a group badge and the starting price for the cheapest product in it.
                                                                    <br/>
                                                                    <br/>
                                                                    Once selected, a menu will be prompted asking to choose one of the products the group has, then the customer will be redirected to the classic purchase product page.
                                                                    <br/>
                                                                    <br/>
                                                                    In order to create a group, please fill its Title, select which products should be contained in it and give it an image!
                                                                    </p>
                                                                </div>
															</Col>
															<Col lg={9} className="mt-3">
																<Row>
																	<Col lg={12}>
																		<FormGroup className="mb-3">
																			<Label htmlFor="title">Title</Label>
																			<Input
																				type="text"
																				id="title"
																				name="title"
																				placeholder="Title"
																				onChange={props.handleChange}
																				value={props.values.title}
																				className={
																					props.errors.title && props.touched.title
																						? "is-invalid"
																						: ""
																				}
																			/>
																			{props.errors.title && props.touched.title && (
																				<div className="invalid-feedback">{props.errors.title}</div>
																			)}
																		</FormGroup>
																	</Col>
																</Row>

																<Row>
																	<Col lg={12}>
																	<FormGroup className="mb-3">
																		<Label htmlFor="product_bounds">Products</Label>
																		<Select
																		className="select-default-width"
																		id="product_bounds"
																		name="product_bounds"
																		classNamePrefix={"react-select"}
																		isMulti
																		options={product_options}
																		placeholder="Select Products"
																		value={this.state.multiValue}
																		onChange={(option) => {
																			this.setState({
																			multiValue: option
																			})

																			props.handleChange("products_bound")(option.map(o => o.value).toString());
																		}}
																		className={
																			props.errors.products_bound && props.touched.products_bound
																			? "is-invalid"
																			: ""
																		}
																		/>
																		{props.errors.products_bound && props.touched.products_bound && (
																		<div className="invalid-feedback">{props.errors.products_bound}</div>
																		)}
																	</FormGroup>
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
																					checked={props.values.unlisted == 1?true:false}
																					onChange={(e) => {
																						props.handleChange('unlisted')(e.target.checked?1:0)
																					}}
																				/>
																				<label className="custom-control-label" htmlFor="unlisted">
																					Unlisted &nbsp;
																					<span href="#" id="unlistedTooltip"><i className="fa fa-question-circle"></i></span>
																					<Tooltip placement="right" isOpen={unlistedTooltipOpen} target="unlistedTooltip" 
																						toggle={this.unlistedTooltipToggle.bind(this)}>
																						The product group wont be displayed on your Shop, but can still be accessed via direct URL.
																					</Tooltip>
																				</label>
																			</div>
																		</FormGroup>
																		
																	</Col>
																</Row>
															</Col>
														</Row>
												}
											</CardBody>

											<Button color="primary" type="submit" className="" style={{width: 200}}>
												Save Product Group
											</Button>
											
										</Card>
									</Form> )}
							</Formik>
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductGroup)
