import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap'
import {
  CommonActions
} from 'services/global'
import { Formik } from 'formik';
import { Spin, Loader } from 'components'
import * as Yup from "yup";
import * as Showdown from "showdown";
import shop_brand from 'assets/images/brand/shop_brand.png'


import bitcoinIcon from 'assets/images/crypto/btc.svg'
import paypalIcon from 'assets/images/crypto/paypal.svg'
import litecoinIcon from 'assets/images/crypto/ltc.svg'
import ethereumIcon from 'assets/images/crypto/eth.svg'
import perfectmoneyIcon from 'assets/images/crypto/perfectmoney.svg'
import backIcon from 'assets/images/back.png'
import editIcon from 'assets/images/edit.png'
import stripeIcon from 'assets/images/crypto/stripe.svg'
import bitcoincashIcon from 'assets/images/crypto/bitcoincash.svg'
import skrillIcon from 'assets/images/crypto/skrill.svg'
import sellixLogoIcon from 'assets/images/Sellix_logo.svg'

import './style.scss'

const mapStateToProps = (state) => {
  return ({
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}


const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    simpleLineBreaks: true
});


const PAYMENT_ICONS = {
    paypal: paypalIcon,
    bitcoin: bitcoinIcon,
    litecoin: litecoinIcon,
    ethereum: ethereumIcon,
    perfectmoney: perfectmoneyIcon,
    stripe: stripeIcon,
    bitcoincash: bitcoincashIcon,
    skrill: skrillIcon
}
  

const CURRENCY_LIST = { 
  'USD': '$',
  'EUR': '€',
  'AUD': '$',
  'GBP': '£',
  'JPY': '¥',
  'CAD': '$',
  'CHF': '₣',
  'CNY': '¥',
  'SEK': 'kr',
  'NZD': '$'
}


const PAYMENT_LABELS = {
  'paypal': 'PayPal',
  'bitcoin': 'Bitcoin',
  'litecoin': 'Litecoin',
  'ethereum': 'Ethereum',
  'stripe': 'Stripe',
  'perfectmoney': 'Perfect Money',
  'bitcoincash': 'Bitcoin Cash',
  'skrill': 'Skrill'
}

