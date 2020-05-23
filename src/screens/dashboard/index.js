import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardBody, CardHeader, Row, Col } from 'components/reactstrap'
import { DateRangePicker2, Loader } from 'components'
import { DashBoardChart, ReportOrders, ReportQueries, ReportRevenue, ReportViews, ReportFee, Status, Revenue, Invoices } from './sections'
import { getAnalyticsData, geLastInvoices } from './actions'
import * as moment from 'moment/moment'
import { getSelfUser } from "../../services/global/auth/actions";
import { withRouter } from "react-router-dom";

import './style.scss'




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
      fee_revenue: 0,

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
              ...total,
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
              ...total,
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


  render() {

    const { chartData, loading, invoices, showPlaceholder, range, revenue_by_gateway } = this.state;

    let isAdmin = window.location.pathname.includes('admin/dashboard');

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
                <Status />
              </Row>
            </CardHeader>

            <div>

              {(!loading && showPlaceholder) ?
                  <div className={'mt-5 pt-5 unauthorized-container'}>
                    <div>
                      <Loader className={"override-loader"} />
                      <div>Unauthorized to view this content</div>
                    </div>
                  </div> : <div>
                    <Row className={"position-relative"}>
                      {loading && <Row className={"loader-container"}>
                        <Col lg={12}><Loader /></Col>
                      </Row>}
                      <ReportRevenue {...this.state} isAdmin={isAdmin}/>
                      <ReportOrders {...this.state} />
                      <ReportViews {...this.state} />
                      {!isAdmin && <ReportQueries {...this.state} />}
                      {isAdmin && <ReportFee {...this.state} />}
                    </Row>

                    <h5 className="mb-4">{isAdmin ? "Cashflow" : "Revenues"} | Orders</h5>
                    <CardBody className="position-relative">
                      <div className={"position-absolute d-flex justify-content-flex-end graph-note"}>
                        This graph will always show a 14 days or higher time span
                      </div>
                      <DashBoardChart isAdmin={isAdmin} range={range} height="350px" data={chartData}/>
                    </CardBody>

                    <Invoices invoices={invoices} history={this.props.history} />
                  </div>
              }
            </div>

            <Revenue revenue_by_gateway={revenue_by_gateway} />
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
