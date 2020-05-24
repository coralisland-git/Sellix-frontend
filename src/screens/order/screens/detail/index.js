import React from 'react'
import Link from 'react-router-dom/es/Link'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, Row, Col, BreadcrumbItem, Breadcrumb } from 'components/reactstrap'
import { Button } from 'components';
import * as moment from 'moment/moment'
import { Loader } from 'components'
import includes from "lodash/includes"
import config from "constants/config"
import { CommonActions } from 'services/global'
import Webhooks from './webhooks'
import Custom from './custom'
import Goods from './goods'
import Invoice from './invoice'
import { ResendModal, IssueReplacementModal, ProcessOrderModal, QueueInvoice } from './sections'

import * as OrderActions from '../../actions'

import './style.scss'


const user = window.localStorage.getItem('userId')


class OrderDetail extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      resending: false,
      openModal: false,
      openIssueReplacementModal: false,
      openProcessOrderModal: false,
      openQueueOrderModal: false,
      order: {}
    }

    this.id = this.props.match.params.id
  }

  closeResendModal = () => {
    this.setState({openModal: false})
  }

  closeIssueReplacementModal = () =>{
    this.setState({openIssueReplacementModal: false})
  }

  closeQueueOrderModal = () => {
    this.setState({openQueueOrderModal: false})
  }

  closeProcessOrderModal = () => {
    this.setState({openProcessOrderModal: false})
  }

  openResendModal = () => {
    this.setState({openModal: true})
  }

  openIssueReplacementModal = () => {
    this.setState({openIssueReplacementModal: true})
  }

  openQueueOrderModal = () => {
    this.setState({openQueueOrderModal: true})
  }

  openProcessOrderModal = () => {
    this.setState({openProcessOrderModal: true})
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })
    this.props.getOrderByID(this.id).then(res => {
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


  resendInvoice = () => {
    this.setState({ resending: true })
    this.props.resendInvoice({
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


  routeHandle = () => {
    const { location, history } = this.props;
    const isAdmin = includes(location.pathname, '/admin')
    return <a onClick={() => history.length > 1 ? history.go(-1) : history.push(isAdmin ? `/admin/invoices` : `/dashboard/${user}/orders`)}>
      <i className="fas fa-chevron-left"/> Back
    </a>
  }

  render() {
    const { 
      loading, 
      order,
      openModal, 
      openIssueReplacementModal,
      openQueueOrderModal,
      openProcessOrderModal
    } = this.state


    let link = window.location.pathname.includes("admin/invoices") ?
        `/admin/users/${order.username}/product/edit/${order.product_id}` :
        `/dashboard/${user}/products/edit/${order.product_id}`;

    let cav = Number(order.crypto_amount * order.crypto_exchange_rate).toFixed(2)
    let crv = Number(order.crypto_received * order.crypto_exchange_rate).toFixed(2)

    if(cav === crv) {
      crv -= 0.01
    }

    return (
      <div className="order-detail-screen mt-3">
        <div className="animated fadeIn">

          <Breadcrumb className="mb-0">
            <BreadcrumbItem active className="mb-0">
              {this.routeHandle()}
            </BreadcrumbItem>
          </Breadcrumb>

          <Card>
            <CardBody className="p-4">
              {loading && <Row><Col lg={12}><Loader /></Col></Row>}
              {!loading && <Row className="">
                    <Col lg={12}>
                      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                        <h4 className="title d-flex">
                          View Order {+order.developer_invoice === 1 && <span className={`small-badge badge-developer`} style={{  margin: '0 auto'}}>Developer</span>}
                          <span className={`order-badge badge-${(config.ORDER_STATUS[order.status] || '').toLowerCase()} ml-2`} style={{  margin: '0 auto'}}>
                            {+order.status === 3 && <i className={"far fa-hourglass"} style={{ fontSize: ".9rem", color: "#1d183d"}}/>}
                            {+order.status !== 3 && <img src={config.STATUS_ICON[order.status]} alt="" />}
                            <span className={`text-${(config.ORDER_STATUS[order.status] || '').toLowerCase()} ml-2`}>{config.ORDER_STATUS[order.status]}</span>
                          </span>
                          {+order.status === 4 &&
                            <span className={`order-badge badge-${(config.ORDER_STATUS[order.status] || '').toLowerCase()} ml-2`} style={{margin: '0 auto'}}>
                              <span className={`text-${(config.ORDER_STATUS[order.status] || '').toLowerCase()}`}>
                                {config.CURRENCY_LIST[order.currency]}{crv} of {config.CURRENCY_LIST[order.currency]}{cav}
                              </span>
                            </span>
                          }
                        </h4>
                        <div className='orderHeaderButtons'>
                          {
                            order.status && (['0', '1', '4'].includes(order.status)) &&
                              <Button color="primary" className="mr-2" onClick={this.openResendModal}>
                                Resend Order
                              </Button>
                          }
                          {
                            order.status && (['1'].includes(order.status)) && 
                              <Button color="primary" className="mr-2" onClick={this.openIssueReplacementModal}>
                                Issue Replacement
                              </Button>
                          }
                          { 
                            order.status && (['4'].includes(order.status)) && 
                              <Button color="primary" className="" onClick={this.openProcessOrderModal}>
                                Process Order
                              </Button>
                          }
                          {
                            order.status && (['2'].includes(order.status)) &&
                              <Button color="primary" className="" onClick={this.openQueueOrderModal}>
                                Queue Order
                              </Button>
                          }
                        </div>
                      </div>
                      
                    </Col>
                    <Col lg={12}>
                      <Row className="flex">
                        <Col lg={12} className="mb-4">
                          <div className="d-flex align-items-center">
                            <img src={config.PAYMENT_ICONS[order.gateway]} className="avatar mr-3"/>
                            <div className="pb-1">
                              <p className="email text-primary mb-1 d-flex align-items-center">
                                <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>
                              </p>
                              <p className="mb-0 title">{order.uniqid}</p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <p></p>
                      <Row className="mb-4 pl-5">
                        <Col lg={3}>
                          <div className="d-flex flex-column">
                            <p className="title">Product</p>
                            <p className="value">
                              <Link to={link} target={"_blank"}>
                                {order.developer_invoice == '1'?order.developer_title:(order.product && order.product.title || '')}
                              </Link>
                            </p>
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="d-flex flex-column">
                            <p className="title">Quantity</p>
                            <p className="value">{order.quantity}</p>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="d-flex flex-column">
                            <p className="title">IP Address</p>
                            <p className="value">{order.ip} {order.is_vpn_or_proxy == '1' && <span className="small-badge proxy-label">VPN/Proxy</span> }</p>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-4 pl-5">
                        <Col lg={3}>
                          <div className="d-flex flex-column">
                            <p className="title">Value</p>
                            <p className="value">{`${order.currency} ${order.total_display}`}</p>
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="d-flex flex-column">
                            <p className="title">Coupon</p>
                            <p className="value">{order.coupon_code?order.coupon_code:'No Coupon'}</p>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="d-flex flex-column">
                            <p className="title">Country</p>
                            <p className="value"> 
                              {order.location}
                              {order.country && <img src={`${config.CDN_FLAGS_URL}${order.country.toLowerCase()}.svg`} className={`flag-icon ml-2`} alt={""} />}
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row className="pl-5">
                        <Col lg={3}>
                          <div className="d-flex flex-column">
                            <p className="title">Created At</p>
                            <p className="value">{moment(new Date(order.created_at*1000)).format('DD, MMM YYYY HH:mm')}</p>
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="d-flex flex-column">
                            <p className="title">Gateway</p>
                            <p className="value">{config.PAYMENT_OPTS[order.gateway]}</p>
                          </div>
                        </Col>
                        <Col lg={6}>  
                          <div className="d-flex flex-column">
                            <p className="title">Device</p>
                            <p className="value">{order.user_agent}</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
              }
            </CardBody>
          </Card>


          <Row>
            <Col lg={6}>
              <div>
                <Goods loading={loading} order={order} />
                <Invoice loading={loading} order={order}/>
              </div>
            </Col>
            <Custom custom_fields={order.custom_fields} loading={loading} />
          </Row>

          <Webhooks webhooks={order.webhooks || []} loading={loading} />

          <ResendModal
              openModal={openModal}
              resendInvoice={this.resendInvoice}
              invoiceId={order.uniqid}
              email={order.customer_email}
              closeModal={this.closeResendModal}/>
          <QueueInvoice
              openModal={openQueueOrderModal}
              invoiceId={order.uniqid}
              status={order.status}
              closeModal={this.closeQueueOrderModal}/>
          <IssueReplacementModal
              openModal={openIssueReplacementModal}
              invoiceId={order.uniqid}
              closeModal={this.closeIssueReplacementModal}/>
          <ProcessOrderModal
              openModal={openProcessOrderModal}
              invoiceId={order.uniqid}
              status={order.status}
              refreshOrder={this.initializeData}
              email={order.customer_email}
              closeModal={this.closeProcessOrderModal}/>

        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  product_list: state.product.product_list
})

const mapDispatchToProps = (dispatch) => ({
  resendInvoice: bindActionCreators(OrderActions.resendInvoice, dispatch),
  getOrderByID: bindActionCreators(OrderActions.getOrderByID, dispatch),
  commonActions: bindActionCreators(CommonActions, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
