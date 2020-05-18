import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col, FormGroup, Form, Label, Tooltip, Input, BreadcrumbItem, Breadcrumb } from 'components/reactstrap'
import Select from 'react-select'
import { Loader, ImageUpload, Button } from 'components'
import * as ProductGroupActions from '../../actions'
import { Formik } from 'formik';
import * as Yup from "yup";
import config from 'constants/config'

import { Product } from 'screens'

import { CommonActions } from 'services/global'

import './style.scss'


const user = window.localStorage.getItem('userId')

class EditProductGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            unlistedTooltipOpen: false,
            images: [],
            initialValues: {
                title: "",
                unlisted: 0,
                products_bound: '',
                sort_priority: null
            }
        }

        this.id = this.props.match.params.id
    }


    componentDidMount() {
        this.props.getProductList().catch(err => {
            console.log(err)
        })

        if (this.id) {
            this.setState({ loading: true });
            this.props.getProductGroupByID(this.id)
                .then(({ data: { group }}) => {

                    this.setState({
                        initialValues: {
                            ...group,
                            unlisted: +group.unlisted,
                            products_bound: group.products_bound.map(x => x.uniqid).join(',')
                        },
                        images: group.image_attachment ? [{ preview: config.API_ROOT_URL+'/attachments/image/'+group.image_attachment }] : [],
                        multiValue: group.products_bound.map(({ uniqid: value, title: label }) => ({ value, label }))
                    })
                }).finally(() => {
                this.setState({loading: false})
            })
        }
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
        this.props.editProductGroup(values).then(res => {

            this.props.history.push(`/dashboard/${user}/groups`)
            this.props.tostifyAlert('success', res.message)

        }).catch(err => {
            this.props.tostifyAlert('error', err.error)
        }).finally(() => {
            this.setState({loading: true})
        })
    }


    render() {
        const { loading, unlistedTooltipOpen, images, initialValues, multiValue } = this.state;

        const product_options = this.props.all_products.map(({ uniqid: value, title: label }) => ({ value, label }));

        const validationSchema = Yup.object().shape({
            title: Yup.string().required('Title is required'),
            sort_priority: Yup.number().required('Priority is required'),
            products_bound: Yup.string().required('Products is required'),
        })
        return (
            <div className="create-product-screen mt-3">
                <div className="animated fadeIn">
                    <Breadcrumb className="mb-0">
                        <BreadcrumbItem active className="mb-0">
                            <a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Product Groups</a>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={validationSchema} enableReinitialize={true}>
                        {props => (
                            <Form onSubmit={props.handleSubmit}>
                                <Card>

                                    <CardHeader>
                                        <Row style={{alignItems: 'center'}}>
                                            <Col md={12}>
                                                <h1>Edit Product Group</h1>
                                            </Col>
                                        </Row>
                                    </CardHeader>

                                    <CardBody className="p-4 mb-5 ">
                                        {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                                        {!loading &&
                                            <Row>
                                            <Col lg={3} className="p-0">
                                                <div className="page_description_card bg-grey p-3 mr-2">
                                                    <h6 className="text-grey mb-3">REFERENCE</h6>
                                                    <p className="page_description text-grey">
                                                        Product Groups let you organize all your items in your
                                                        shop page.
                                                        <br/>
                                                        <br/>
                                                        They are displayed like normal products, with a card
                                                        containing the image chosen, a group badge and the
                                                        starting price for the cheapest product in it.
                                                        <br/>
                                                        <br/>
                                                        Once selected, a menu will be prompted asking to choose
                                                        one of the products the group has, then the customer
                                                        will be redirected to the classic purchase product page.
                                                        <br/>
                                                        <br/>
                                                        In order to create a group, please fill its Title,
                                                        select which products should be contained in it and give
                                                        it an image!
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
                                                                className={props.errors.title && props.touched.title ? "is-invalid" : ""}
                                                            />
                                                            {props.errors.title && props.touched.title && (<div className="invalid-feedback">{props.errors.title}</div>)}
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
                                                                        multiValue
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
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="title">Priority</Label>
                                                            <Input
                                                                type="number"
                                                                id="sort_priority"
                                                                name="sort_priority"
                                                                placeholder="Sort Priority"
                                                                onChange={props.handleChange}
                                                                value={props.values.sort_priority}
                                                                className={props.errors.sort_priority && props.touched.sort_priority ? "is-invalid" : ""}
                                                            />
                                                            {props.errors.sort_priority && props.touched.sort_priority && (
                                                                <div className="invalid-feedback">{props.errors.sort_priority}</div>
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col lg={12}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="product_code">Image <small className="font-italic">(optional)</small></Label>
                                                            <ImageUpload addFile={(file) => { props.handleChange('image')(file[0]); this.addImages(file) }} files={images}/>
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
                                                                    <Tooltip placement="right"
                                                                             isOpen={unlistedTooltipOpen}
                                                                             target="unlistedTooltip"
                                                                             toggle={this.unlistedTooltipToggle.bind(this)}>
                                                                        The product group wont be displayed on
                                                                        your Shop, but can still be accessed via
                                                                        direct URL.
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
                            </Form>
                        )}
                    </Formik>

                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    all_products: state.product.all_products
})
const mapDispatchToProps = (dispatch) => ({
    tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
    getProductList: bindActionCreators(Product.actions.getProductList, dispatch),
    editProductGroup: bindActionCreators(ProductGroupActions.editProductGroup, dispatch),
    getProductGroupByID: bindActionCreators(ProductGroupActions.getProductGroupByID, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductGroup)
