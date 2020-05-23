import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col, FormGroup, Form, Label, Tooltip, Input, BreadcrumbItem, Breadcrumb } from 'components/reactstrap'
import Select from 'react-select'
import { Loader, ImageUpload, Button, Spin } from 'components'
import * as ProductActions from '../../actions'
import { Formik } from 'formik';
import { getProductList } from '../../../product/actions'
import object from "yup/lib/object";
import string from "yup/lib/string";
import number from "yup/lib/number";
import { CommonActions } from 'services/global'
import Reference from '../reference'

import './style.scss'

const Yup = {
	object,
	string,
	number
}


class CreateProductGroup extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			unlistedTooltipOpen: false,
			images: [],
			initialValues: {
				title: "",
				unlisted: 0,
				products_bound: '',
				sort_priority: 1
			}
		}
	}

	componentDidMount() {
		this.props.getProductList()
			.catch(err => {
				this.props.tostifyAlert('error', err.error || err.message)
			})
	}

	unlistedTooltipToggle() {
		this.setState({ unlistedTooltipOpen: !this.state.unlistedTooltipOpen })
	}

	addImages = image => {
		this.setState({
			images: image.map(image =>
				Object.assign(image, {
					preview: URL.createObjectURL(image)
				})
			)
		});
	};

	handleSubmit = (values) => {
		this.setState({loading: true})

		values.unlisted = values.unlisted ? true : false
		values.sort_priority = values.sort_priority || 1
		this.props.createProductGroup(values)
			.then(res => {
				this.props.tostifyAlert('success', res.message)
				this.props.history.goBack()
			}).catch(err => {
				this.props.tostifyAlert('error', err.error)
			}).finally(() => {
				this.setState({loading: false})
			})
	}


	render() {

		const { loading, unlistedTooltipOpen, images, initialValues, multiValue } = this.state;
		const { products, history } = this.props;

		const product_options = products
			.filter(({ unlisted }) => !Number(unlisted))
			.map(({ uniqid: value, title: label }) => ({ value, label }))

		const validationSchema = Yup.object().shape({
			title: Yup.string().required('Title is required'),
			products_bound: Yup.string().required('Products is required'),
		});

		return (
			<div className="create-product-screen mt-3">
				<div className="animated fadeIn">

					<Breadcrumb className="mb-0">
						<BreadcrumbItem active className="mb-0">
							<a onClick={(e) => history.goBack()}><i className="fas fa-chevron-left"/> Products</a>
						</BreadcrumbItem>
					</Breadcrumb>

					<Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={validationSchema}>
						{props => (
							<Form onSubmit={props.handleSubmit}>
								<Card>

									<CardHeader>
										<Row className={"align-items-center"}>
											<Col md={12}>
												<h1>New Product Group</h1>
											</Col>
										</Row>
									</CardHeader>

									<CardBody className="p-4 mb-5 ">
										{loading && <Row><Col lg={12}><Loader /></Col></Row>}
										{!loading &&
											<Row>
											<Reference />
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
																className={props.errors.title && props.touched.title ? "is-invalid" : ""}
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
																id="product_bounds"
																name="product_bounds"
																classNamePrefix={"react-select"}
																closeMenuOnSelect={false}
																isMulti
																options={product_options}
																placeholder="Select Products"
																value={(multiValue || [])}
																ref={ref => (this.select = ref)}
																onBlur={() => {
																	this.select.setState({ isOpen: true });
																}}
																onChange={(multiValue) => {
																	this.setState({
																		multiValue: multiValue || []
																	})

																	props.handleChange("products_bound")((multiValue || []).map(({ value }) => value).toString());
																}}
																className={props.errors.products_bound && props.touched.products_bound ? "is-invalid" : ""}
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
															<div>
																<Label htmlFor="sort_priority">Priority</Label>
																<p className={"mb-2 text-grey"} style={{ fontSize: ".7rem"}}>
																	This will be used to sort the group in your shop page with an ascending order.
																</p>
															</div>
															<Input
																type="number"
																id="sort_priority"
																name="sort_priority"
																placeholder="Example: 1"
																onChange={props.handleChange}
																value={props.values.sort_priority}
															/>
														</FormGroup>
													</Col>
												</Row>

												<Row>
													<Col lg={12}>
														<FormGroup className="mb-3">
															<Label htmlFor="product_code">Image <small className="font-italic">(optional)</small></Label>
															<ImageUpload addFile={(file) => {props.handleChange('image')(file[0]);this.addImages(file)}} files={images}/>
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
																	checked={+props.values.unlisted}
																	onChange={(e) => {
																		props.handleChange('unlisted')(e.target.checked)
																	}}
																/>
																<label className="custom-control-label" htmlFor="unlisted">
																	Unlisted &nbsp;
																	<span id="unlistedTooltip"><i className="fa fa-question-circle" /></span>
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
										{loading ? <Spin /> : "Save Product Group"}
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


const mapStateToProps = ({ product }) => ({ products: product.all_products })
const mapDispatchToProps = (dispatch) => ({
	tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
	getProductList: bindActionCreators(getProductList, dispatch),
	createProductGroup: bindActionCreators(ProductActions.createProductGroup, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductGroup)
