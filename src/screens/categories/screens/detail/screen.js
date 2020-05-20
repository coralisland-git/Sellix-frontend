import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Form, Col, FormGroup, Label, Tooltip, Input, Breadcrumb, BreadcrumbItem } from 'components/reactstrap'
import Select from 'react-select'
import { Formik } from 'formik';
import { Button } from 'components';
import { Spin, Loader } from 'components'
import { Product } from 'screens'
import { CommonActions } from 'services/global'
import * as CategoryActions from '../../actions'
import Reference from '../reference'
import object from "yup/lib/object";
import string from "yup/lib/string";
import number from "yup/lib/number";

import './style.scss'

const Yup = {
  object,
  string,
  number
}


class EditCategory extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      saving: false,
      tooltipOpen: false,
      initialData: {
        title: '',
        unlisted: 0,
        products_bound: '',
        sort_priority: 1
      },
      selected_products: []
    }

    this.id = this.props.match.params.id
  }

  unlistedTooltipToggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  }

  handleSubmit = (values) => {
    this.setState({saving: true})
    const { selected_products } = this.state

    values.unlisted = values.unlisted ? true : false
    values.sort_priority = values.sort_priority || 1;
    values.products_bound = selected_products.map(o => o.value).toString()
    this.props.actions.editCategory(values).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.props.history.goBack()
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.message)
    }).finally(() => {
      this.setState({saving: false})
    })
  }

  componentDidMount() {
    if (this.id) {
      this.setState({ loading: true });
      this.props.actions.getCategoryByID(this.id).then(res => {
        this.setState({
          initialData: {
            ...res.data.category,
            unlisted: +res.data.category.unlisted
          }
        })
      }).finally(() => {
        this.props.productActions.getProductList().then(res => {
          this.setState({
            selected_products: this.state.initialData.products_bound.map(pro => {return {value: pro.uniqid, label:pro.title}})
          })
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.setState({loading: false})
        })
      })
    }
  }

  render() {
    const { loading, tooltipOpen, initialData, saving } = this.state

    const { products } = this.props;
    const product_options = products
        .filter(({ unlisted }) => !Number(unlisted))
        .map(pro => {return {value: pro.uniqid, label: pro.title}})

    const validationSchema = Yup.object().shape({
      title: Yup.string().required('Title is required'),
      products_bound: Yup.string().required('Products is required')
    });

    return (
      <div className="product-screen mt-3">
        <div className="animated fadeIn">
            <Breadcrumb className="mb-0">
              <BreadcrumbItem active className="mb-0">
                <a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Categories</a>
              </BreadcrumbItem>
            </Breadcrumb>
          <Formik initialValues={initialData} enableReinitialize={true} onSubmit={this.handleSubmit} validationSchema={validationSchema}>
              {props => (
                <Form onSubmit={props.handleSubmit}>
                  <Card>
                    <CardHeader>
                      <Row className={"align-items-center"}>
                        <Col md={12}>
                          <h1>Edit Category</h1>
                        </Col>
                      </Row>
                    </CardHeader>

                    <CardBody className="mb-4 pt-3 pb-3">
                      {loading && <Loader />}
                      {!loading &&
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
                                      classNamePrefix={"react-select"}
                                      id="product_bounds"
                                      name="product_bounds"
                                      closeMenuOnSelect={false}
                                      isMulti
                                      options={product_options}
                                      placeholder="Select Products"
                                      value={this.state.selected_products}
                                      onChange={(option) => {
                                        console.log(option)
                                        this.setState({
                                          selected_products: option || []
                                        })

                                        props.handleChange("products_bound")((option || []).map(o => o.value).toString());
                                      }}
                                      className={props.errors.products_bound && props.touched.products_bound ? "is-invalid" : ""}
                                    />
                                    {props.errors.products_bound && props.touched.products_bound && <div className="invalid-feedback">{props.errors.products_bound}</div>}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12}>
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
                                          Unlisted &nbsp;<span id="unlistedTooltip"><i className="fa fa-question-circle" /></span>
                                          <Tooltip placement="right" isOpen={tooltipOpen} target="unlistedTooltip" 
                                            toggle={this.unlistedTooltipToggle}>
                                            This product won't show on your user profile page
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

                    <Button color="primary" type="submit" className="" style={{width: 200}} disabled={loading || saving}>
                      {saving ?<Spin/>:'Save Category' }
                    </Button>
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
  productActions: bindActionCreators(Product.actions, dispatch),
  actions: bindActionCreators(CategoryActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCategory)
