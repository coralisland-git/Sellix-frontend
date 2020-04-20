import React from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
} from 'reactstrap'
import moment from 'moment'
import config from 'constants/config'
import { Loader, Spin } from 'components'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import { tableOptions } from 'constants/tableoptions'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {
	CommonActions
} from 'services/global'
import {ResendModal} from './sections'
import {IssueReplacementModal} from './sections'
import {ProcessOrderModal} from './sections'
import bitcoinIcon from 'assets/images/crypto/btc.svg'
import paypalIcon from 'assets/images/crypto/paypal.svg'
import litecoinIcon from 'assets/images/crypto/ltc.svg'
import ethereumIcon from 'assets/images/crypto/eth.svg'
import perfectmoneyIcon from 'assets/images/crypto/perfectmoney.svg'
import stripeIcon from 'assets/images/crypto/stripe.svg'
import bitcoincashIcon from 'assets/images/crypto/bitcoincash.svg'
import skrillIcon from 'assets/images/crypto/skrill.svg'

import * as OrderActions from '../../actions'

import './style.scss'


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

const CRYPTOS = ['bitcoin', 'litecoin', 'ethereum', 'bitcoincash']

const mapStateToProps = (state) => {
  return ({
    product_list: state.product.product_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(OrderActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
  })
}

const user = window.localStorage.getItem('userId')


const ORDER_STATUS = {
  '0': 'Pending',
  '1': 'Completed',
  '2': 'Cancelled',
  '3': 'Confirmation',
  '4': 'Partial'
}

const PAYMENT_OPTS = {
  'paypal': 'PayPal',
  'bitcoin': 'BTC',
  'litecoin': 'LTC',
  'ethereum': 'ETH',
  'skrill': 'Skrill',
  'stripe': 'Stripe',
  'bitcoincash': 'BTH',
  'perfectmoney': 'Perfect Money'
}

class OrderDetail extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      resending: false,
      openModal: false,
      openIssueReplacementModal: false,
      openProcessOrderModal: false,
      order: {}
    }

    this.id = this.props.match.params.id
    this.initializeData = this.initializeData.bind(this)
  }

  closeResendModal() {
    this.setState({openModal: false})
  }

  closeIssueReplacementModal() {
    this.setState({openIssueReplacementModal: false})
  }

  closeProcessOrderModal() {
    this.setState({openProcessOrderModal: false})
  }

  openResendModal() {
    this.setState({openModal: true})
  }

  openIssueReplacementModal() {
    this.setState({openIssueReplacementModal: true})
  }

  openProcessOrderModal() {
    this.setState({openProcessOrderModal: true})
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData () {
    this.setState({ loading: true })
    this.props.actions.getOrderByID(this.id).then(res => {
      if(res.status == 200)
        this.setState({order: res.data.invoice})
      else throw res
    }).catch((err) => {
      this.props.commonActions.tostifyAlert('error', err.error)
      this.props.history.push(`/dashboard/${user}/orders`)
    }).finally(() => {
      this.setState({ loading: false })
    })
  }


  resendInvoice(email){
    this.setState({ resending: true })
    this.props.actions.resendInvoice({
      uniqid: this.state.order.uniqid
    }).then(res => {
      if(res.status == 200)
      this.props.commonActions.tostifyAlert('success', res.message)
      else throw res
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
      
    }).finally(() => {
      this.setState({ resending: false })
    })
  }

  render() {
    const { 
      loading, 
      order, 
      resending, 
      openModal, 
      openIssueReplacementModal, 
      openProcessOrderModal 
    } = this.state

    let custom_fields = []

    if(order.custom_fields){
      const data = JSON.parse(order.custom_fields || {})['custom_fields'] || {}
      custom_fields = Object.keys(data).map((key) => {
        return {field: key, value: data[key]}
      })
    }

    return (
      <div className="order-detail-screen mt-3">
        <div className="animated fadeIn">
          <ResendModal openModal={openModal} 
            resendInvoice = {this.resendInvoice.bind(this)}
            invoiceId = {order.uniqid}
            email = {order.customer_email}
            closeModal={this.closeResendModal.bind(this)}/>
          <IssueReplacementModal openModal={openIssueReplacementModal} 
            // resendInvoice = {this.resendInvoice.bind(this)}
            invoiceId = {order.uniqid}
            // email = {order.customer_email}
            closeModal={this.closeIssueReplacementModal.bind(this)}/>
          <ProcessOrderModal  
            openModal={openProcessOrderModal}
            invoiceId = {order.uniqid}
            status = {order.status}
            refreshOrder = {() => this.initializeData()}
            email = {order.customer_email}
            closeModal={this.closeProcessOrderModal.bind(this)}
          />
          <Breadcrumb className="mb-0">
            <BreadcrumbItem active className="mb-0">
              <a onClick={(e) => this.props.history.push(`/dashboard/${user}/orders`)}><i className="fas fa-chevron-left"/> Orders</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <CardBody className="p-4">
              {
                loading ?
                  <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>
                : 
                  <Row className="">
                    <Col lg={12}>
                      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                        <h4 className="title">View Order {order.developer_invoice == '1' &&
                          <span className={`small-badge badge-developer`} style={{  margin: '0 auto'}}>
                            Developer
                          </span>
                        }</h4>
                        <div className='orderHeaderButtons'>
                          {
                            order.status && (['0', '1'].includes(order.status)) && 
                              <Button color="primary" className="mr-2" onClick={this.openResendModal.bind(this)}>
                                Resend Order
                              </Button>
                          }
                          {
                            order.status && (['1'].includes(order.status)) && 
                              <Button color="primary" className="mr-2" onClick={this.openIssueReplacementModal.bind(this)}>
                                Issue Replacement
                              </Button>
                          }
                          { 
                            order.status && (['4'].includes(order.status)) && 
                              <Button color="primary" className="" onClick={this.openProcessOrderModal.bind(this)}>
                                Process Order
                              </Button>
                          }
                        </div>
                      </div>
                      
                    </Col>
                    <Col lg={12}>
                      <Row className="flex">
                        <Col lg={12} className="mb-5">
                          <div className="d-flex align-items-center">
                            <img src={PAYMENT_ICONS[order.gateway]} className="avatar mr-2"/>
                            <div>
                              <p className="email text-primary mb-1 d-flex align-items-center">
                                <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>
                                <span className={`small-badge badge-${ORDER_STATUS[order.status] && ORDER_STATUS[order.status].toLowerCase()}`} style={{  margin: '0 auto'}}>
                                  {ORDER_STATUS[order.status]}
                                </span>
                              </p>
                              <p className="mb-0">{order.uniqid}</p>
                            </div>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="d-flex">
                            <p className="title">Product</p>
                            <p>
                              <Link to={`/dashboard/${user}/products/all/edit/${order.product_id}`}>
                                {order.developer_invoice == '1'?order.developer_title:(order.product && order.product.title || '')}
                              </Link>
                            </p>
                          </div>
                          <div className="d-flex">
                            <p className="title">Value</p>
                            <p>{`${config.CURRENCY_LIST[order.currency]}${order.total_display} ${order.currency}`}</p>
                          </div>
                          <div className="d-flex">
                            <p className="title">Created At</p>
                            <p>{moment(new Date(order.created_at*1000)).format('DD, MMM YYYY HH:mm')}</p>
                          </div>
                          <div className="d-flex">
                            <p className="title">Quantity</p>
                            <p>{order.quantity}</p>
                          </div>
                          <div className="d-flex">
                            <p className="title">Coupon</p>
                            <p>{order.coupon_id?order.coupon_id:'No Coupon'}</p>
                          </div>
                          
                          
                        </Col>
                        <Col lg={6}>
                          <div className="d-flex">
                            <p className="title">Gateway</p>
                            <p>{PAYMENT_OPTS[order.gateway]}</p>
                          </div>
                          
                          <div className="d-flex">
                              <p className="title">IP Address</p>
                              <p>{order.ip} {order.is_vpn_or_proxy == '1' && <span className="small-badge proxy-label">VPN/Proxy</span> }</p>
                            </div>
                            <div className="d-flex">
                              <p className="title">Device</p>
                              <p>{order.user_agent}</p>
                            </div>
                            <div className="d-flex">
                              <p className="title">Country</p>
                              <p><i className={`flag-icon flag-icon-${order.country && order.country.toLowerCase()} mr-2`}/> 
                                {order.location}</p>
                            </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
              }
            </CardBody>
          </Card>
          <Row>
          <Col lg={12}>
              <Card>
                <CardBody className="">
                  {
                    loading ?
                      <Row>
                        <Col lg={12}>
                          <Loader />
                        </Col>
                      </Row>
                    :
                    <Row className="">
                      <Col lg={12}>
                        <FormGroup className="mb-4">
                          <h4 className="title">Delivered Webhooks</h4>
                        </FormGroup>
                      </Col>
                      <Col lg={12}>
                        <Row>
                          <Col lg={12}>
                          <BootstrapTable
                            options={ tableOptions() }
                            data={order.webhooks || []}
                            version="4"
                            pagination
                            totalSize={order.webhooks ? order.webhooks.length : 0}
                            className="provided-custom-table"
                            trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="url"
                            width='30%'
                          >
                            URL
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="event"
                            width='20%'
                          >
                            Event
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="attempts"
                            dataAlign='center'
                            width='10%'
                          >
                            Attemps
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="response_code"
                            dataAlign='center'
                            width='20%'
                          >
                            Response Code
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="created_at"
                            dataAlign='center'
                            dataFormat={(cell, row) => <div>
                              {moment(new Date(row.created_at*1000)).format('DD MMM hh:mm:ss')}
                            </div>}
                          >
                            Time
                          </TableHeaderColumn>
                        </BootstrapTable>
                          </Col>
                          
                        </Row>
                      </Col>
                    </Row>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div>
                <Card>
                  <CardBody className="">
                    {
                      loading ?
                        <Row>
                          <Col lg={12}>
                            <Loader />
                          </Col>
                        </Row>
                      :
                      <Row className="">
                        <Col lg={12}>
                          <FormGroup className="mb-4">
                            <h4 className="title">Delivered Goods</h4>
                          </FormGroup>
                        </Col>
                        <Col lg={12}>
                          <Row>
                            <Col lg={12}>
                              {
                                (order.serials && order.serials.length == 0)?
                                  <label>No product has been delivered</label>:
                                  (order.serials || []).map(ser => <p>{ser}</p>)
                              }
                              
                            </Col>
                            
                          </Row>
                        </Col>
                      </Row>
                    }
                  </CardBody>
                </Card>
                {
                  order.developer_invoice == '1'  && 
                    <Card>
                      <CardBody className="">
                        {
                          loading ?
                            <Row>
                              <Col lg={12}>
                                <Loader />
                              </Col>
                            </Row>
                          :
                          <Row className="">
                            <Col lg={12}>
                              <FormGroup className="mb-4">
                                <Label className="title">Developer Settings</Label>
                              </FormGroup>
                            </Col>
                            <Col lg={12}>
                              <Row>
                                <Col lg={12}>
                                  <div className="d-flex">
                                    <p className="title">Title:</p>
                                    <p className="title">{order.developer_title}</p>
                                  </div>
                                  <div className="d-flex">
                                    <p className="title">Webhook:</p>
                                    <p className="title">{order.developer_webhook}</p>
                                  </div>
                                  <div className="d-flex">
                                    <p className="title">Return url:</p>
                                    <p className="title">{order.developer_return_url}</p>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        }
                      </CardBody>
                    </Card> 
                }
                {
                  order.gateway && CRYPTOS.includes(order.gateway)  && 
                    <Card>
                      <CardBody className="">
                        {
                          loading ?
                            <Row>
                              <Col lg={12}>
                                <Loader />
                              </Col>
                            </Row>
                          :
                          <Row className="">
                            <Col lg={12}>
                              <FormGroup className="mb-4">
                                <h4 className="title">{PAYMENT_OPTS[order.gateway]} Details</h4>
                              </FormGroup>
                            </Col>
                            <Col lg={12}>
                              <Label className="title">General Info</Label>
                              <Row>
                                <Col lg={12}>
                                  {
                                    ((order.crypto_transactions && order.crypto_transactions.length > 0) ? order.crypto_transactions : [undefined]).map(trans => 
                                      <div className="d-info">
                                        <p className="d-addr">
                                          <label>Address:</label> <img src={PAYMENT_ICONS[order.gateway]} width="15"/> - 
                                          {order.gateway == 'bitcoin' && <a href={`https://www.blockchain.com/btc/address/${order.crypto_address}`} target="blank">{order.crypto_address}</a>}
                                          {order.gateway == 'litecoin' && <a href={`https://live.blockcypher.com/ltc/address/${order.crypto_address}`} target="blank">{order.crypto_address}</a>}
                                          {order.gateway == 'ethereum' && <a href={`https://etherscan.io/address/${order.crypto_address}`} target="blank">{order.crypto_address}</a>}
                                        </p>
                                        <p className="hash">
                                          <label>Amount:</label> {trans !== undefined ? trans.crypto_amount : order.crypto_amount} 
                                        </p>
                                      </div>
                                    )
                                  }
                                </Col>
                              </Row>
                            </Col>
                            {
                              !["0", "2"].includes(order.status) && <Col lg={12}>
                                <Label className="title">Transactions</Label>
                                <Row>
                                  <Col lg={12}>
                                    {
                                      order.crypto_transactions && order.crypto_transactions.map(trans => 
                                        <div className="d-flex">
                                          <p className="hash">
                                            {trans.crypto_amount} <img src={PAYMENT_ICONS[order.gateway]} width="15"/> - 
                                            {order.gateway == 'bitcoin' && <a href={`https://www.blockchain.com/btc/tx/${trans.hash}`} target="blank">{trans.hash}</a>}
                                            {order.gateway == 'litecoin' && <a href={`https://live.blockcypher.com/ltc/tx/${trans.hash}`} target="blank">{trans.hash}</a>}
                                            {order.gateway == 'ethereum' && <a href={`https://etherscan.io/tx/${trans.hash}`} target="blank">{trans.hash}</a>}
                                          </p>
                                        </div>
                                      )
                                    }
                                  </Col>
                                </Row>
                              </Col>
                            }
                            {
                              order.crypto_transactions && order.crypto_transactions.length == 1 && order.crypto_payout_transaction && (
                                <Col lg={12}>
                                  <Label className="title">Payout</Label>
                                  <Row>
                                    <Col lg={12}>
                                      <div className="d-flex">
                                        <p className="hash">
                                          {order.crypto_payout_transaction.crypto_amount} <img src={PAYMENT_ICONS[order.gateway]} width="15"/> - 
                                          {order.gateway == 'bitcoin' && <a href={`https://www.blockchain.com/btc/tx/${order.crypto_payout_transaction.hash}`} target="blank">{order.crypto_payout_transaction.hash}</a>}
                                          {order.gateway == 'litecoin' && <a href={`https://live.blockcypher.com/ltc/tx/${order.crypto_payout_transaction.hash}`} target="blank">{order.crypto_payout_transaction.hash}</a>}
                                          {order.gateway == 'ethereum' && <a href={`https://etherscan.io/tx/${order.crypto_payout_transaction.hash}`} target="blank">{order.crypto_payout_transaction.hash}</a>}
                                        </p>
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              )
                            }
                          </Row>
                        }
                      </CardBody>
                    </Card> 
                }
              </div>
            </Col>
            <Col lg={6}>
              <Card>
                <CardBody className="">
                  {
                    loading ?
                      <Row>
                        <Col lg={12}>
                          <Loader />
                        </Col>
                      </Row>
                    :
                    <Row className="">
                      <Col lg={12}>
                        <FormGroup className="mb-4">
                          <h4 className="title">Provided Custom Fields</h4>
                        </FormGroup>
                      </Col>
                      <Col lg={12}>
                      <BootstrapTable
                          options={ tableOptions() }
                          data={custom_fields}
                          version="4"
                          pagination
                          totalSize={custom_fields ? custom_fields.length : 0}
                          className="provided-custom-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="field"
                            dataSort
                            width='50%'
                          >
                            Field
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="value"
                            dataSort
                          >
                            Value
                          </TableHeaderColumn>
                        </BootstrapTable>
                      </Col>
                    </Row>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
          
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
