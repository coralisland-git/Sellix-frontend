import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import NumberFormat from 'react-number-format';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col
} from 'reactstrap'
import { Loader } from 'components'
import {
  DashBoardChart
} from './sections'
import moment from 'moment'
import * as DashboardActions from './actions'

import './style.scss'


const mapStateToProps = (state) => {
  return ({

  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(DashboardActions, dispatch)
  })
}

const DATE_RANGES =  {
  'last-24hours': [moment().subtract(1, 'days'), moment(), 'daily'],
  'total': [moment(new Date('2019-01-01')), moment(new Date().setDate(new Date().getDate() + 1)), 'yearly'],
  'this-month': [moment().startOf('month'), moment().endOf('month'), 'daily'],
  'this-year': [moment().startOf('year'), moment(), 'monthly'],
  'last-30days': [moment().subtract(29, 'days'), moment(), 'daily'],
}

const Progress = ({ progress, isPositive, is24 }) => {
  if(is24) {
    return (
        <div className={'progress-indicator'} >
          {progress != 0 ?
             (isPositive ?
              <span>+<b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span> :
              <span><b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span>) :
              <span><b>{(Math.round(progress*100)/100).toFixed(2)}</b>%</span>
          }
          {
            progress != 0 ? 
              <i className={`fas fa-caret-${isPositive ? 'up' : 'down'}`} />:
              <i className={`fa fa-minus`} />
          }
        </div>
    )
  } else {
    return null
  }
}

class Dashboard extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      range: 'last-24hours',
      loading: false,
      chartData: [],
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

  changeRange(e) {
    const range = DATE_RANGES[e.target.value]
    this.setState({range:e.target.value})
    this.getAnalyticsData(range)
  }

  getAnalyticsData = (range) => {
    this.setState({loading: true})
    this.props.actions.getAnalyticsData(range[0].format('MM/DD/YYYY'), range[1].format('MM/DD/YYYY')).then(res => {
      const total = res.data.analytics.total

      this.setState({
        totalRevenue: total.revenue || 0,
        totalOrders: total.orders_count || 0,
        totalViews: total.views_count || 0,
        totalQueries: total.queries_count || 0,
        revenueProgress: total.revenue_progress || 0,
        ordersProgress: total.orders_count_progress || 0,
        viewsProgress: total.views_count_progress || 0,
        queriesProgress: total.queries_count_progress || 0,
        chartData: res.data.analytics[range[2]]
      })
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  componentDidMount() {
    const range = DATE_RANGES['last-24hours']
    this.getAnalyticsData(range)
  }

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
      queriesProgress
    } = this.state

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
                      <div className="new-select fill">
                        <select className="form-control" onChange={this.changeRange.bind(this)}>
                          <option value="last-24hours">Last 24 hours</option>
                          <option value="last-30days">Last 30 days</option>
                          <option value="this-month">This Month</option>
                          <option value="this-year">This Year</option>
                          <option value="total">Total</option>
                        </select>
                        <i className="fa fa-caret-down fa-lg mt-4"/>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <div className="pt-4">
              {
                loading ?
                  <Row>
                    <Col lg={12}>
                      <Loader />
                    </Col>
                  </Row>
                : <div>
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
                            <div class="progress-xs mt-3 progress">
                              <div 
                                className={`progress-bar ${revenueProgress>0?'bg-success':(revenueProgress==0?'bg-warning':'bg-danger')}`} 
                                role="progressbar" 
                                style={{width: `${revenueProgress==0?1:Math.abs(revenueProgress)}%`}}
                                aria-valuemin="0" 
                                aria-valuemax="100"></div>
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
                            <div class="progress-xs mt-3 progress">
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
                            <div class="progress-xs mt-3 progress">
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
                            <div class="progress-xs mt-3 progress">
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
                    <CardBody className="mt-2">
                      <h5 className="mb-4">Revenue</h5>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
