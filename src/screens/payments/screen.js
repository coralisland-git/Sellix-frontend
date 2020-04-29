import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input
} from 'reactstrap'
import {Button, Spin} from 'components';
import { CommonActions, AuthActions } from 'services/global'
import { Loader } from 'components'
import * as Actions from './actions'

import './style.scss'

import bitcoinIcon from "../../assets/images/crypto/btc.svg";
import ethereumIcon from "../../assets/images/crypto/eth.svg";
import litecoinIcon from "../../assets/images/crypto/ltc.svg";
import bitcoinCashIcon from "../../assets/images/crypto/bitcoincash.svg";
import perfectmoneyIcon from "../../assets/images/crypto/perfectmoney.svg";
import stripeIcon from "../../assets/images/crypto/stripe.svg";

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
      email_paypal: '',
      wallet_bitcoin: '',
      wallet_litecoin: '',
      wallet_ethereum: '',
      wallet_bitcoincash: '',
      perfectmoney_id: '',
      perfectmoney_passphrase: ''
    }
  }

  savePayments(){
    this.setState({ loading: true });
    this.props.actions.savePayments({
      email_paypal: this.state.email_paypal || '',
      wallet_bitcoin: this.state.wallet_bitcoin || '',
      wallet_litecoin: this.state.wallet_litecoin || '',
      wallet_ethereum: this.state.wallet_ethereum || '',
      wallet_bitcoincash: this.state.wallet_bitcoincash || '',
      perfectmoney_id: this.state.perfectmoney_id || '',
      perfectmoney_passphrase: this.state.perfectmoney_passphrase || '',
      stripe_user_id: this.state.stripe_user_id
    })
      .then(res => this.props.commonActions.tostifyAlert('success', res.message))
      .catch(res => this.props.commonActions.tostifyAlert('error', res.error))
      .finally(() => this.setState({loading: false}))
  }


  componentDidMount() {
    this.setState({ loading: true })
    this.props.authActions.getUserSettings().then(res => {
      const settings = res.data.settings

      this.setState(settings)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render() {
    const { 
      loading, 
      email_paypal, 
      wallet_bitcoin, 
      wallet_ethereum, 
      wallet_litecoin, 
      wallet_bitcoincash,
      perfectmoney_id,
      perfectmoney_passphrase,
      stripe_user_id
    } = this.state;

    return (
      <div className="payments-screen">
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
                        <h4 className="title">Payments</h4>
                      </FormGroup>
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><i className="fa fa-paypal" style={{ color: '#0097df', marginRight: '.5rem', fontSize: '20px' }}/>PayPal Email</Label>
                            <Input 
                              type="text" 
                              placeholder="PayPal Email"  
                              value={email_paypal}
                              onChange={e => this.setState({email_paypal: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-0">
                            <Label htmlFor="product_code"><img src={perfectmoneyIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Perfect Money ID & Alternate Passphrase</Label>
                            <Row>
                              <Col lg={5}>
                                <Input 
                                  type="text" 
                                  placeholder="Perfect Money ID"
                                  value={perfectmoney_id}
                                  className="mb-3"
                                  onChange={e => this.setState({perfectmoney_id: e.target.value})}
                                />
                              </Col>
                              <Col lg={7}>
                                <Input 
                                  type="text" 
                                  placeholder="Perfect Money Alternate Passphrase"
                                  value={perfectmoney_passphrase}
                                  className="mb-3"
                                  onChange={e => this.setState({perfectmoney_passphrase: e.target.value})}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><img src={bitcoinIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Bitcoin Address</Label>
                            <Input 
                              type="text" 
                              placeholder="Bitcoin Wallet"
                              value={wallet_bitcoin}
                              onChange={e => this.setState({wallet_bitcoin: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><img src={ethereumIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Ethereum Address</Label>
                            <Input 
                              type="text" 
                              placeholder="Ethereum Address"
                              value={wallet_ethereum}
                              onChange={e => this.setState({wallet_ethereum: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><img src={litecoinIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Litecoin Address</Label>
                            <Input 
                              type="text" 
                              placeholder="Litecoin Address"
                              value={wallet_litecoin}
                              onChange={e => this.setState({wallet_litecoin: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><img src={bitcoinCashIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Bitcoin Cash Address</Label>
                            <Input 
                              type="text" 
                              placeholder="Bitcoin Cash Address"
                              value={wallet_bitcoincash}
                              onChange={e => this.setState({wallet_bitcoincash: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><img src={stripeIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Stripe</Label>
                            <br/>
                            {stripe_user_id && <p style={{marginBottom: '5px'}}>You are connected</p>}
                            {!stripe_user_id && <Button color="default" className="connect-discord" onClick={() => {
                              window.location = 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_H8NlXW3cDCE36GZyIwv5RFOZZmaT1lJx&scope=read_write&redirect_uri=https://sellix.io/settings/stripe/connect'
                            }}>Connect</Button>}
                            {stripe_user_id && <Button color="default" className="connect-discord" onClick={() => {

                              this.props.actions.stripeDeauthorize().then(() => {
                                document.location.reload()
                              })

                            }}>Disconnect</Button>}
                          </FormGroup>
                        </Col>
                      </Row>
                      {/* <Row>
                        <Col lg={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code">Perfect Money ID</Label>
                            <Input type="text" placeholder="Perfect Money ID"></Input>
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code">Perfect Money Alternate Passphrase</Label>
                            <Input type="text" placeholder="Perfect Money Alternate Passphrase"></Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code">Stripe</Label><br/>
                            <Button color="primary" className="stripe-button">Connect with Stripe</Button>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code">Skrill Email</Label>
                            <Input type="text" placeholder="Skrill Email"></Input>
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code">Skrill Secret Word</Label>
                            <Input type="text" placeholder="Skrill Secret Word"></Input>
                          </FormGroup>
                        </Col>
                      </Row> */}
                    </Col>
                  </Row>
            </CardBody>
            <Button color="primary" className="mb-4" style={{ width: 200 }} onClick={this.savePayments.bind(this)}>
              {loading ? <Spin/> : 'Save Settings'}
            </Button>
          </Card>
          {/* <Card>
            <CardBody className="p-4 mb-5">
              {
                loading ?
                  <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>
                : 
                  <Row className="mt-4 mb-4">
                    <Col lg={12}>
                      <FormGroup className="mb-5">
                        <Label className="title">Crypto Currency</Label>
                      </FormGroup>
                    </Col>
                    <Col lg={12}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="product_code">Crypto Currency Integration</Label><br/>
                        <Select placeholder="Select..."/>
                      </FormGroup>
                    </Col>
                  </Row>
              }
              
            </CardBody>
            <Button color="primary" className="mb-4" style={{width: 200}}>Save Settings</Button>
          </Card> */}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)