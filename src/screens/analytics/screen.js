import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import NumberFormat from 'react-number-format';
import {
  Card,
  CardBody,
  Row,
  Col
} from 'reactstrap'

import {
  RevenueChart,
  ViewsChart,
  ConverstionChart,
  OrdersChart,
  RevenueMap
} from './sections'
import { Loader } from 'components'
import moment from 'moment'
import { DateRangePicker2 } from 'components'
import * as AnalyticsActions from './actions'

import './style.scss'
import { date } from 'yup'



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


const ranges =  {
  // 'Today': [moment(), moment()],
  // 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
}

const mapStateToProps = (state) => {
  return ({
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(AnalyticsActions, dispatch)
  })
}

class Analytics extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,

      chartData: [],
      totalRevenue: 0,
      totalOrders: 0,
      totalViews: 0,
      totalQueries: 0,
      revenueProgress: 0,
      ordersProgress: 0,
      viewsProgress: 0,
      queriesProgress: 0
    }
  }

  changeDateRange(date) {
    this.setState({
      startDate: date.startDate,
      endDate: date.endDate
    })

    this.getAnalyticsData()
  }

  getAnalyticsData = (date) => {
    const startDate = date.startDate.format('MM/DD/YYYY')
    const endDate = date.endDate.format('MM/DD/YYYY')
    this.setState({loading: true})

    this.props.actions.getAnalyticsData(startDate, endDate).then(res => {
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
        chartData: res.data.analytics.daily
      })
    }).finally(() => {
      this.setState({loading:false})
    })
  }

  componentDidMount(){
    const date = { 
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    }

    this.getAnalyticsData(date)
  }

  render() {
    const {
      totalQueries, 
      totalOrders, 
      totalRevenue, 
      totalViews, 
      loading, 
      chartData,
      revenueProgress,
      ordersProgress,
      viewsProgress,
      queriesProgress
    } = this.state

    return (
      <div className="analytics-screen mt-4">
        <div className="animated fadeIn">
          <Card>
            
            <CardBody>
              <div className="flex-wrapper align-items-center">
                <h1 className="title">Analytics</h1>
                <div className="card-header-actions">
                  <DateRangePicker2 ranges={ranges} getDate={this.getAnalyticsData} opens={'left'}/>
                </div>
              </div>

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
                    <Card className="grey">
                      <CardBody className="p-4">
                        <p className="report-title mb-4">Revenue</p>
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
                    <Card className="grey">
                      <CardBody className="p-4">
                        <p className="report-title mb-4">Orders</p>
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
                    <Card className="grey">
                      <CardBody className="p-4">
                        <p className="report-title mb-4">Views</p>
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
                    <Card className="grey">
                      <CardBody className="p-4">
                        <p className="report-title mb-4">Queries</p>
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
                <div className="chart row row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Revenue</label>
                    <hr/>
                    <RevenueChart height="350px" data={chartData}/>
                  </Col>
                </div>

                <div className="chart row row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Views</label>
                    <hr/>
                    <ViewsChart height="350px" data={chartData}/>
                  </Col>
                </div>

                <div className="chart row row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Orders</label>
                    <hr/>
                    <OrdersChart height="350px" data={chartData}/>
                  </Col>
                </div>

                <div className="chart row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Queries</label>
                    <hr/>
                    <ConverstionChart height="350px" data={chartData}/>
                  </Col>
                </div>
                {/* <div className="chart row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Revenue by Country</label>
                    <hr/>
                    <RevenueMap/>
                  </Col>
                </div> */}
              </div>
              }
              
            </CardBody>
          </Card>
        </div>
        
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Analytics)
