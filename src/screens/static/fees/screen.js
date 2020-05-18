import React from 'react'
import {
  Col,
  Container,
  Row,
  Button,
  Collapse
} from 'reactstrap'

import './style.scss'

import service1 from 'assets/images/crypto/paypal.svg'
import service2 from 'assets/images/crypto/btc.svg'
import service3 from 'assets/images/crypto/ltc.svg'
import service4 from 'assets/images/crypto/eth.svg'
import service5 from 'assets/images/crypto/bitcoincash.svg'
import service6 from 'assets/images/crypto/perfectmoney.svg'
import service7 from 'assets/images/crypto/stripe.svg'
import service9 from 'assets/images/crypto/skrill.svg'

import * as feeAction from './actions'

class Fees extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,

      site_fee_percentage: 0,
      paypal: null,
      bitcoin: {},
      ethereum: {},
      litecoin: {},
      bitcoincash: {},

      showMoreBtc: false,
      showMoreLtc: false
    }
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen})
  }

  componentDidMount() {
    document.title = `Fees | Sellix`;

    feeAction.getFees().then(res => {
      const data = res.data.fees
      this.setState({
        site_fee_percentage: data.site_fee_percentage,
        paypal: data.paypal,
        bitcoin: data.bitcoin,
        ethereum: data.ethereum,
        litecoin: data.litecoin,
        bitcoincash: data.bitcoincash
      })
    }).catch((err) => {
      
    })
  }

  render() {
    const { isOpen, paypal, bitcoin, ethereum, litecoin, site_fee_percentage, showMoreBtc, showMoreLtc, bitcoincash } = this.state

    return (
      <div className="fees-screen">
        <div className="animated fadeIn">
          <div className="section text-center ">
            <Container className="home-container" fluid>
              <h1>Fees</h1>
              <p className="large">
                How much we charge over orders
              </p>
            </Container>
          </div>
          <div className="section text-center bg-white" style={{paddingBottom:50}}>
              <Container className="home-container pt-5">
                <Row>
                    <Col md={3}>
                        <div className="payment-card">
                            <div className="method">
                                <h4 className="mt-4">Paypal</h4>
                                <div className="service-img">
                                  <img src={service1}/>
                                </div>
                            </div>
                            <div className="content p-2">
                                <p className="small text-primary">
                                  {paypal?
                                    'Paypal':
                                    'Sellix does not take any additional fee to process PayPal invoices.'
                                  }
                                </p>
                            </div>
                        </div>
                    </Col>
                    <style>
                      {`
                        .btn-read-more {
                          padding: 5px;
                          border: none !important;
                          font-size: 12px !important;
                          height: 10px !important;
                          display: inline-block;
                          box-shadow: none !important;
                        }
                      `}
                    </style>
                    <Col md={3}>
                        <div className={"payment-card "}>
                            <div className="method">
                                <h4 className="mt-4">Bitcoin</h4>
                                <div className="service-img">
                                  <img src={service2}/>
                                </div>
                            </div>
                            <div className="content p-2">
                                {/* <p className="small text-primary">
                                  {
                                    'Sellix does not take any additional fee to process Bitcoin invoices.'
                                  }
                                </p> */}
                                <p className="small1 text-primary">
                                  Transaction Fees: <b>${bitcoin.transaction_fee_usd || 0}</b>
                                </p>
                                <p className="small1 text-primary">Sellix Fees: <img src={service2} className="mr-1" width="17" height="17"/>
                                    <b>{bitcoin.site_fee_low_price || 0} (${bitcoin.site_fee_low_price_usd || 0})</b>
                                </p>
                                <p className="small1 text-primary mt-2 lh-1">
                                If the order is less than ${bitcoin.low_price_usd || 0}, else {site_fee_percentage}% over the total.
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className={"payment-card "}>
                            <div className="method">
                                <h4 className="mt-4">Litecoin</h4>
                                <div className="service-img">
                                  <img src={service3}/>
                                </div>
                            </div>
                            <div className="content p-2">
                              {/* <p className="small text-primary">
                                {
                                  'Sellix does not take any additional fee to process Litecoin invoices.'
                                }
                              </p> */}
                                <p className="small1 text-primary">
                                    Transaction Fees: <b>${litecoin.transaction_fee_usd || 0}</b>
                                </p>
                                <p className="small1 text-primary">Sellix Fees: <img src={service3} className="mr-1" width="17" height="17"/>
                                    <b>{litecoin.site_fee_low_price || 0} (${litecoin.site_fee_low_price_usd || 0})</b>
                                </p>
                                <p className="small1 text-primary mt-2 lh-1">
                                If the order is less than ${litecoin.low_price_usd || 0}, else {site_fee_percentage}% over the total.
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="payment-card">
                            <div className="method">
                                <h4 className="mt-4">Ethereum</h4>
                                <div className="service-img">
                                  <img src={service4}/>
                                </div>
                            </div>
                            <div className="content p-2">
                              {/* <p className="small text-primary">
                                {
                                  'Sellix does not take any additional fee to process Ethereum invoices.'
                                }
                              </p> */}
                                <p className="small1 text-primary">
                                    Transaction Fees: <b>{(ethereum.transaction_fee || 0).toFixed(8)} (${ethereum.transaction_fee_usd || 0})</b>
                                </p>
                                <p className="small1 text-primary mt-2 lh-1">Sellix Fees: <img src={service4} className="mr-1" width="17" height="17"/>
                                    <b>{site_fee_percentage}% over the total</b>
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                  <Col md={3}>
                    <div className={"payment-card "}>
                      <div className="method">
                          <h4 className="mt-4">Bitcoin Cash</h4>
                          <div className="service-img">
                            <img src={service5}/>
                          </div>
                      </div>
                      <div className="content p-2">
                          {/* <p className="small text-primary">
                            {
                              'Sellix does not take any additional fee to process Bitcoin Cash invoices.'
                            }
                          </p> */}
                          <p className="small1 text-primary">
                            Transaction Fees: <b>${bitcoincash.transaction_fee_usd || 0}</b>
                          </p>
                          <p className="small1 text-primary">Sellix Fees: <img src={service5} className="mr-1" width="17" height="17"/>
                              <b>{bitcoincash.site_fee_low_price || 0} (${bitcoincash.site_fee_low_price_usd || 0})</b>
                          </p>
                          <p className="small1 text-primary mt-2 lh-1">
                          If the order is less than ${bitcoincash.low_price_usd || 0}, else {site_fee_percentage}% over the total.
                          </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className={"payment-card "}>
                      <div className="method">
                          <h4 className="mt-4">Perfect Money</h4>
                          <div className="service-img">
                            <img src={service6}/>
                          </div>
                      </div>
                      <div className="content p-2">
                          <p className="small text-primary">
                            {
                              'Sellix does not take any additional fee to process Perfect Money invoices.'
                            }
                          </p>
                          {/* <p className="small1 text-primary">
                            Transaction Fees: <b>${bitcoincash.transaction_fee_usd || 0}</b>
                          </p>
                          <p className="small1 text-primary">Sellix Fees: <img src={service2} width="25" height="25"/>
                              <b>{bitcoincash.site_fee_low_price || 0} (${bitcoincash.site_fee_low_price_usd || 0})</b>
                          </p>
                          <Button className="btn-read-more" onClick={() => this.setState({ showMoreBtc: !this.state.showMoreBtc })}>
                            read {showMoreBtc ? "less ▲" : "more ▼"}
                          </Button>
                          <Collapse isOpen={showMoreBtc}>
                            <p className="small1 text-primary">
                            if the order is less than ${bitcoincash.low_price_usd || 0}, else {site_fee_percentage}% over the total.
                            </p>
                          </Collapse> */}
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className={"payment-card "}>
                      <div className="method">
                          <h4 className="mt-4">Stripe</h4>
                          <div className="service-img">
                            <img src={service7}/>
                          </div>
                      </div>
                      <div className="content p-2">
                          <p className="small text-primary">
                          If the order is less than $2.26, else 3.00% over the total.
                          </p>
                          {/* <p className="small1 text-primary">
                            Transaction Fees: <b>${bitcoincash.transaction_fee_usd || 0}</b>
                          </p>
                          <p className="small1 text-primary">Sellix Fees: <img src={service2} width="25" height="25"/>
                              <b>{bitcoincash.site_fee_low_price || 0} (${bitcoincash.site_fee_low_price_usd || 0})</b>
                          </p>
                          <Button className="btn-read-more" onClick={() => this.setState({ showMoreBtc: !this.state.showMoreBtc })}>
                            read {showMoreBtc ? "less ▲" : "more ▼"}
                          </Button>
                          <Collapse isOpen={showMoreBtc}>
                            <p className="small1 text-primary">
                            if the order is less than ${bitcoincash.low_price_usd || 0}, else {site_fee_percentage}% over the total.
                            </p>
                          </Collapse> */}
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className={"payment-card "}>
                      <div className="method">
                          <h4 className="mt-4">Skrill</h4>
                          <div className="service-img">
                            <img src={service9}/>
                          </div>
                      </div>
                      <div className="content p-2">
                          <p className="small text-primary">
                            {
                              'Sellix does not take any additional fee to process Skrill invoices.'
                            }
                          </p>
                          {/* <p className="small1 text-primary">
                            Transaction Fees: <b>${bitcoincash.transaction_fee_usd || 0}</b>
                          </p>
                          <p className="small1 text-primary">Sellix Fees: <img src={service2} width="25" height="25"/>
                              <b>{bitcoincash.site_fee_low_price || 0} (${bitcoincash.site_fee_low_price_usd || 0})</b>
                          </p>
                          <Button className="btn-read-more" onClick={() => this.setState({ showMoreBtc: !this.state.showMoreBtc })}>
                            read {showMoreBtc ? "less ▲" : "more ▼"}
                          </Button>
                          <Collapse isOpen={showMoreBtc}>
                            <p className="small1 text-primary">
                            if the order is less than ${bitcoincash.low_price_usd || 0}, else {site_fee_percentage}% over the total.
                            </p>
                          </Collapse> */}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
          </div>
        </div>
      </div>
    )
  }
}

export default Fees
