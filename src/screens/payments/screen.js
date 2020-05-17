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
import stripeBtnIcon from "../../assets/images/crypto/stripe_revised.svg";
import skrillIcon from "../../assets/images/crypto/skrill.svg";
import Select from "react-select";

const mapStateToProps = (state) => ({
  product_list: state.product.product_list
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
  authActions: bindActionCreators(AuthActions, dispatch),
  commonActions: bindActionCreators(CommonActions, dispatch)
})

const FEE_LEVEL = [
  {label: "Low", value: "low"},
  {label: "Regular", value: "regular"},
  {label: "Priority", value: "priority"}
]

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
      perfectmoney_passphrase: '',
      email_skrill: '',
      secretword_skrill: '',
      crypto_fee_level: '',
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
      email_skrill: this.state.email_skrill || '',
      secretword_skrill: this.state.secretword_skrill || '',
      stripe_user_id: this.state.stripe_user_id,
      crypto_fee_level: this.state.crypto_fee_level,
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
      stripe_user_id,
      email_skrill,
      secretword_skrill,
      crypto_fee_level,
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
                        <Col lg={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><i className="fab fa-paypal" style={{ color: '#0097df', marginRight: '.5rem', fontSize: '20px' }}/>PayPal Email</Label>
                            <Input 
                              type="text" 
                              placeholder="PayPal Email"  
                              value={email_paypal}
                              onChange={e => this.setState({email_paypal: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          <FormGroup className="mb-3">
                            <Label htmlFor="product_code"><img src={stripeIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Stripe</Label>
                            <br/>
                            {stripe_user_id && <p style={{marginBottom: '5px'}}>You are connected</p>}
                            {!stripe_user_id && <Button color="default" style={{ width: "100%"}} className="connect-discord" onClick={() => {
                              window.location = 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_H8Nl3tqGj85pnhyEoIOAIlUF5KoIvVaf&scope=read_write&redirect_uri=https://sellix.io/settings/stripe/connect'
                            }}>Connect <img src={stripeBtnIcon} width="50" style={{marginLeft: '5px'}}/></Button>}
                            {stripe_user_id && <Button color="default" style={{ width: "100%"}} className="connect-discord" onClick={() => {
                              this.props.actions.stripeDeauthorize().then(() => {
                                document.location.reload()
                              })
                            }}>Deauthorize <img src={stripeBtnIcon} width="50" style={{marginLeft: '5px'}}/></Button>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <FormGroup className="mb-0">
                            <Label htmlFor="product_code"><img src={perfectmoneyIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Perfect Money ID & Alternate Passphrase</Label>
                            <Row>
                              <Col lg={6}>
                                <Input 
                                  type="text" 
                                  placeholder="Perfect Money ID"
                                  value={perfectmoney_id}
                                  className="mb-3"
                                  onChange={e => this.setState({perfectmoney_id: e.target.value})}
                                />
                              </Col>
                              <Col lg={6}>
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
                          <FormGroup className="mb-0">
                            <Label htmlFor="product_code"><img src={skrillIcon} width="20" height="20" style={{ marginRight: '.5rem' }}/>Skrill Email & Secret Word</Label>
                            <Row>
                              <Col lg={6}>
                                <Input 
                                  type="text" 
                                  placeholder="Skrill Email"
                                  value={email_skrill}
                                  className="mb-3"
                                  onChange={e => this.setState({email_skrill: e.target.value})}
                                />
                              </Col>
                              <Col lg={6}>
                                <Input 
                                  type="text" 
                                  placeholder="Skrill Secret Word"
                                  value={secretword_skrill}
                                  className="mb-3"
                                  onChange={e => this.setState({secretword_skrill: e.target.value})}
                                />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr/>
                      <br/>
                      <Row>
                        <Col lg={6}>
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
                        <Col lg={6}>
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
                        <Col lg={6}>
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
                        <Col lg={6}>
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
                            <div>
                              <Label htmlFor="crypto_fee_level">Crypto Fees</Label>
                              <p className={"mb-2 text-grey"} style={{ fontSize: ".7rem"}}>
                                Select how many fees will be used to send the payout transaction. For low only a few cents will be spent on fees, regular will take an average of $0.15 while priority $2.00+. Regular and Priority depend on the current status of the Network, higher fee might be applied. Low fees are static, they will always be low.
                              </p>
                            </div>
                            <Select
                                classNamePrefix={"react-select"}
                                options={FEE_LEVEL}
                                id="crypto_fee_level"
                                name="crypto_fee_level"
                                value={FEE_LEVEL.find(({ value }) => value === crypto_fee_level)}
                                onChange={(option) => {
                                  this.setState({ crypto_fee_level: option.value });
                                }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
            </CardBody>
            <Button color="primary" className="mb-4" style={{ width: 200 }} onClick={this.savePayments.bind(this)}>
              {loading ? <Spin/> : 'Save Settings'}
            </Button>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments)
