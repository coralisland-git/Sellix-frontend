import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { converter } from 'constants/config'
import { Card, Row, Col } from 'reactstrap'
import { CommonActions } from 'services/global'
import { Loader, Affix } from 'components'
import StockInfo from "./stock_info";
import Purchase from "./purchase";
import Form from "./form";


import './style.scss';


const mapStateToProps = ({ common: { user_products } }) => ({
  user_products
});

const mapDispatchToProps = dispatch => ({
  commonActions: bindActionCreators(CommonActions, dispatch)
});


class ShopProductDetail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sending: false,
      loading: false,
      gateway: null,
      quantity: 1,
      email: null,
      coupon_code: '',
      custom_fields: {},
      productInfo: {}
    }
  }

  handleSubmit = (values) => {
    const { sending, loading, productInfo, custom_fields, gateway, ...data} = this.state;
    const { createInvoice, tostifyAlert } = this.props.commonActions;

    data.custom_fields = JSON.stringify({ custom_fields });
    data.gateway = gateway.toLowerCase();
    data.email = values.email;
    data.product_id = productInfo.uniqid;

    this.setState({ sending: true })
    createInvoice(data).then(({ data: { invoice }}) => {
      tostifyAlert('success', 'Invoice is created successfully.');

      this.props.history.push({ pathname: `/invoice/${invoice.uniqid}` })
    }).catch(({ error }) => {
      tostifyAlert('error', error)
    }).finally(() => {
      this.setState({ sending: false })
    })
  }

  setCustomFields = (key, value) => {
    this.setState({
      custom_fields: { ...this.state.custom_fields, [key]: value }
    })
  }

  setPaymentOptions = gateway => () => {
    this.setState({ gateway })
  }


  setCount = ({ quantity }) => {
    this.setState({
      quantity: Number(quantity)
    })
  }

  setCoupon = (coupon_code) => {
    this.setState({
      coupon_code
    })
  }

  reset = () => {
    this.setState({
      sending: false,
      gateway: null,
      quantity: 1
    })
  }

  componentDidMount() {

    const { tostifyAlert, getUserProductById } = this.props.commonActions;
    this.setState({ loading: true })

    getUserProductById(this.props.match.params.id).then(res => {
      if(res.status === 200) {
        this.setState({
          productInfo: {...res.data.product, paymentOptions: (res.data.product.gateways || '').split(',').filter(opt => opt !== '')},
        })
      } else {
        throw res
      }
    }).catch((err) => {
      tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render() {
    const {
      gateway,
      sending,
      loading,
      productInfo,
    } = this.state;

    if(loading) {
      return <Row><Col lg={12}><Loader /></Col></Row>
    }

    return (
      <div className="detail-product-screen">
        <div className="animated fadeIn">

          <div className="purchase-card ml-auto mr-auto">
            <Row className="pr-3 pl-3 pt-0">
              <Col lg={12} className="ml-auto mr-auto pb-4">
                <Row>

                  <Col md={8}>
                    <Card className="bg-white p-4 detail">
                      <h4 className="text-primary mb-4">{productInfo.title}</h4>
                      <div className="description" dangerouslySetInnerHTML={{__html: converter.makeHtml(productInfo.description)}}>
                      </div>
                    </Card>
                  </Col>

                  <Col md={4} className="left-bar" id="affix-bar">
                    <div className="d-sm-down-none" >
                      <Affix offsetTop={97} container='affix-bar' >
                        <Card className="bg-white" id={'affix-container'}>
                          {
                            gateway ?
                              <Form productInfo={productInfo} handleSubmit={this.handleSubmit} reset={this.reset} gateway={gateway} setCustomFields={this.setCustomFields} sending={sending}/>:
                                <Purchase setPaymentOptions={this.setPaymentOptions} {...this.state} setCount={this.setCount} setCoupon={this.setCoupon}/>
                          }

                          <StockInfo productInfo={productInfo} />
                        </Card>
                      </Affix>
                    </div>

                    <div className="d-md-none">
                      <Card className="bg-white">
                        {
                          gateway ?
                              <Form productInfo={productInfo} handleSubmit={this.handleSubmit} reset={this.reset} gateway={gateway} setCustomFields={this.setCustomFields} sending={sending}/>:
                              <Purchase setPaymentOptions={this.setPaymentOptions} {...this.state} setCount={this.setCount} setCoupon={this.setCoupon}/>
                        }
                        <StockInfo productInfo={productInfo} />
                      </Card>
                    </div>

                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopProductDetail)