class EmbededPayment extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      sending: false,
      loading: false,
      openCoupon: false,
      gateway: null,
      showQuantityOption: true,
      showPaymentOptions: false,
      quantity: 1,
      paymentoptions: [],
      email: null,
      coupon_code: '',
      product_id: this.props.match.params.id,
      custom_fields: {},
      product_info: {},
      optParam: 'PayPal'
    }
  }

  handleSubmit(values) {
    const data = Object.assign({}, this.state)
    delete data['sending']
    delete data['loading']
    delete data['showPaymentOptions']
    delete data["product_info"]
    delete data["openCoupon"]

    data['custom_fields'] = JSON.stringify({custom_fields: this.state.custom_fields})
    data['gateway'] = data['gateway'].toLowerCase()
    data['email'] = values.email

    this.setState({sending: true})
    this.props.commonActions.createInvoice(data).then(res => {
      this.props.commonActions.tostifyAlert('success', 'Invoice is created successfully.')
      this.props.history.push({
        pathname: `/ivembed/${res.data.invoice.uniqid}`
      })
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({sending: false})
    })
  }

  setCustomFields(key, value) {
    this.setState({
      custom_fields: {...this.state.custom_fields, [key]:value}
    })
  }

  showPaymentOptions(){
    this.setState({
      showPaymentOptions: true
    })
  }

  showPaymentOptions() {
    this.setState({
      showPaymentOptions:true
    })
  }

  setPaymentOptions(e, opt) {
    if(opt == null)
      opt = 'PayPal'
    this.setState({
      gateway: opt
    })
  }

  increaseCount() {
    const { product_info } = this.state
    if((product_info.type == 'serials' && product_info.quantity_max != -1 && this.state.quantity >= product_info.stock) || 
      (product_info.type == 'serials' && product_info.quantity_max == -1 && this.state.quantity >= product_info.stock)) {
      return true
    }

    if(product_info.type == 'file' &&  product_info.file_stock != -1 && this.state.quantity >= product_info.file_stock) {
      return true
    }

    if(product_info.type == 'service' &&  product_info.service_stock != -1 && this.state.quantity >= product_info.service_stock) {
      return true
    }

    this.setState({
      quantity: this.state.quantity + 1
    })
  }

  decreaseCount() {
    if(this.state.quantity > this.state.product_info.quantity_min) {
      this.setState({
        quantity: this.state.quantity - 1
      })
    }
  }

  init(){
    this.setState({
      sending: false,
      gateway: null,
      showQuantityOption: true,
      showPaymentOptions: false,
      quantity: 1,
      optParam: 'PayPal'
    })
  }

  backToProducts(){
    this.setState({
      showPaymentOptions : false,
      gateway: null
    })
  }

  backToOptions(){
    this.setState({
      showPaymentOptions : true,
      gateway: null
    })
  }

  openCoupon() {
    this.setState({
      openCoupon: true
    })
  }

  componentDidMount() {
    this.setState({loading: true})
    this.props.commonActions.getUserProductById(this.props.match.params.id).then(res => {
      if(res.status == 200)
        this.setState({
          product_info: res.data.product,
          paymentoptions: (res.data.product.gateways || '').split(',')
        })
      else throw res
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render() {
    const {
      gateway, 
      showQuantityOption,
      showPaymentOptions, 
      quantity, 
      sending, 
      loading,
      product_info,
      openCoupon, 
      paymentoptions,
      optParam
    } = this.state
    
    let custom_fields = []

    if(product_info && product_info.custom_fields)
      custom_fields = JSON.parse(product_info.custom_fields)['custom_fields']

    return (
      <div className="embeded-payment-screen">
        <div className="animated fadeIn">
          {
          loading ?
            <Row>
              <Col lg={12}>
                <Loader />
              </Col>
            </Row>
          :
          <Row className="m-0">
            <Col lg={4} className="ml-auto mr-auto p-0">
              <div className="stock-info text-center">
                <img src={sellixLogoIcon} className="logo"/>
                <p className="text-primary text-center"><b>Cracked Infinity</b></p>
                <p className="text-primary text-center" style={{fontSize: 14}}>by CrackedTo</p>
                <p className="text-primary price text-center">{CURRENCY_LIST[product_info.currency]}{product_info.price_display || 0}</p>                
              </div>
              <Card className="bg-white stock-stop mb-0">
                {
                  gateway?
                    <div className="p-4 pt-2 pb-2 mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <img src={backIcon} width="15" onClick={this.backToOptions.bind(this)} style={{cursor: "pointer", marginTop: -25}}/>
                        <p className="grey text-center desc">Please enter your email address <br />for product delivery</p>
                        <span></span>
                      </div>
                      
                      <Formik
                        initialValues={{email: ''}}
                        onSubmit={(values) => {
                          this.handleSubmit(values)
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string()
                            .required('Email is required'),
                        })}>
                          {props => (
                            <Form onSubmit={props.handleSubmit}>
                              <FormGroup className="mb-3">
                                <Input
                                  type="text"
                                  id="email"
                                  name="email"
                                  onChange={props.handleChange}
                                  value={props.values.email}
                                  placeholder="Email"
                                  className={
                                    props.errors.email && props.touched.email
                                      ? "is-invalid"
                                      : ""
                                  }
                                />
                                {props.errors.email && props.touched.email && (
                                  <div className="invalid-feedback">{props.errors.email}</div>
                                )}
                              </FormGroup>
                              {
                                custom_fields.map(field => {
                                  if(field.type == 'text') {
                                    return (
                                      <FormGroup className="mb-3">
                                        <Input
                                          type="text"
                                          id="text"
                                          name="text"
                                          onChange={(e) => {this.setCustomFields(field.name, e.target.value)}}
                                          value={this.state.custom_fields[field.name]}
                                          placeholder={field.name}
                                          required={field.required}
                                        />
                                      </FormGroup>
                                    )
                                  }

                                  if(field.type == 'number') {
                                    return (
                                      <FormGroup className="mb-3">
                                        <Input
                                          type="number"
                                          id="number"
                                          name="number"
                                          onChange={(e) => {this.setCustomFields(field.name, e.target.value)}}
                                          value={this.state.custom_fields[field.name]}
                                          placeholder={field.name}
                                          required={field.required}
                                        />
                                      </FormGroup>
                                    )
                                  }

                                  if(field.type == 'largetextbox') {
                                    return (
                                      <FormGroup className="mb-3">
                                        <textarea className="form-control" 
                                          id='service_text'
                                          name="service_text"
                                          value={this.state.custom_fields[field.name]}
                                          rows={5} 
                                          required={field.required}
                                          onChange={(e) => {this.setCustomFields(field.name, e.target.value)}}></textarea>
                                      </FormGroup>
                                    )
                                  }

                                  if(field.type == 'checkbox') {
                                    return (
                                      <FormGroup className="mb-3">
                                        <label className="custom-checkbox custom-control payment-checkbox">
                                          <input 
                                            className="custom-control-input"
                                            type="checkbox"
                                            id="sk"
                                            name="SMTP-auth"
                                            checked={this.state.custom_fields[field.name] || false}
                                            onChange={(e) => {this.setCustomFields(field.name, e.target.checked)}}
                                            />
                                          <label className="custom-control-label" htmlFor="sk">
                                            {field.name} <small className="font-italic">{!field.required && '(optional)'}</small>
                                          </label>
                                        </label>
                                      </FormGroup>
                                    )
                                  }
                                }
                              )
                              }
                              <div className="text-center">
                                <p className="text-center grey" style={{fontSize: 12}}>
                                  By continuing, you agree to our Terms of Service</p>
                                <Button color="primary" 
                                  type="submit" 
                                  className="mr-auto ml-auto mt-2" 
                                  disabled={sending}
                                  style={{width: 107}}>
                                  {sending ?<Spin/>:'Pay' }</Button>
                              </div>
                            </Form> )}
                        </Formik>
                    </div>:
                    <div className="p-4 pt-2 pb-2 mb-2">
                      {/*<div className="d-flex justify-content-between align-items-center mb-4">
                          <h4 className="mt-2 grey">Purchase</h4>
                          <img src={backIcon} width="15" onClick={this.backToProducts.bind(this)} style={{cursor: "pointer"}}/>
                        </div>*/}
                      <div className="text-center">
                        { !showPaymentOptions && (
                            <>
                              <p className="grey desc">
                                Instant Auth Key <br />
                                Reputation Ability +5/-5 <br />
                                View hidden content without posting <br />
                                Access to Premium-only section<br />
                                Close & edit own threads<br />
                                Ability to link music on profile<br />
                                Ability to change username<br />
                                Access to Userbar Hue<br />
                                Access to Postbit Background Changer<br />
                                Colorful Usertitles<br />
                              </p>
                              <Button color="primary" className="mr-auto ml-auto mt-3 d-block" 
                                onClick={this.showPaymentOptions.bind(this)} style={{width: 107}}>Continue</Button>
                              <div className="d-flex justify-content-center align-items-center mt-3 stock-count">
                                <span className={quantity == 1?'text-grey':'text-primary'} onClick={this.decreaseCount.bind(this)}>-</span>
                                <span className="ml-2 mr-2 text-primary">{quantity}</span>
                                <span onClick={this.increaseCount.bind(this)} className="text-primary">+</span>
                              </div>
                              {openCoupon?
                                <div className="mt-3">
                                  <Input 
                                    type="text"
                                    id="coupon"
                                    name="coupon"
                                    placeholder="Coupon code"
                                    onChange={(e) => {this.setState({coupon_code: e.target.value})}}/>
                                    <p className="text-grey text-left mt-2 coupon-help">This coupon will be automatically checked and applied if working when you proceed with the invoice</p>
                                </div>:
                                <p className="text-grey mt-3 cursor-pointer text-primary" style={{fontSize: 12}} onClick={this.openCoupon.bind(this)}>
                                  <img src={editIcon} width="15" style={{ marginRight:5}} />
                                  <b>Apply a Coupon</b>
                                </p>
                              }
                            </>
                        )}                            

                        {
                          showPaymentOptions && (
                            <>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <img src={backIcon} width="15" onClick={this.backToProducts.bind(this)} style={{cursor: "pointer"}}/>
                              <p className="grey text-center desc">Select payment method</p>
                              <span></span>
                            </div>
                            {paymentoptions.map(option => {
                              if(option != '') return(
                              <Button className="pay-button mt-3 pl-3 mr-auto ml-auto pr-3 d-block" 
                                key={option} >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <img src={PAYMENT_ICONS[option]} className="mr-2" width="20" height="20"/>
                                    {PAYMENT_LABELS[option]}
                                  </div>
                                  <label className="custom-checkbox custom-control payment-checkbox ">
                                    <input 
                                      className="custom-control-input"
                                      type="checkbox"
                                      id={option}
                                      name="SMTP-auth"
                                      onChange={(e) => {
                                        this.setState({optParam : PAYMENT_LABELS[option]})
                                      }}
                                      checked={ optParam === PAYMENT_LABELS[option] }
                                    />
                                    <label className="custom-control-label" htmlFor={option}>
                                    </label>
                                  </label>
                                </div>
                              </Button>
                              )}
                            )}
                            <Button color="primary" className="mr-auto ml-auto mt-3 d-block" 
                              onClick={(e) => this.setPaymentOptions(e, optParam)} style={{width: 107}}>Continue</Button>
                            </>
                          )
                        }
                      </div>
                    </div>
                }
              </Card>
            </Col>
          </Row>
        }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbededPayment)
