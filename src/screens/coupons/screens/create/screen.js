import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import map from "lodash/map"
import some from "lodash/some"
import remove from "lodash/remove"
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
} from 'reactstrap'
import { Button } from 'components';
import Select from 'react-select'
import { Formik } from 'formik'
import { Loader, DataSlider } from 'components'
import { createCoupon } from './actions'
import { getCoupons } from '../../actions'
import { editCoupon } from '../detail/actions'
import { getProducts, getCouponByID } from './actions'
import {
  CommonActions
} from 'services/global'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import './style.scss'
var random = require('random-letters');
const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    coupons: map(state.coupons.coupons, coupon => ({
      ...coupon,
      discount_value: [+coupon.discount]
    })),
    products: [{ label: 'All products', value: ''}, ...map(state.coupons.products, product => ({label: product.title, value: product.uniqid})) ]
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getCoupons }, dispatch),
    editCoupon: bindActionCreators(editCoupon, dispatch),
    createCoupon: bindActionCreators(createCoupon, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
    getProducts: bindActionCreators(getProducts, dispatch),
    getCouponByID: bindActionCreators(getCouponByID, dispatch)
  })
}

class CreateCoupon extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      tooltipOpen: false,
      files: [],
      codeFromGenerator: null,
      currentCouponData: null
    }
  }

  componentDidMount() {
    if(this.isEdit()) {
      this.setState({ loading: true })
      this.props.getCouponByID(this.props.match.params.id).then(res => {
        this.setState({currentCouponData: res.data.coupon})
      }).finally(() => {
        this.setState({loading: false})
      })
    }
    
    this.props.getProducts()
  }

  isEdit = () => {
    return this.props.match.params.id
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
  }

  unlistedTooltipToggle() {
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  }

  handleSubmit(values) {
    this.setState({ loading: true })
    const newValues = {
      ...values,
      products_bound: map(values.products_bound, item => item.value).join(','),
      max_uses: values.max_uses ? values.max_uses : -1
    }
    const createOrEditPromise = this.isEdit()
      ? this.props.editCoupon({ ...newValues, uniqid: this.props.match.params.id })
      : this.props.createCoupon(newValues)
    createOrEditPromise.then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.props.history.push({
        pathname: `/dashboard/${user}/coupons/`
      })
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || err.message)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render() {
    const { loading, currentCouponData } = this.state
    

    let initialValues = (this.isEdit() && currentCouponData)
      ? { ...currentCouponData, discount_value: [currentCouponData.discount], products_bound: currentCouponData.products_bound.length === 0 ? [''] : currentCouponData.products_bound.map(id => this.props.products.find(p => p.value === id))}
      : { discount_value: [50] }
    return (
      <div className="product-screen mt-3">
        <div className="animated fadeIn">
          <Breadcrumb className="mb-0">
						<BreadcrumbItem active className="mb-0">
							<a onClick={(e) => this.props.history.goBack()}><i className="fas fa-chevron-left"/> Coupons</a>
						</BreadcrumbItem>
					</Breadcrumb>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={(values) => {
              this.handleSubmit(values)
            }}>{props => (
              <Form onSubmit={props.handleSubmit}>
                <Card>
                  <CardHeader>
                    <Row style={{ alignItems: 'center' }}>
                      <Col md={12}>
                        <h1>{this.isEdit()?'Edit Coupon':'New Coupon'}</h1>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="mb-4">
                    {
                      loading ?
                        <Row>
                          <Col lg={12}>
                            <Loader />
                          </Col>
                        </Row>
                        :
                        <Row className="mt-2 mb-2">
                          <Col lg={12}>
                            <Row>
                              <Col lg={12}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="product_code">Code</Label>
                                  <div className="d-flex">
                                    <Input
                                      // type="number" 
                                      name="code"
                                      placeholder="Coupon code"
                                      onChange={props.handleChange}
                                      value={props.values.code}
                                    />
                                    <Button onClick={() => props.setFieldValue('code', random(16))} color="primary" style={{marginLeft: -15}}>Generate</Button>
                                  </div>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="product_code">Discount</Label>
                                  <DataSlider
                                    domain={[1, 100]}
                                    ticks={[1, 50, 100]}
                                    suffix="%"
                                    name="discount_value"
                                    receiveValue={(value) => {
                                      props.setFieldValue('discount_value', [value])
                                    }}
                                    value={props.values.discount_value}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12}>
                                <FormGroup className="mb-4">
                                  <Label htmlFor="product_code">Products</Label>
                                  <Select
                                    className="select-default-width"
                                    id="products_bound"
                                    isMulti
                                    classNamePrefix={"react-select"}
                                    options={this.props.products}
                                    name="products_bound"
                                    placeholder="Select Products"
                                    onChange={(options) => {
                                      let newOptions = []
                                      const oldHaveAll = some(props.values.products_bound, option => option.value === '')
                                      const newHaveAll = some(options, option => option.value === '')
                                      const newHaveSome = some(options, option => option.value != '')
                                      if (oldHaveAll) {
                                        if (newHaveSome) {
                                          newOptions = remove(options, option => option.value != '')
                                        } else {
                                          newOptions = options
                                        }
                                      } else {
                                        if (newHaveAll) {
                                          newOptions = remove(options, option => option.value === '')
                                        } else {
                                          newOptions = options
                                        }
                                      }
                                      props.setFieldValue('products_bound', newOptions  )
                                    }}
                                    value={props.values.products_bound}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="product_code">Max Number of Uses</Label>
                                  <Input
                                    type="number"
                                    name="max_uses"
                                    placeholder="Leave blank for unlimited"
                                    onChange={props.handleChange}
                                    value={props.values.max_uses === '-1' ? "" : props.values.max_uses}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                    }
                  </CardBody>
                  <Button color="primary" className="" style={{ width: 200 }}>Save Coupon</Button>

                </Card>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCoupon)
