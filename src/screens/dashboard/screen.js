import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap'

import {DateRangePicker2, Loader, Spin} from 'components'
import { DashBoardChart } from './sections'
import { getAnalyticsData, geLastInvoices } from './actions'

import './style.scss'
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import {tableOptions} from "../../constants/tableoptions";
import config from "../../constants/config";


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

const mapDispatchToProps = dispatch => ({
  getAnalyticsData: bindActionCreators(getAnalyticsData, dispatch),
  geLastInvoices: bindActionCreators(geLastInvoices, dispatch),
})


const Progress = ({ progress, isPositive, is24 }) => {
  if(is24) {
    return (
        <div className={'progress-indicator'} >
          {progress !== 0 ?
              (isPositive ?
                  <span>+<b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span> :
                  <span><b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span>) :
              <span><b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span>
          }
          {
            progress !== 0 ?
                <i className={`fas fa-caret-${isPositive ? 'up' : 'down'}`} />:
                <i className={`fa fa-minus`} />
          }
        </div>
    )
  } else {
    return null
  }
}


const DATE_RANGES =  {
  'Last 24 hours': [moment().subtract(1, 'days'), moment(), 'daily'],
  'Last 30 days': [moment().subtract(29, 'days'), moment(), 'daily'],
  'This month': [moment().startOf('month'), moment().endOf('month'), 'daily'],
  'This year': [moment().startOf('year'), moment(), 'monthly'],
  'Total': [moment(new Date('2019-01-01')), moment(new Date().setDate(new Date().getDate() + 1)), 'yearly'],
}


