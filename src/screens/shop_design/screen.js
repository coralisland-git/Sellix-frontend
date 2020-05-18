import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, Row, Col, FormGroup, Label, Input } from 'components/reactstrap'
import {Button, Spin} from 'components';
import AppSwitch from '@coreui/react/es/Switch'
import { CommonActions, AuthActions } from 'services/global'
import { Loader } from 'components'
import * as Actions from './actions'

import './style.scss'

const mapStateToProps = (state) => ({
  product_list: state.product.product_list
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  commonActions: bindActionCreators(CommonActions, dispatch)
})


class Payments extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      discord_link: '',
      search_enabled: true,
      dark_mode: false,
      hide_out_of_stock: false,
      google_analytics_tracking_id: '',
      crisp_website_id: '',
      center_product_titles: false,
      center_group_titles: false,
      crypto_invoice_mode: 'default' || 'qrcode',
    }
  }

  saveDesign(){
    this.setState({ loading: true });

    let settingsData = {
      discord_link: this.state.discord_link,
      search_enabled: this.state.search_enabled,
      dark_mode: this.state.dark_mode,
      hide_out_of_stock: this.state.hide_out_of_stock,
      google_analytics_tracking_id: this.state.google_analytics_tracking_id,
      crisp_website_id: this.state.crisp_website_id,
      center_product_titles: this.state.center_product_titles,
      center_group_titles: this.state.center_group_titles,
      crypto_invoice_mode: this.state.crypto_invoice_mode,
    }

    // if(this.state.google_analytics_tracking_id) {
    //   settingsData.google_analytics_tracking_id = this.state.google_analytics_tracking_id
    // }

    this.props.actions.saveShopSettings(settingsData)
      .then(res => this.props.commonActions.tostifyAlert('success', res.message))
      .catch(res => this.props.commonActions.tostifyAlert('error', res.error))
      .finally(() => this.setState({loading: false}))
  }


  componentDidMount() {
    this.setState({ loading: true })
    this.props.authActions.getUserSettings().then(res => {
      const settings = res.data.settings
      this.setState({
        discord_link: settings.shop_discord_link || '',
        crisp_website_id: settings.shop_crisp_website_id || '',
        search_enabled: settings.shop_search_enabled === '1',
        center_product_titles: settings.shop_center_product_titles === '1',
        center_group_titles: settings.shop_center_group_titles === '1',
        dark_mode: settings.shop_dark_mode === '1',
        hide_out_of_stock: settings.shop_hide_out_of_stock === '1',
        crypto_invoice_mode: settings.crypto_invoice_mode,

        google_analytics_tracking_id: settings.shop_google_analytics_tracking_id || ''
      })
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  setInvoiceMode = (crypto_invoice_mode) => {
    this.setState({
      crypto_invoice_mode
    })
  }

  render() {
    const { loading, discord_link, crisp_website_id, search_enabled, dark_mode, hide_out_of_stock, center_product_titles, center_group_titles, crypto_invoice_mode } = this.state;

    return (
      <div className="shop-settings-screen">
        <div className="animated fadeIn">
          <Card>
            <CardBody className="p-4 mb-4 position-relative">
              {loading &&
              <div className={"loader-container"}>
                <Loader/>
              </div>
              }
                  <Row className="">
                    <Col lg={12}>
                      <FormGroup className="mb-4">
                        <h4 className="title">Design</h4>
                      </FormGroup>
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <div>
                              <Label htmlFor="discord_link">Discord Link</Label>
                              <p className={"text-grey mb-2"}>You can add your server invite link, it will be displayed next to Create a Query in the contact form.</p>
                            </div>
                            <Input 
                              type="text" 
                              placeholder="https://discord.gg/example"
                              value={discord_link}
                              onChange={e => this.setState({discord_link: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="discord_link">Crisp Website ID</Label>
                            <Input
                              type="text"
                              placeholder="Seamlessly chat with and assist your customers using Crisp.im"
                              value={crisp_website_id}
                              onChange={e => this.setState({crisp_website_id: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'} 
                                color={'primary'}
                                size="lg"
                                checked={center_product_titles}
                                onChange={(e) => {
                                  this.setState({
                                    center_product_titles: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Centered Title for Products</Label>
                                <p className="text-grey mb-0">Product titles will be centered in your store.</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'} 
                                color={'primary'}
                                size="lg"
                                checked={center_group_titles}
                                onChange={(e) => {
                                  this.setState({
                                    center_group_titles: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Centered Title for Groups</Label>
                                <p className="text-grey mb-0">Group titles will be centered in your store.</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'}
                                color={'primary'}
                                size="lg"
                                checked={search_enabled}
                                onChange={(e) => {
                                  this.setState({
                                    search_enabled: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Search Products</Label>
                                <p className="text-grey mb-0">
                                  Show the products searchbar in your shop, this option can be disabled to improve the design of your page.</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'} 
                                color={'primary'}
                                size="lg"
                                checked={dark_mode}
                                onChange={(e) => {
                                  this.setState({
                                    dark_mode: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Dark Mode</Label>
                                <p className="text-grey mb-0">
                                Show your shop page with our dark theme.</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col className="d-flex align-items-center">
                              <AppSwitch className="mt-1 file-switch mr-2"
                                variant={'pill'} 
                                color={'primary'}
                                size="lg"
                                checked={hide_out_of_stock}
                                onChange={(e) => {
                                  this.setState({
                                    hide_out_of_stock: e.target.checked
                                  })
                                }}
                              />
                              <div className="ml-2">
                                <Label className="mb-0">Hide Out of Stock</Label>
                                <p className="text-grey mb-0">Automatically hide your products when out of stock.</p>
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className={dark_mode ? "mt-2" : "mt-2 light"}>
                          <FormGroup row>
                            <Col lg={4} md={12} className={"mb-4"}>
                              <Label className="mb-0">Crypto Order Style:</Label>
                              <p className="text-grey mb-0">Choose how you want the order payment info displayed when customers are buying with cryptos.</p>
                            </Col>
                            <Col lg={4} md={6} sm={6} className="d-flex align-items-center flex-column">
                              <div className={crypto_invoice_mode === 'default' ? "invoice-mode active" : "invoice-mode"} onClick={this.setInvoiceMode.bind(this, 'default')}>
                                <header className={"d-flex align-items-center justify-content-between"}>
                                  <div>Sellix</div>
                                  <div>
                                    <span />
                                    <span />
                                    <span />
                                  </div>
                                </header>
                                <div className={'default'}>
                                  <div className={'logo'}>Sellix</div>
                                  <span className={"p-title"}/>
                                  <span ><span ></span><span ></span></span>
                                  <span ><span ></span><span ></span></span>
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                  <span />
                                </div>
                                <footer />
                              </div>
                              <p className="text-grey mb-0 mt-3" style={{ fontSize: ".7rem" }}>
                                This option will display a normal order box with every info needed and the same design as PayPal, Stripe, Skrill and PerfectMoney.</p>
                            </Col>
                            <Col lg={4} md={6} sm={6} className="d-flex align-items-center flex-column">
                              <div className={crypto_invoice_mode === 'qrcode' ? "invoice-mode active" : "invoice-mode"} onClick={this.setInvoiceMode.bind(this, 'qrcode')}>
                                <header className={"d-flex align-items-center justify-content-between"}>
                                  <div>Sellix</div>
                                  <div>
                                    <span />
                                    <span />
                                    <span />
                                  </div>
                                </header>
                                <div className={'qrcode'}>
                                  <div>
                                    <span className={"p-title"}/>
                                    <span><span /><span /></span>
                                    <span />
                                    <span />
                                  </div>
                                  <div>
                                    <div className={'logo'}>Sellix</div>
                                    <div>
                                      <div><i className={"fas fa-qrcode"}/></div>
                                    </div>
                                  </div>
                                </div>
                                <footer />
                              </div>
                              <p className="text-grey mb-0 mt-3" style={{ fontSize: ".7rem" }}>
                                This option will instead keep the product info card and add an additional QRCode for an easier and faster checkout.
                              </p>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

            </CardBody>
            <Button color="primary" className="mb-4" style={{ width: 200 }} onClick={this.saveDesign.bind(this)}>
              {loading ? <Spin/> : 'Save Settings'}
            </Button>
            
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)