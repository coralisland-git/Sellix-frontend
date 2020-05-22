import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Form, Col, FormGroup, Label, Tooltip, Input, Breadcrumb, BreadcrumbItem } from 'components/reactstrap'
import { Spin, Button } from 'components';
import Select from 'react-select'
import { Formik } from 'formik';
import { getProductList } from '../../../product/actions'
import { CommonActions } from 'services/global'
import * as Actions from '../../actions'
import Reference from '../reference'
import object from "yup/lib/object";
import string from "yup/lib/string";
import number from "yup/lib/number";

import './style.scss'

const Yup = {
  object,
  string,
  number,
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
        sort_priority: 1
      },
      multiValue: []
    }
  }

  componentDidMount() {
    this.props.getProductList().catch(err => {
      console.log(err)
    })
  }

  unlistedTooltipToggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  }

  handleSubmit = (values) => {
    this.setState({ loading: true })

    values.unlisted = values.unlisted ? true : false;
    values.sort_priority = values.sort_priority || 1;

    this.props.actions.createCategory(values).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.props.history.goBack()
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.message)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  handleMultiChange = (option) => {
    this.setState(state => {
      return {
        multiValue: option
      };
    });
  }

  render() {
    const { loading, tooltipOpen, initialValues } = this.state
    const { products } = this.props

    const product_options = products
        .filter(({ unlisted }) => !Number(unlisted))
        .map(pro => {return {value: pro.uniqid, label: pro.title}})

    const validationSchema = Yup.object().shape({
      title: Yup.string().required('Title is required'),
      products_bound: Yup.string().required('Products is required')
    })

    return (
      <div className="product-screen mt-3">
        <div className="animated fadeIn">

          <Breadcrumb className="mb-0">
            <BreadcrumbItem active className="mb-0">
              <a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Categories</a>
            </BreadcrumbItem>
          </Breadcrumb>

          <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={validationSchema}>
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
                        <Reference />
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
                                  className={props.errors.title && props.touched.title ? "is-invalid" : ""}
                                />
                                {props.errors.title && props.touched.title && <div className="invalid-feedback">{props.errors.title}</div>}
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
                                  value={this.state.multiValue}
                                  onChange={(option) => {
                                    this.setState({
                                      multiValue: option || []
                                    })

                                    props.handleChange("products_bound")((option || []).map(o => o.value).toString());
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
                                  <p className={"mb-2 text-grey"} style={{ fontSize: ".7rem" }}>
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
                                      Unlisted &nbsp;<span id="unlistedTooltip"><i className="fa fa-question-circle" /></span>
                                      <Tooltip placement="right" isOpen={tooltipOpen} target="unlistedTooltip" 
                                        toggle={this.unlistedTooltipToggle}>
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


const mapStateToProps = ({ product }) => ({
  products: product.all_products
})

const mapDispatchToProps = (dispatch) => ({
  commonActions: bindActionCreators(CommonActions, dispatch),
  getProductList: bindActionCreators(getProductList, dispatch),
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateCategories)
