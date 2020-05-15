import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap'
import { DateRangePicker2, Loader } from 'components'
import { DashBoardChart, ReportOrders, ReportQueries, ReportRevenue, ReportViews, ReportFee } from './sections'
import { getAnalyticsData, geLastInvoices } from './actions'
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { tableOptions } from "../../constants/tableoptions";
import * as moment from 'moment/moment'
import { getSelfUser } from "../../services/global/auth/actions";
import { withRouter } from "react-router-dom";
import config from "constants/config";


import './style.scss'


const userId = window.localStorage.getItem('userId')

const DATE_RANGES =  {
  'Last 24 hours': [moment(), moment(), 'daily'],
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

      revenue: 0,
      orders_count: 0,
      views_count: 0,
      queries_count: 0,
      revenue_progress: 0,
      orders_count_progress: 0,
      views_count_progress: 0,
      queries_count_progress: 0,
      fee_revenue_potential: 0,
      showPlaceholder: false,
      currency: "USD",
      revenue_by_gateway: []
    }
  }

  getAnalyticsData = (date, initial) => {

    let startDate = null;
    let endDate = null;

    let isAdmin = window.location.pathname.includes('admin/dashboard')

    if(!date.startDate.isSame(date.endDate, 'day')) {
      startDate = date.startDate.format('MM/DD/YYYY');
      endDate = date.endDate.format('MM/DD/YYYY');
    }

    this.setState({
      range: DATE_RANGES[date.chosenLabel || 'Last 24 hours'][2]
    })

    const { getAnalyticsData, geLastInvoices } = this.props;

    this.setState({ loading: true });

    if(initial || !startDate) {

      let requests = [
        getAnalyticsData(moment().subtract(2, 'week').format('MM/DD/YYYY'), moment().format('MM/DD/YYYY')),
        getAnalyticsData()
      ]

      if(!isAdmin) {
        requests.push(geLastInvoices())
      }

      Promise.all(requests)
          .then((response) => {

            if(response[0].status === 401 || response[1].status === 401) {
              this.setState({ showPlaceholder: true })
              return
            }

            let analytics = response[0].data.analytics;
            let total = response[1].data.analytics.total;
            let invoices = isAdmin ? [] : response[2].data.invoices;

            this.setState({
              revenue: total.revenue || 0,
              orders_count: total.orders_count || 0,
              views_count: total.views_count || 0,
              queries_count: total.queries_count || 0,
              revenue_progress: total.revenue_progress || 0,
              orders_count_progress: total.orders_count_progress || 0,
              views_count_progress: total.views_count_progress || 0,
              queries_count_progress: total.queries_count_progress || 0,
              fee_revenue_potential: total.fee_revenue_potential || 0,
              chartData: analytics['daily'],
              invoices: invoices,
              currency: isAdmin ? 'USD' : analytics.currency,
              revenue_by_gateway: total.revenue_by_gateway
            })
          })
          .finally(() => {
            this.setState({loading: false})
          })
    } else {

      getAnalyticsData(startDate, endDate)
          .then(({ data: { analytics } }) => {
            const { total } = analytics;

            this.setState({
              revenue: total.revenue || 0,
              orders_count: total.orders_count || 0,
              views_count: total.views_count || 0,
              queries_count: total.queries_count || 0,
              revenue_progress: total.revenue_progress || 0,
              orders_count_progress: total.orders_count_progress || 0,
              views_count_progress: total.views_count_progress || 0,
              queries_count_progress: total.queries_count_progress || 0,
              fee_revenue_potential: total.fee_revenue_potential || 0,
              chartData: analytics[DATE_RANGES[date.chosenLabel || 'Last 24 hours'][2]],
              currency: isAdmin ? 'USD' : analytics.currency,
              revenue_by_gateway: total.revenue_by_gateway
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

  gotoDetail = (id) => {
    this.props.history.push(`/dashboard/${userId}/orders/view/${id}`)
  }

  renderOrderInfo = (cell, row) => (<div>
        <p><a onClick={(e) => this.gotoDetail(row.uniqid)}>
          <i className={`flag-icon flag-icon-${row.country.toLowerCase()}`} title={row.location}>
          </i>&nbsp;&nbsp;&nbsp;{`${config.PAYMENT_OPTS[row.gateway]} - ${row.customer_email}`}</a>
        </p>
        <p className="caption">{row.uniqid} - {row.developer_invoice === '1' ? row.developer_title : row.product_title?row.product_title:row.product_id}</p>
      </div>)

  renderOrderStatus = (cell, row) => (<div>{config.PAYMENT_OPTS[row.gateway]}</div>)

  renderOrderValue = (cell, row) => (<div className="order">
        <p className="order-value">{'+' + config.CURRENCY_LIST[row.currency] + row.total_display}</p>
        <p className="caption">{row.crypto_amount ? (row.crypto_amount + ' ') : ''} {config.PAYMENT_OPTS[row.gateway]}</p>
      </div>)

  renderOrderTime = (cell, row) => (<div>
        <p>{moment(row.created_at*1000).format('DD, MMM YYYY')}</p>
        <p>{moment(row.created_at*1000).format('HH:mm')}</p>
      </div>)


  render() {

    const { chartData, loading, invoices, showPlaceholder, range, revenue_by_gateway } = this.state;

    let isAdmin = window.location.pathname.includes('admin/dashboard')

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
              {loading && <Row><Col lg={12}><Loader /></Col></Row>}

              {(!loading && showPlaceholder) ?
                  <div className={'mt-5 pt-5 unauthorized-container'}>
                    <div>
                      <Loader className={"override-loader"} />
                      <div>Unauthorized to view this content</div>
                    </div>
                  </div> : <div>
                    <Row className="mt-4">
                      <ReportRevenue {...this.state} isAdmin={isAdmin}/>
                      <ReportOrders {...this.state} />
                      <ReportViews {...this.state} />
                      {!isAdmin && <ReportQueries {...this.state} />}
                      {isAdmin && <ReportFee {...this.state} potential={true} />}
                    </Row>

                    <h5 className="mb-4">{isAdmin ? "Cashflows" : "Revenues"} | Orders</h5>
                    <CardBody className="position-relative">
                      <div className={"position-absolute d-flex justify-content-flex-end"} style={{ fontSize: ".8rem", fontWeight: 200, top: "1rem", right: "1rem" }}>
                        This graph will always show a 14 days or higher time span
                      </div>
                      <DashBoardChart range={range} height="350px" data={chartData}/>
                    </CardBody>

                    {!!invoices.length && <h5 className="mb-4 mt-4">Last 5 Orders</h5>}
                    {!!invoices.length && <Row className={"mb-4"}>
                      <Col lg={12}>
                        <div className={"product-table"}>
                          <BootstrapTable
                              options={{
                                ...tableOptions(),
                                onRowClick: (row) => this.gotoDetail(row.uniqid),
                                sizePerPage: 5
                              }}
                              data={invoices}
                              version="4"
                              striped
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
                    </Row>}
                  </div>
              }
            </div>

            <div className="pt-4">
              {!!revenue_by_gateway.length && <h5 className="mb-4 mt-4">Cashflow By Gateway</h5>}
              {!!revenue_by_gateway.length && <Row className={"mb-4"}>
                <Col lg={12}>
                  <div className={"product-table"}>
                    <BootstrapTable
                        options={{
                          ...tableOptions(),
                          sizePerPage: revenue_by_gateway.length
                        }}
                        data={revenue_by_gateway}
                        version="4"
                        striped
                        totalSize={revenue_by_gateway.length}
                        className="product-table"
                        trClassName="cursor-pointer"
                    >
                      <TableHeaderColumn
                          isKey
                          dataField="gateway"
                          dataFormat={(cell, row) => config.PAYMENT_OPTS[row.gateway]}
                          dataSort
                          width='33%'
                      >
                        Gateway
                      </TableHeaderColumn>
                      <TableHeaderColumn
                          dataField="revenue"
                          dataAlign="right"
                          dataSort
                          dataFormat={(cell, row) => `$ ${row.revenue}`}
                          width='33%'
                      >
                        Cashflow
                      </TableHeaderColumn>
                      <TableHeaderColumn
                          dataField="orders_count"
                          dataAlign="right"
                          dataFormat={(cell, row) => row.orders_count}
                          dataSort
                          width='33%'
                      >
                        Orders Count
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                </Col>
              </Row>}
            </div>
          </Card>
        </div>
      </div>
    )
  }
}


const mapDispatchToProps = dispatch => ({
  getAnalyticsData: bindActionCreators(getAnalyticsData, dispatch),
  geLastInvoices: bindActionCreators(geLastInvoices, dispatch),
  getSelfUser: bindActionCreators(getSelfUser, dispatch)
})

export default withRouter(connect(null, mapDispatchToProps)(Dashboard))
