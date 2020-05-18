import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { converter } from 'constants/config'
import { Card, Row, Col, Input } from 'components/reactstrap'
import { CommonActions } from 'services/global'
import { Loader, Affix } from 'components'
import StockInfo from "./stock_info";
import Purchase from "./purchase";
import Form from "./form";



import './style.scss';




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
    data.gateway = gateway.toLowerCase().replace(' ', '');
    data.email = values.email;
    data.product_id = productInfo.uniqid;

    this.setState({ sending: true })
    createInvoice(data)
        .then(({ data: { invoice }}) => {

          window.localStorage.setItem(invoice.uniqid, invoice.secret)
          tostifyAlert('success', 'Invoice is created successfully.');

          this.props.history.push({
            pathname: `/invoice/${invoice.uniqid}`,
            state: {
              invoice: invoice
            }
          })
        })
        .catch(({ error }) => {
          tostifyAlert('error', error)
        })
        .finally(() => {
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

  updateGroupProduct = () => {
    if(this.props.group) {
      this.setState({
        productInfo: {...this.props.selectedProduct, paymentOptions: (this.props.selectedProduct.gateways || '').split(',').filter(opt => opt !== '')},
      })
    }
  }

  componentDidMount() {
    if(this.props.group) {
      this.updateGroupProduct()
    } else {
      const { tostifyAlert, getUserProductById } = this.props.commonActions;
      this.setState({ loading: true })

      const { id } = this.props.match.params

      getUserProductById(id).then(res => {
        if(res.status === 200) {
          this.setState({
            productInfo: {...res.data.product, paymentOptions: (res.data.product.gateways || '').split(',').filter(opt => opt !== '')},
            quantity: res.data.product.quantity_min > 1 ? res.data.product.quantity_min : 1
          })
          document.title = `${res.data.product.title} | Sellix`;
        } else {
          throw res
        }
      }).catch((err) => {
        tostifyAlert('error', err.error)
      }).finally(() => {
        this.setState({loading: false})
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.group && this.props.selectedProduct.uniqid !== prevProps.selectedProduct.uniqid) {
      this.updateGroupProduct()
    }
  }

  progressShouldBeRed = () => this.state.seconds && this.state.seconds < 60 * 60

  render() {

    const { group } = this.props;
    const { gateway, sending, loading, productInfo, invoice, isQrMode } = this.state;


    return (
      <div className="detail-product-screen" style={{ marginTop: '25px' }}>
        <div className={""}>

          <div className="purchase-card ml-auto mr-auto">
            <Row className="pr-3 pl-3 pt-0">
              <Col lg={12} className="ml-auto mr-auto pb-4">
                <Row>

                  <Col md={6} lg={7} xl={8}>
                    <Card className="bg-white p-4 detail">
                      <h4 className="text-primary mb-4">{productInfo.title}</h4>
                      <div className="description" dangerouslySetInnerHTML={{__html: converter.makeHtml(productInfo.description)}}>
                      </div>
                    </Card>
                  </Col>

                  <Col md={6} lg={5} xl={4} className="left-bar" id="affix-bar">
                    <div className="d-md-none d-sm-down-none d-lg-block d-md-block animated fadeIn" >
                      <Affix offsetTop={97} container='affix-bar' >
                        <Card className="bg-white" id={'affix-container'} style={loading ? { height: '490px', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}>
                          {loading && <Loader/>}
                          {!loading && <>
                            {<>
                              {
                                group && <div className="p-3 pt-2 pb-2">
                                  <h4>Select an option</h4>
                                  <Input type="select" name="select" id="exampleSelect" 
                                        value={this.props.selectedProduct.uniqid}
                                        onChange={e => {
                                          const uniqid = e.target.value
                                          const product = group.products_bound.find(p => p.uniqid === uniqid)
                                          this.props.handleProductChange(product)
                                        }}
                                        >
                                    {group.products_bound.map(product => <option key={product.uniqid} value={product.uniqid}>{product.title}</option>)}
                                  </Input>
                                </div>
                              }
                              {
                                gateway ?
                                  <Form productInfo={productInfo} handleSubmit={this.handleSubmit} reset={this.reset} gateway={gateway} setCustomFields={this.setCustomFields} sending={sending}/>:
                                  <Purchase setPaymentOptions={this.setPaymentOptions} {...this.state} setCount={this.setCount} setCoupon={this.setCoupon}/>
                              }
                              <StockInfo productInfo={productInfo} />
                            </>}
                          </>}
                        </Card>
                      </Affix>
                    </div>

                    <div className="d-lg-none d-md-none animated fadeIn" >
                      <Card className="bg-white" style={loading ? { height: '490px', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}>
                        {loading && <Loader/>}
                        {!loading && <>
                          {<>
                            {
                              group && <div className="p-3 pt-2 pb-2">
                                <h4>Select an option</h4>
                                <Input type="select" name="select" id="exampleSelect"
                                       value={this.props.selectedProduct.uniqid}
                                       onChange={e => {
                                         const uniqid = e.target.value
                                         const product = group.products_bound.find(p => p.uniqid === uniqid)
                                         this.props.handleProductChange(product)
                                       }}
                                >
                                  {group.products_bound.map(product => <option key={product.uniqid} value={product.uniqid}>{product.title}</option>)}
                                </Input>
                              </div>
                            }
                            {
                              gateway ?
                                  <Form productInfo={productInfo} handleSubmit={this.handleSubmit} reset={this.reset} gateway={gateway} setCustomFields={this.setCustomFields} sending={sending}/>:
                                  <Purchase setPaymentOptions={this.setPaymentOptions} {...this.state} setCount={this.setCount} setCoupon={this.setCoupon}/>
                            }
                            <StockInfo productInfo={productInfo} />
                          </>}
                        </>}
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

const mapStateToProps = ({ common: { user_products, general_info: user } }) => ({
  user_products,
  user,
});

const mapDispatchToProps = dispatch => ({
  commonActions: bindActionCreators(CommonActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopProductDetail))