class Dashboard extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      range: 'last-24hours',
      loading: false,
      chartData: [],
      invoices: [],
      totalRevenue: 0,
      totalOrders: 0,
      totalViews: 0,
      totalQueries: 0,
      revenueProgress: 0,
      ordersProgress: 0,
      viewsProgress: 0,
      queriesProgress: 0,
    }
  }

  getAnalyticsData = (date, initial) => {
    const startDate = date.startDate.format('MM/DD/YYYY');
    const endDate = date.endDate.format('MM/DD/YYYY');
    const { getAnalyticsData, geLastInvoices } = this.props;

    this.setState({loading: true})

    if(initial) {
      Promise.all([
          getAnalyticsData(moment().subtract(2, 'week').format('MM/DD/YYYY'), moment().format('MM/DD/YYYY')),
          getAnalyticsData(startDate, endDate),
          geLastInvoices()
      ]).then(([{ data: { analytics }}, { data: { analytics: { total } }}, { data: { invoices } }]) => {

        this.setState({
          totalRevenue: total.revenue || 0,
          totalOrders: total.orders_count || 0,
          totalViews: total.views_count || 0,
          totalQueries: total.queries_count || 0,
          revenueProgress: total.revenue_progress || 0,
          ordersProgress: total.orders_count_progress || 0,
          viewsProgress: total.views_count_progress || 0,
          queriesProgress: total.queries_count_progress || 0,
          chartData: analytics['daily'],
          invoices: invoices
        })
      })   .finally(() => {
        this.setState({loading: false})
      })
    } else {
      getAnalyticsData(startDate, endDate)
          .then(({ data: { analytics } }) => {
            const { total } = analytics;

            this.setState({
              totalRevenue: total.revenue || 0,
              totalOrders: total.orders_count || 0,
              totalViews: total.views_count || 0,
              totalQueries: total.queries_count || 0,
              revenueProgress: total.revenue_progress || 0,
              ordersProgress: total.orders_count_progress || 0,
              viewsProgress: total.views_count_progress || 0,
              queriesProgress: total.queries_count_progress || 0,
              chartData: analytics[DATE_RANGES[date.chosenLabel || 'Last 24 hours'][2]]
            })
          })
          .finally(() => {
            this.setState({loading: false})
          })
    }

  }

  componentDidMount() {
    const [startDate, endDate] = DATE_RANGES['Last 24 hours'];
    this.getAnalyticsData({ startDate, endDate }, true)
  }


  gotoDetail(id) {
    this.props.history.push({
      pathname: `/dashboard/$asd/orders/view/${id}`
    })
  }

  renderOrderInfo = (cell, row) => (
      <div>
        <p><a onClick={(e) => this.gotoDetail(row.uniqid)}>
          <i className={`flag-icon flag-icon-${row.country.toLowerCase()}`} title={row.location}>
          </i>&nbsp;&nbsp;&nbsp;{`${PAYMENT_OPTS[row.gateway]} - ${row.customer_email}`}</a>
        </p>
        <p className="caption">{row.uniqid} - {row.developer_invoice === '1' ? row.developer_title : row.product_title}</p>
      </div>
  )

  renderOrderStatus = (cell, row) => (
      <div>
        {PAYMENT_OPTS[row.gateway]}
      </div>
  )

  renderOrderValue = (cell, row) => (
      <div className="order">
        <p className="order-value">{'+' + config.CURRENCY_LIST[row.currency] + row.total_display}</p>
        <p className="caption">{row.crypto_amount ? (row.crypto_amount + ' ') : ''} {PAYMENT_OPTS[row.gateway]}</p>
      </div>
  )

  renderOrderTime = (cell, row) => (
      <div>
        <p>{moment(row.created_at*1000).format('DD, MMM YYYY')}</p>
        <p>{moment(row.created_at*1000).format('HH:mm')}</p>
      </div>
  )


  render() {
    const {
      chartData,
      totalRevenue,
      totalOrders,
      totalViews,
      totalQueries,
      loading,
      revenueProgress,
      ordersProgress,
      viewsProgress,
      queriesProgress,
      invoices
    } = this.state;

    return (
      <div className="dashboard-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="flex-wrapper align-items-center">
                    <h1 className="title">Dashboard</h1>
                    <div className="card-header-actions">
                      <DateRangePicker2 showCustomRangeLabel={false} ranges={DATE_RANGES} getDate={this.getAnalyticsData} opens={'left'}/>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>

            <div className="pt-4">
              {loading && <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>}
              {!loading && <div>
                    <Row className="mt-4">
                      <Col lg={3}>
                        <Card>
                          <CardBody className="p-4 bg-white">
                            <p className="report-title">Revenue</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <NumberFormat value={totalRevenue} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'} 
                                renderText={value => <h3 className="text-primary mb-0">{value}</h3>} />

                              <Progress progress={revenueProgress} is24={true} isPositive={revenueProgress>=0} />
                            </div>
                            <div className="progress-xs mt-3 progress">
                              <div 
                                className={`progress-bar ${revenueProgress>0?'bg-success':(revenueProgress==0?'bg-warning':'bg-danger')}`} 
                                role="progressbar" 
                                style={{width: `${revenueProgress==0?1:Math.abs(revenueProgress)}%`}}
                                aria-valuemin="0" 
                                aria-valuemax="100" />
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg={3}>
                        <Card>
                          <CardBody className="p-4 bg-white">
                            <p className="report-title">Orders</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <h3 className="text-primary mb-0">{totalOrders}</h3>
                              <Progress progress={ordersProgress} is24={true} isPositive={ordersProgress>=0} />
                            </div>
                            <div className="progress-xs mt-3 progress">
                              <div 
                                className={`progress-bar ${ordersProgress>0?'bg-success':(ordersProgress==0?'bg-warning':'bg-danger')}`} 
                                role="progressbar" 
                                style={{width: `${ordersProgress==0?1:Math.abs(ordersProgress)}%`}}
                                aria-valuemin="0" 
                                aria-valuemax="100"></div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg={3}>
                        <Card>
                          <CardBody className="p-4 bg-white">
                            <p className="report-title">Views</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <h3 className="text-primary mb-0">{totalViews}</h3>
                              <Progress progress={viewsProgress} is24={true} isPositive={viewsProgress>=0} />
                            </div>
                            <div className="progress-xs mt-3 progress">
                              <div 
                                className={`progress-bar ${viewsProgress>0?'bg-success':(viewsProgress==0?'bg-warning':'bg-danger')}`} 
                                role="progressbar" 
                                style={{width: `${viewsProgress == 0?1:Math.abs(viewsProgress)}%`}}
                                aria-valuemin="0" 
                                aria-valuemax="100"></div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg={3}>
                        <Card>
                          <CardBody className="p-4 bg-white">
                            <p className="report-title">Queries</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <h3 className="text-primary mb-0">{totalQueries}</h3>
                              <Progress progress={queriesProgress} is24={true} isPositive={queriesProgress>=0} />
                            </div>
                            <div className="progress-xs mt-3 progress">
                              <div 
                                className={`progress-bar ${queriesProgress>0?'bg-success':(queriesProgress==0?'bg-warning':'bg-danger')}`} 
                                role="progressbar" 
                                style={{width: `${queriesProgress == 0?1:Math.abs(queriesProgress)}%`}}
                                aria-valuemin="0" 
                                aria-valuemax="100"></div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>

                    <Row className={"mb-4"}>
                        <Col lg={12}>
                          <div className={"product-table"}>
                            <h5 className="mb-3">Last 5 Orders</h5>
                            <BootstrapTable
                                options={{...tableOptions(), onRowClick: (row) => this.gotoDetail(row.uniqid), sizePerPage: 5}}
                                data={invoices}
                                version="4"
                                totalSize={invoices.length}
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
                                  dataField="total_display"
                                  dataAlign="center"
                                  dataSort
                                  dataFormat={this.renderOrderValue}
                                  width='20%'
                              >
                                Value
                              </TableHeaderColumn>
                              <TableHeaderColumn
                                  dataField="status"
                                  dataAlign="center"
                                  dataFormat={this.renderOrderStatus}
                                  dataSort
                                  width='20%'
                              >
                                Payment Gateway
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
                    <h5 className="mb-4">Revenues | Orders</h5>
                    <CardBody className="">
                      <DashBoardChart height="350px" data={chartData}/>
                    </CardBody>
                  </div>
              }
            </div>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Dashboard)
