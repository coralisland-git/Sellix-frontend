import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NumberFormat from 'react-number-format';
import { Card, CardBody, Row, Col } from 'reactstrap'
import config from 'constants/config'

import { Charts } from './sections'
import { Loader } from 'components'
import moment from 'moment'
import { DateRangePicker2 } from 'components'
import { getAnalyticsData } from './actions'

import './style.scss'

import { PAYMENT_ICONS } from '../invoice/screen'

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

const mapDispatchToProps = dispatch => ({
  getAnalyticsData: bindActionCreators(getAnalyticsData, dispatch)
})

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

  getAnalyticsData = (date) => {
    const startDate = date.startDate.format('MM/DD/YYYY')
    const endDate = date.endDate.format('MM/DD/YYYY')
    this.setState({loading: true})

    this.props.getAnalyticsData(startDate, endDate).then(res => {
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
        chartData: res.data.analytics.daily,
        topData: res.data.top
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

  gotoDetail = (e, id) => {
    this.props.history.push({
      pathname: `/product/${id}`
    })
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
      queriesProgress,
      topData
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
                        <div className="progress-xs mt-3 progress">
                          <div 
                            className={`progress-bar ${revenueProgress > 0 ? 'bg-success' : (revenueProgress==0?'bg-warning':'bg-danger')}`}
                            role="progressbar" 
                            style={{width: `${revenueProgress == 0 ? 1 : Math.abs(revenueProgress)}%`}}
                            aria-valuemin="0" 
                            aria-valuemax="100" />
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
                        <div className="progress-xs mt-3 progress">
                          <div 
                            className={`progress-bar ${ordersProgress>0?'bg-success':(ordersProgress==0?'bg-warning':'bg-danger')}`} 
                            role="progressbar" 
                            style={{width: `${ordersProgress == 0 ? 1 : Math.abs(ordersProgress)}%`}}
                            aria-valuemin="0" 
                            aria-valuemax="100" />
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
                        <div className="progress-xs mt-3 progress">
                          <div 
                            className={`progress-bar ${viewsProgress>0?'bg-success':(viewsProgress==0?'bg-warning':'bg-danger')}`} 
                            role="progressbar" 
                            style={{width: `${viewsProgress == 0 ? 1 : Math.abs(viewsProgress)}%`}}
                            aria-valuemin="0" 
                            aria-valuemax="100" />
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
                          <Progress progress={queriesProgress} is24={true} isPositive={queriesProgress >= 0} />
                        </div>
                        <div className="progress-xs mt-3 progress">
                          <div 
                            className={`progress-bar ${queriesProgress > 0 ? 'bg-success' : (queriesProgress == 0?'bg-warning':'bg-danger')}`}
                            role="progressbar" 
                            style={{width: `${queriesProgress == 0 ? 1 : Math.abs(queriesProgress)}%`}}
                            aria-valuemin="0" 
                            aria-valuemax="100" />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <div className="chart row row mt-4 mb-5">
                  <Col lg={12}>
                    <label>Revenues & Orders</label>
                    <hr/>
                    <Charts height={350} data={chartData} isRevenue />
                  </Col>
                </div>

                <div className="chart row row mt-4 mb-5">
                  <Col lg={12}>
                    <label>Views</label>
                    <hr/>
                    <Charts height={350} data={chartData} isView />
                  </Col>
                </div>

                <div className="chart row mt-4 mb-5">
                  <Col lg={12}>
                    <label>Queries</label>
                    <hr/>
                    <Charts height={350} data={chartData} isQuery />
                  </Col>
                </div>

                <div className="chart row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Top 3 Gateways by Orders</label>
                    <hr/>
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
                              {
                                topData && topData.gateways.map((gateway, index) => 
                                  <Col md={3} key={index}>
                                    <Card className="grey p-0">
                                      <CardBody>
                                        <img src={PAYMENT_ICONS[gateway.gateway]} 
                                          style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, objectFit: 'contain'}}
                                          alt="" width="100%" height="150"/>
                                        <div className="p-3" style={{position: 'relative', top: '15px'}}>
                                          <h5 className="mb-3 text-black">{gateway.gateway.toUpperCase()}</h5>
                                          <div className="d-flex justify-content-between mt-3 mb-2">
                                            <span className="stock">Orders: <span className="stock-size">
                                            {gateway.counter}
                                            </span></span>
                                          </div>
                                        </div>
                                      </CardBody> 
                                    </Card>
                                  </Col>
                                )
                              }
                              {topData && topData.products_by_revenue.length == 0 && <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>}
                            </Row>
                        }
                        
                      </CardBody>
                  </Col>
                </div>

                <div className="chart row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Top 3 Products by Revenue</label>
                    <hr/>
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
                              {
                                topData && topData.products_by_revenue.map((pro, index) => 
                                  <Col md={3} key={index}>
                                    <Card className="grey p-0" onClick={(e) => this.gotoDetail(e, pro.uniqid)} style={{cursor: 'pointer'}}>
                                      <CardBody>
                                        <img src={config.API_ROOT_URL+'/attachments/image/'+pro.image_attachment} style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, opacity: pro.image_attachment ? 1 : 0, objectFit: 'contain' }} alt="" width="100%" height="150" />
                                        <div className="p-3"  style={{position: 'relative', top: '15px'}}>
                                          <h5 className="mb-3 text-black">{pro.product}</h5>
                                          <div className="d-flex justify-content-between mt-3 mb-2">
                                            <span className="stock">Revenue: <span className="stock-size">
                                            ${pro.revenue}
                                            </span></span>
                                          </div>
                                        </div> 
                                      </CardBody>
                                    </Card>
                                  </Col>
                                )
                              }
                              {topData && topData.products_by_revenue.length == 0 && <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>}
                            </Row>
                        }
                        
                      </CardBody>
                  </Col>
                </div>

                <div className="chart row mt-2 mb-2">
                  <Col lg={12}>
                    <label>Top 3 Products by Orders</label>
                    <hr/>
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
                              {
                                topData && topData.products_by_orders.map((pro, index) => 
                                  <Col md={3} key={index}>
                                    <Card className="grey p-0" onClick={(e) => this.gotoDetail(e, pro.uniqid)} style={{cursor: 'pointer'}}>
                                      <CardBody>
                                        <img src={config.API_ROOT_URL+'/attachments/image/'+pro.image_attachment} style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, opacity: pro.image_attachment ? 1 : 0, objectFit: 'contain'}} alt="" width="100%" height="150" />
                                        <div className="p-3" style={{ position: 'relative', top: '15px' }}>
                                          <h5 className="mb-3 text-black">{pro.product}</h5>
                                          <div className="d-flex justify-content-between mt-3 mb-2">
                                            <span className="stock">Orders: <span className="stock-size">
                                            {pro.counter}
                                            </span></span>
                                          </div>
                                        </div> 
                                      </CardBody>
                                    </Card>
                                  </Col>
                                )
                              }
                              {topData && topData.products_by_revenue.length == 0 && <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>}
                            </Row>
                        }
                        
                      </CardBody>
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

export default connect(null, mapDispatchToProps)(Analytics)
