import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Tooltip
} from 'reactstrap'
import { Button } from 'components';
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
import { ReactComponent as CouponSvg } from 'assets/images/coupon.svg';
import verifiedIcon from 'assets/images/sellix_verified.svg'
import { validateCoupon } from './actions'
import './style.scss'

const mapStateToProps = (state) => {
  return ({    
    user: state.common.general_info || {}
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ validateCoupon }, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
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
      coupon_value: '',
      product_id: this.props.match.params.id,
      custom_fields: {},
      product_info: {},
      optParam: '',
      coupon_discount: 0,
      coupon_is_valid: true,
      coupon_applied: false,
      verifiedTooltipOpen: false
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

  vaiidateCouponAndShowPaymentOptions() {
    var coupon_value = this.state.coupon_value
    var code = ''
    var coupon_is_valid = true
    var discount = 100
    var params = {
      "code":coupon_value,
      "product_id":this.props.match.params.id
    }
    this.props.actions.validateCoupon(params).then((res) => {
      if (res.data){
          code = res.data.coupon['code']
          discount = res.data.coupon['discount']
      }
      this.setState({
        coupon_code: code,
        coupon_discount: discount,
        coupon_is_valid: true,        
      })
    }).catch(err => {      
      this.setState({
        coupon_code: '',
        coupon_discount: 0,
        coupon_is_valid: coupon_value != ''? false:true,        
      })
    })
    this.setState({      
      coupon_applied: coupon_value == ''? false:true
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
      quantity: this.state.quantity + 1,
      quantityPrompt: this.state.quantity + 1
    })
  }

  setCount = (count) => {
    const { product_info } = this.state

    if(isNaN(count)) {
      this.setState({
        quantity: this.state.quantity,
        quantityPrompt: this.state.quantity
      })
      return;
    }

    var validatedCount = count

    if(product_info.type == 'serials') {
      validatedCount = Math.min(product_info.stock, validatedCount)
    }

    if(product_info.type == 'file') {
      validatedCount = Math.min(product_info.file_stock, validatedCount)
    }

    if(product_info.type == 'service') {
      validatedCount = Math.min(product_info.service_stock, validatedCount)
    }

    if(product_info.quantity_max != -1)
      validatedCount = Math.min(product_info.quantity_max, validatedCount)

    if(product_info.quantity_min != -1)
      validatedCount = Math.max(product_info.quantity_min, validatedCount)

    this.setState({
      quantity: validatedCount,
      quantityPrompt: validatedCount
    })
  }

  decreaseCount() {
    if(this.state.quantity > this.state.product_info.quantity_min) {
      this.setState({
        quantity: this.state.quantity - 1,
        quantityPrompt: this.state.quantity - 1
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
      optParam: '',
      coupon_discount: 0
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

  clearCoupon() {
    this.setState({
      coupon_code: '',
      coupon_value: '',
      coupon_discount: 0,
      openCoupon: false,
      coupon_is_valid: true,
      coupon_applied: false
    })
  }

  onChangeCouponCode(ev) {
    var coupon_value = ev.target.value
    this.setState({
      coupon_value: coupon_value,
    })  
  }

  verifiedTooltipToggle() {
    this.setState({verifiedTooltipOpen: !this.state.verifiedTooltipOpen})
  }

  componentDidMount() {
    this.setState({loading: true});
    document.title = "Selix - Payment"
    var params = {};
    var vars = this.props.location.search.substr(1).split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      var key = pair[0].replace(/-/g, '_')
      if (pair[0] != '')
        params[key] = decodeURIComponent(pair[1])
    }
    this.setState({custom_fields : params});
    this.props.commonActions.getUserProductById(this.props.match.params.id).then(res => {
      if(res.status == 200){
        this.setState({
          product_info: res.data.product,
          paymentoptions: (res.data.product.gateways || '').split(',')
        })
        this.props.commonActions.getGeneralUserInfo(res.data.product.username)
          .then(({ user }) => {
            if(user.shop_crisp_website_id) {
              window.$crisp = [];
              window.CRISP_WEBSITE_ID=user.shop_crisp_website_id;
              const script = document.createElement("script");
              script.src = "https://client.crisp.chat/l.js";
              script.type = 'text/javascript';
              script.async = true;
              script.id = "crisp";
              document.getElementsByTagName("head")[0].appendChild(script);
            }
          })
          .catch((e) => {
            console.log(e)
            if (e.status === 404) {
              this.setState({
                userIsNotFound: true
              })
            }
            if(e.status === 400) {
              if(e.error.includes('user has been banned')) {
                this.setState({
                  userIsBanned: true
                })
                document.title = 'Banned User | Sellix'
              }
            }
          })
      }
      else throw res
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render() {
    const { user } = this.props
    const {
      gateway, 
      showQuantityOption,
      showPaymentOptions, 
      quantity, 
      quantityPrompt,
      sending, 
      loading,
      product_info,
      openCoupon, 
      paymentoptions,
      optParam,
      coupon_value,
      coupon_code,
      coupon_discount,
      coupon_is_valid,
      coupon_applied,
      verifiedTooltipOpen
    } = this.state
    
    var is_many = paymentoptions.length > 4 ? true : false
    var initial_optParam = ''
    if(paymentoptions.length > 0)
      initial_optParam = PAYMENT_LABELS[paymentoptions[0]]
    let custom_fields = []    

    if(product_info && product_info.custom_fields)
      var temp_custom_fields = JSON.parse(product_info.custom_fields)['custom_fields']
      var embed_fields = Object.keys(this.state.custom_fields);
      if(temp_custom_fields){
        for(var i=0;i<temp_custom_fields.length;i++){
          var field = temp_custom_fields[i];
          var is_exist = false
          for(var j=0;j<embed_fields.length;j++){
            var e_field = embed_fields[j];
            if(e_field.toLowerCase() == field['name'].toLowerCase()){
              is_exist = true
              break
            }
          }
          if(!is_exist)
            custom_fields.push(field)
        }
      }

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
          <div className="ml-auto mr-auto p-0 embed-block">
            <i className="fa fa-times cursor-pointer"></i>
            <div className="stock-info text-center">
              <img src={sellixLogoIcon} className="logo"/>
              <p className="text-primary text-center"><b>{product_info.title}</b></p>
              <p className="text-primary text-center" style={{fontSize: 14}}>
                <span>by {product_info.username || ''}</span>
                {user.verified == '1' &&
                  <span style={{fontSize: 17}}>
                    <img src={verifiedIcon} width="20" className="verified-icon ml-1" id="verifiedTooltip" />
                    <Tooltip
                      placement="right"
                      isOpen={verifiedTooltipOpen}
                      target="verifiedTooltip"
                      toggle={this.verifiedTooltipToggle.bind(this)}>
                      This shop has verified its brand identity to Sellix.
                    </Tooltip>
                  </span>
                }
              </p>
              <p className="text-primary price text-center">{CURRENCY_LIST[product_info.currency]}{(product_info.price_display * quantity * (100 - coupon_discount) /100).toFixed(2) || 0}</p>                
            </div>
            <Card className="bg-white stock-stop mb-0">
              {
                gateway?
                  <div className="p-4">
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
                  <>
                    { !showPaymentOptions && (
                      <div className="pt-4 pl-4 pr-4">
                        <div className="text-center">
                          <p className="grey desc" dangerouslySetInnerHTML={{__html: converter.makeHtml(product_info.description)}}>                            
                          </p>
                          <Button color="primary" className="mr-auto ml-auto mt-3 d-block" 
                          onClick={this.showPaymentOptions.bind(this)}>Continue</Button>
                          <div className="d-flex justify-content-center align-items-center mt-3 stock-count">
                            <span className={quantity == 1?'text-grey':'text-primary'} onClick={this.decreaseCount.bind(this)}>-</span>                              
                            <span className="ml-1 mr-1">
                                <input type="text" 
                                    className="text-primary"
                                    value={quantityPrompt === undefined ? quantity : quantityPrompt} style={{
                                    background: 'transparent',
                                    border: 'none',
                                    width: '18px',
                                    textAlign: 'center',                               
                                }} onChange={(e) => this.setState({quantityPrompt: e.target.value})} 
                                   onBlur={e => this.setCount(e.target.value)}
                                   />
                              </span>
                            <span onClick={this.increaseCount.bind(this)} className="text-primary">+</span>                              
                          </div>
                          {openCoupon?
                            <div className="pt-3 pb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <Input
                                  type="text"
                                  id="coupon"
                                  name="coupon"
                                  placeholder="Coupon code"
                                  value={coupon_value}
                                  onChange={this.onChangeCouponCode.bind(this)} />
                                 <Button color="primary" className="mr-auto d-block" 
                                    onClick={this.vaiidateCouponAndShowPaymentOptions.bind(this)}>
                                  <CouponSvg />
                                </Button>
                              </div>
                              { !coupon_is_valid && (
                                <p className="text-grey text-center coupon_applied m-0 mt-3">
                                  This coupon is invalid for this product
                                </p>
                              )}
                              { coupon_code != '' && coupon_is_valid && (
                                <p className="text-primary text-center coupon_applied m-0 mt-3">
                                  <img src={editIcon} width="12" />
                                  <span className="ml-2 mr-2" style={{ fontSize: 12 }}>Applied: { parseFloat(coupon_discount).toFixed(0)}% off the order</span>
                                  <i className="fa fa-times cursor-pointer" onClick={this.clearCoupon.bind(this)}></i>
                                </p>
                              )}
                              { !coupon_applied && (
                                <p className="text-grey text-left mt-2 mb-0 coupon-help">Click on the right button to check and apply the coupon for this order</p>
                              )}
                            </div>
                            :
                            <p className="text-grey mt-5 mb-2 cursor-pointer text-primary" style={{fontSize: 12}} onClick={this.openCoupon.bind(this)}>
                              <img src={editIcon} width="15" className="mr-1" />
                              <b>Apply a Coupon</b>
                            </p>
                          }
                        </div>
                      </div>
                    )}
                    {showPaymentOptions && (
                      <div className="p-4">
                        <div className="text-center">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <img src={backIcon} width="15" onClick={this.backToProducts.bind(this)} style={{cursor: "pointer"}}/>
                            <p className="grey text-center desc">Select payment method</p>
                            <span></span>
                          </div>
                          { is_many?
                            paymentoptions.map((option, key) => {
                            if(option != '') return(
                              <Button className="pay-button many p-2" 
                                key={key} 
                                onClick={(e) => this.setPaymentOptions(e, PAYMENT_LABELS[option])}
                                >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <img src={PAYMENT_ICONS[option]} className="mr-2" width="20" height="20"/>
                                    {PAYMENT_LABELS[option]}
                                  </div>
                                </div>
                              </Button>
                            )})
                            :
                            paymentoptions.map(option => {
                            if(option != '') return(
                              <Button className="pay-button mt-3 pl-3 mr-auto ml-auto pr-3 d-block"
                                key={option} 
                                onClick={(e) => this.setPaymentOptions(e, PAYMENT_LABELS[option])}
                                >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <img src={PAYMENT_ICONS[option]} className="mr-2" width="20" height="20"/>
                                    {PAYMENT_LABELS[option]}
                                  </div>
                                </div>
                              </Button>
                            )})
                          }
                          <Button color="primary" className="mr-auto ml-auto mt-3 d-block" 
                            onClick={(e) => this.setPaymentOptions(e, initial_optParam)}>Continue</Button>
                        </div>
                      </div>
                    )}
                  </>
              }
            </Card>
          </div>
        }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbededPayment)
