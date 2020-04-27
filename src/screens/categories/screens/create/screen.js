import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Form,
  Col,
  FormGroup,
  Label,
  Tooltip,
  Input
} from 'reactstrap'
import { Button } from 'components';
import Select from 'react-select'
import { Formik } from 'formik';
import * as Yup from "yup";
import { Spin, ImageUpload } from 'components'
import { Product } from 'screens'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import {
  CommonActions
} from 'services/global'


import * as Actions from '../../actions'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
    all_products: state.product.all_products
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch),
    productActions: bindActionCreators(Product.actions, dispatch),
    actions: bindActionCreators(Actions, dispatch)
  })
}

class CreateCategories extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      tooltipOpen: false,
      initialValues: {
        title: '',
        unlisted: 0,
        products_bound: '',
        image: '',
        sort_priority: 0
      },
      files: [],
      multiValue: []
    }

    this.handleMultiChange = this.handleMultiChange.bind(this);
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
    this.setState({tooltipOpen: !this.state.tooltipOpen})
  }

  addFile = file => {
    this.setState({
      files: file===null?file:file.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    });
  };

  handleSubmit(values) {
    this.setState({loading: true})
    this.props.actions.createCategory(values).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.props.history.goBack()
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.message)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  handleMultiChange(option) {
    this.setState(state => {
      return {
        multiValue: option
      };
    });
  }

  render() {
    const { loading, tooltipOpen, files, initialValues } = this.state
    const { all_products } = this.props

    const product_options = all_products.map(pro => {return {value: pro.uniqid, label: pro.title}})

    return (
      <div className="product-screen mt-3">
        <div className="animated fadeIn">
          <Breadcrumb className="mb-0">
            <BreadcrumbItem active className="mb-0">
              <a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Categories</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              this.handleSubmit(values)
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string()
                .required('Title is required'),
              products_bound: Yup.string()
                .required('Products is required'),
              sort_priority: Yup.number()
                .required("Sort Priority is required"),
              unlisted: Yup.boolean()
            })}>
              {props => (
                <Form onSubmit={props.handleSubmit}>
                  <Card>
                    <CardHeader>
                      <Row style={{alignItems: 'center'}}>
                        <Col md={12}>
                          <h1>New Category</h1>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody className="mb-4 pt-3 pb-3">
                      <Row>
                        <Col lg={3} className="p-0">
                          <div className="page_description_card bg-grey p-3 mr-2">
                            <h6 className="text-grey mb-3">REFERENCE</h6>
                            <p className="page_description text-grey mb-0">
                            Using Categories is a way to separate different types of products.
                            <br/>
                            <br/>
                            Unlike normal products, categories are displayed as smaller tabs above the search bar, they do not have an image.
                            <br/>
                            <br/>
                            Once selected, every other product that does not belong to that category will disappear with a super cool animation and the customer will be able to better see what he wants to purchase.
                            <br/>
                            <br/>
                            In order to create a category, please fill its title, select which products should be contained in it and then, you can proceed!
                            </p>
                          </div>
                        </Col>
                        <Col lg={9}>
                          <Row>
                            <Col lg={12}>
                              <FormGroup className="mb-3 mt-3">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                  type="text"
                                  id="title"
                                  name="title"
                                  placeholder="Enter Category Title"
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
                            <Col lg={2}>
                              <FormGroup className="mb-3">
                                <Label htmlFor="sort_priority">Priority</Label>
                                <Input
                                  type="number"
                                  id="sort_priority"
                                  name="sort_priority"
                                  placeholder="Sort Priority"
                                  onChange={props.handleChange}
                                  value={props.values.sort_priority}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12}>
                              <FormGroup check inline className="mb-3">
                                  <div className="custom-checkbox custom-control">
                                    <input 
                                      className="custom-control-input"
                                      type="checkbox"
                                      id="inline-radio1"
                                      name="SMTP-auth"
                                      onChange={(e) => {
                                        props.handleChange('unlisted')(e.target.checked)
                                      }}
                                      checked={props.values.unlisted}
                                    />
                                    <label className="custom-control-label" htmlFor="inline-radio1">
                                      Unlisted &nbsp;<span href="#" id="unlistedTooltip"><i className="fa fa-question-circle"></i></span>
                                      <Tooltip placement="right" isOpen={tooltipOpen} target="unlistedTooltip" 
                                        toggle={this.unlistedTooltipToggle.bind(this)}>
                                        This category won't be shown on your user profile page
                                      </Tooltip>
                                    </label>
                                  </div>
                                </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                    <Button color="primary" type="submit" style={{width: 200}} disabled={loading}
                    >{loading ?<Spin/>:'Save Category' }</Button>                   
                  </Card>
                </Form> )}
              </Formik>
            </div>  
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCategories)
