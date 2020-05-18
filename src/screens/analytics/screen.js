import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, Row, Col } from 'components/reactstrap'
import config from 'constants/config'
import { ReportOrders, ReportQueries, ReportRevenue, ReportViews } from '../dashboard/sections'
import { Charts } from './sections'
import { Loader } from 'components'
import * as moment from 'moment/moment'
import { DateRangePicker2 } from 'components'
import { getAnalyticsData } from './actions'

import './style.scss'

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

      revenue: 0,
      orders_count: 0,
      views_count: 0,
      queries_count: 0,
      revenue_progress: 0,
      orders_count_progress: 0,
      views_count_progress: 0,
      queries_count_progress: 0,

    }
  }

  getAnalyticsData = (date) => {
    const startDate = date.startDate.format('MM/DD/YYYY')
    const endDate = date.endDate.format('MM/DD/YYYY')
    this.setState({loading: true})

    this.props.getAnalyticsData(startDate, endDate).then(res => {
      const total = res.data.analytics.total

      this.setState({
        ...total,
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
      loading, 
      chartData,
      topData
    } = this.state

    return (
      <div className="analytics-screen mt-4">
        <div className="animated fadeIn">
          <Card>

              <div className="flex-wrapper align-items-center">
                <h1 className="title">Analytics</h1>
                <div className="card-header-actions">
                  <DateRangePicker2 ranges={ranges} getDate={this.getAnalyticsData} opens={'left'}/>
                </div>
              </div>

              {loading && <Row><Col lg={12}><Loader /></Col></Row>}
              {!loading &&
                <>
                  <Row className="mt-4">
                    <ReportRevenue {...this.state}/>
                    <ReportOrders {...this.state} />
                    <ReportViews {...this.state} />
                    <ReportQueries {...this.state} />
                  </Row>

                  <CardBody className={'mb-4'}>
                      <h5 className={'mb-4'}>Revenues | Orders</h5>

                      <Charts height={350} data={chartData} isRevenue />
                  </CardBody>

                  <CardBody className={'mb-4'}>
                      <h5 className={'mb-4'}>Views</h5>

                      <Charts height={350} data={chartData} isView />
                  </CardBody>

                  <CardBody className={'mb-4'}>
                      <h5 className={'mb-4'}>Queries</h5>

                      <Charts height={350} data={chartData} isQuery />
                  </CardBody>

                  <CardBody className={'mb-4'}>
                      <h5 className={'mb-4'}>Top 3 Gateways by Orders</h5>

                    {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                    {!loading && <Row>
                      {
                        topData && topData.gateways.map((gateway, index) =>
                            <Col md={3} key={index}>
                              <Card className="grey p-0 m-0">
                                <CardBody className={'top3-products p-4 pt-4 pb-4 pl-2 pr-2'}>
                                  <img src={config.PAYMENT_ICONS[gateway.gateway]} style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, objectFit: 'contain'}} alt="" width="100%" height="100"/>
                                  <div className="text-center mt-4">
                                    <h4 className="text-black" style={{ fontSize: ".9rem" }}>{gateway.gateway.toUpperCase()}</h4>
                                    <div className="d-flex align-items-center justify-content-center mt-2">
                                        <span className="stock">
                                          Orders: <b className="stock-size">{gateway.counter}</b>
                                        </span>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                        )
                      }
                      {topData && topData.products_by_revenue.length == 0 && <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>}
                    </Row>}
                  </CardBody>

                  <CardBody className={'mb-4'}>

                      <h5 className={'mb-4'}>Top 3 Products by Revenue</h5>

                          {loading && <Row><Col lg={12}><Loader/></Col></Row>}
                          {!loading && <Row>
                                {
                                  topData && topData.products_by_revenue.map((pro, index) =>
                                    <Col md={3} key={index}>
                                      <Card className="grey p-0 m-0" onClick={(e) => this.gotoDetail(e, pro.uniqid)} style={{cursor: 'pointer'}}>
                                        <CardBody className={'top3-products pt-4 pb-4 pl-2 pr-2'}>
                                          <img src={config.API_ROOT_URL+'/attachments/image/'+pro.image_attachment} style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, opacity: pro.image_attachment ? 1 : 0, objectFit: 'contain' }} alt="" width="100%" height="100" />
                                          <div className="text-center mt-4">
                                            <h4 className="text-black" style={{ fontSize: ".9rem" }} >{pro.product}</h4>
                                            <div className="d-flex align-items-center justify-content-center mt-2">
                                              <span className="stock">
                                                Revenue: <b className="stock-size">${pro.revenue}</b>
                                              </span>
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

                  <CardBody className={'mb-4'}>
                      <h5 className={'mb-4'}>Top 3 Products by Orders</h5>

                      {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                      {!loading && <Row>
                        {
                          topData && topData.products_by_orders.map((pro, index) =>
                              <Col md={3} key={index}>
                                <Card className="grey p-0 m-0" onClick={(e) => this.gotoDetail(e, pro.uniqid)} style={{cursor: 'pointer'}}>
                                  <CardBody className={'top3-products pt-4 pb-4 pl-2 pr-2'}>
                                    <img src={config.API_ROOT_URL+'/attachments/image/'+pro.image_attachment} style={{borderTopLeftRadius: 10, borderTopRightRadius: 10, opacity: pro.image_attachment ? 1 : 0, objectFit: 'contain'}} alt="" width="100%" height="100" />
                                    <div className="text-center mt-4">
                                      <h4 className="text-black" style={{ fontSize: ".9rem" }} >{pro.product}</h4>
                                      <div className="d-flex align-items-center justify-content-center mt-2">
                                        <span className="stock">
                                          Orders: <b className="stock-size">{pro.counter}</b>
                                        </span>
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                          )
                        }
                        {topData && topData.products_by_revenue.length == 0 && <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>}
                      </Row>}
                  </CardBody>

                </>
              }

          </Card>
        </div>
        
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Analytics)
