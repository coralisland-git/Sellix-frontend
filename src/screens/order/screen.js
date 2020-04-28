import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { ORDER } from 'constants/types'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  ButtonGroup,
  Input
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import moment from 'moment'
import config from 'constants/config'
import { Loader, Spin } from 'components'
import { tableOptions } from 'constants/tableoptions'

import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

import * as OrderActions from './actions'
import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    order_list: state.order.order_list,
    live_order_display: state.order.live_order_display
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(OrderActions, dispatch),
    setFilter: (value) => { 
      dispatch({
        type: ORDER.LIVE_ORDER_DISPLAY,
        payload: value
      }) 
    }
  })
}

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


class Order extends React.Component { 
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search_key: null,
    }

    this.initializeData = this.initializeData.bind(this)
    this.gotoDetail = this.gotoDetail.bind(this)
    this.renderOrderInfo = this.renderOrderInfo.bind(this)
    this.changeFilter = this.changeFilter.bind(this)
  }

  componentDidMount () {
    this.initializeData(this.props.live_order_display)
  }

  initializeData (filter) {
    this.setState({ loading: true })

    if(filter == 'all')
      this.props.actions.getOrderList().finally(() => {
        this.setState({loading: false})
      })
    else if(filter == 'live')
      this.props.actions.getLiveOrders().finally(() => {
        this.setState({loading: false})
      })
  }

  changeFilter(filter) {
    this.props.setFilter(filter)
    this.initializeData(filter)
  }

  gotoDetail(id) {
    this.props.history.push({
      pathname: `/dashboard/${user}/orders/view/${id}`
    })
  }

  renderOrderInfo (cell, row) {
    return (
      <div>
        <p><a onClick={(e) => this.gotoDetail(row.uniqid)}>
          <i className={`flag-icon flag-icon-${row.country.toLowerCase()}`} title={row.location}>
            </i>&nbsp;&nbsp;&nbsp;{`${PAYMENT_OPTS[row.gateway]} - ${row.customer_email}`}</a>
        </p>
        <p className="caption">{row.uniqid} - {row.developer_invoice == '1'?row.developer_title:row.product_title}</p>
      </div>
    )  
  }

  renderOrderStatus (cell, row) {
    return (
      <div className={`badge badge-${ORDER_STATUS[row.status].toLowerCase()}`} style={{  margin: '0 auto'}}>
        {ORDER_STATUS[row.status]} {ORDER_STATUS == '3' && <Spin/>}
      </div>
    )  
  }

  renderOrderValue(cell, row) {
    return (
      <div className="order">
        <p className="order-value">{'+' + config.CURRENCY_LIST[row.currency] + row.total_display}</p>
        <p className="caption">{row.crypto_amount?(row.crypto_amount + ' '):''} {PAYMENT_OPTS[row.gateway]}</p>
      </div>
    )  
  }

  renderOrderTime(cell, row) {
    return (
      <div>
        <p>{new moment(new Date(row.created_at*1000)).format('DD, MMM YYYY')}</p>
        <p>{new moment(new Date(row.created_at*1000)).format('HH:mm')}</p>
      </div>
    )  
  }


  searchOrders(products) {
    const { search_key } = this.state
    const search_fields = ['customer_email', 'total_display', 'uniqid', 'gateway', 'status']

    const data = products.filter(product => {
      for(let i=0; i<search_fields.length; i++)
        if(product[search_fields[i]] && product[search_fields[i].toLowerCase()].includes(search_key.toLowerCase()))
          return true
      return false
    })

    return data
  }

  render() {

    const { loading, search_key } = this.state
    let { order_list, live_order_display } = this.props

    if(search_key)
      order_list = this.searchOrders(order_list)

    return (
      <div className="order-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <h1 className="mr-3 mb-1">Orders</h1>
                    <div className="filter-button-group d-flex">
                      <a className={`filter-btn ${live_order_display == 'all'?'active':''}`} onClick={(e) => this.changeFilter('all')}>All</a>
                      <a className={`filter-btn ${live_order_display == 'live'?'active':''}`} onClick={(e) => this.changeFilter('live')}>Live</a>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-end">
                    <div className="searchbar white">
                      <i className="fas fa-search"/>
                      <Input placeholder="Search..." 
                        className="header-search-input"
                        onChange={(e) => {
                          this.setState({search_key: e.target.value})
                        }}
                      ></Input>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            { 
              live_order_display == 'all' && 
                <CardBody className="p-0">
                  {
                    loading ?
                      <Row>
                        <Col lg={12}>
                          <Loader />
                        </Col>
                      </Row>
                    :
                    <Row>
                      <Col lg={12}>
                        <div>
                          <BootstrapTable
                            options={{...tableOptions(), onRowClick: (row) => {
                              this.gotoDetail(row.uniqid)}, sizePerPage: 15
                            }}
                            data={order_list}
                            version="4"
                            pagination
                            totalSize={order_list ? order_list.length : 0}
                            className="product-table"
                            trClassName="cursor-pointer"
                          >
                            <TableHeaderColumn
                              isKey
                              dataField="customer_email"
                              dataFormat={this.renderOrderInfo}
                              dataSort
                              width='45%'
                            >
                              Info
                            </TableHeaderColumn>
                            <TableHeaderColumn
                              dataField="status"
                              dataAlign="center"
                              dataFormat={this.renderOrderStatus}
                              dataSort
                              width='20%'
                            >
                              Status
                            </TableHeaderColumn>
                            <TableHeaderColumn
                              dataField="total_display"
                              dataAlign="center"
                              dataSort
                              dataFormat={this.renderOrderValue}
                              width='20%'
                            >
                              Value
                            </TableHeaderColumn>
                            <TableHeaderColumn
                              dataField="created_at"
                              dataAlign="right"
                              dataFormat={this.renderOrderTime}
                              dataSort
                              width='15%'
                            >
                              Time
                            </TableHeaderColumn>
                          </BootstrapTable>
                        </div>
                      </Col>
                    </Row>
                  }
                </CardBody>
            }
            {
              live_order_display == 'live' && 
                <div>
                {
                  loading ?
                    <Row>
                      <Col lg={12}>
                        <Loader />
                      </Col>
                    </Row>
                  :
                  <Row className="live-orders-list">
                    <Col lg={3}>
                      <Card>
                        <CardBody className="bg-white p-3">
                          <h6 className="title mb-4">PAYPAL</h6>
                          <div>
                            {
                              order_list.filter(ord => ord.gateway == 'paypal').map((order, key) => 
                                <Card key={key} className="live-card" onClick={() => this.gotoDetail(order.uniqid)}>
                                  <CardBody className="p-3">
                                    <a>{order.uniqid}</a>
                                    <p>{order.customer_email}</p>
                                    <p className="d-flex align-items-center">
                                      <span>
                                        {`${config.CURRENCY_LIST[order.currency]}${order.total_display} ~ Awaiting Payment`} 
                                      </span>
                                      <span className="sk-spinner sk-spinner-pulse"></span>
                                    </p>
                                    <p className="date">
                                      {new moment(new Date(order.created_at*1000)).format('DD, MMM YYYY HH:mm')}
                                       <span className="ml-1 mr-1">-</span> 
                                       <a>{order.username}</a></p>
                                  </CardBody>
                                </Card>
                              )
                            }
                            { order_list && order_list.filter(ord => ord.gateway == 'paypal').length == 0 && 
                              <p className="text-grey">No pending Paypal orders found.</p>}
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg={3}>
                      <Card>
                        <CardBody className="bg-white p-3">
                          <h6 className="title mb-4">BITCOIN</h6>
                          <div>
                            {
                              order_list.filter(ord => ord.gateway == 'bitcoin').map((order, key) => 
                                <Card key={key} className="live-card" onClick={() => this.gotoDetail(order.uniqid)}>
                                  <CardBody className="p-3">
                                    <a>{order.uniqid}</a>
                                    <p>{order.customer_email}</p>
                                    <p className="d-flex align-items-center">
                                      <span>
                                        {`${config.CURRENCY_LIST[order.currency]}${order.total_display} ~ Awaiting Payment`} 
                                      </span>
                                      <span className="sk-spinner sk-spinner-pulse"></span>
                                    </p>
                                    <p className="date">
                                      {new moment(new Date(order.created_at*1000)).format('DD, MMM YYYY HH:mm')}
                                       <span className="ml-1 mr-1">-</span> 
                                       <a>{order.username}</a></p>
                                  </CardBody>
                                </Card>
                              )
                            }
                            { order_list && order_list.filter(ord => ord.gateway == 'bitcoin').length == 0 && 
                              <p className="text-grey">No pending Bitcoin orders found.</p>}
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg={3}>
                      <Card>
                        <CardBody className="bg-white p-3">
                          <h6 className="title mb-4">ETHEREUM</h6>
                          <div>
                            {
                              order_list.filter(ord => ord.gateway == 'ethereum').map((order, key) => 
                                <Card key={key} className="live-card" onClick={() => this.gotoDetail(order.uniqid)}>
                                  <CardBody className="p-3">
                                    <a>{order.uniqid}</a>
                                    <p>{order.customer_email}</p>
                                    <p className="d-flex align-items-center">
                                      <span>
                                        {`${config.CURRENCY_LIST[order.currency]}${order.total_display} ~ Awaiting Payment`} 
                                      </span>
                                      <span className="sk-spinner sk-spinner-pulse"></span>
                                    </p>
                                    <p className="date">
                                      {new moment(new Date(order.created_at*1000)).format('DD, MMM YYYY HH:mm')}
                                       <span className="ml-1 mr-1">-</span> 
                                       <a>{order.username}</a></p>
                                  </CardBody>
                                </Card>
                              )
                            }
                            { order_list && order_list.filter(ord => ord.gateway == 'ethereum').length == 0 && 
                              <p className="text-grey">No pending Ethereum orders found.</p>}
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg={3}>
                      <Card>
                        <CardBody className="bg-white p-3">
                          <h6 className="title mb-4">LITECOIN</h6>
                          <div>
                            {
                              order_list.filter(ord => ord.gateway == 'litecoin').map((order, key) => 
                                <Card key={key} className="live-card" onClick={() => this.gotoDetail(order.uniqid)}>
                                  <CardBody className="p-3">
                                    <a>{order.uniqid}</a>
                                    <p>{order.customer_email}</p>
                                    <p className="d-flex align-items-center">
                                      <span>
                                        {`${config.CURRENCY_LIST[order.currency]}${order.total_display} ~ Awaiting Payment`} 
                                      </span>
                                      <span className="sk-spinner sk-spinner-pulse"></span>
                                    </p>
                                    <p className="date">
                                      {new moment(new Date(order.created_at*1000)).format('DD, MMM YYYY HH:mm')}
                                       <span className="ml-1 mr-1">-</span> 
                                       <a>{order.username}</a></p>
                                  </CardBody>
                                </Card>
                              )
                            }
                            { order_list && order_list.filter(ord => ord.gateway == 'litecoin').length == 0 && 
                              <p className="text-grey">No pending Litecoin orders found.</p>}
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                }
                </div>
            }
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)
