import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, Row, Col, CardBody } from 'reactstrap'
import { getUser, updateUser, getUserTodayAnalytics, getUserTotalAnalytics, getUser14dAnalytics, banUser, unbanUser } from './actions'
import { CommonActions } from "../../../../services/global";
import pick from "lodash/pick";
import { withRouter, Link } from "react-router-dom";
import { Button, Spin, Loader } from "components";
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { tableOptions } from "../../../../constants/tableoptions";
import { ReportOrders, ReportFee, ReportRevenue, ReportViews } from "../../../dashboard/sections";
import UserEditForm from './form'
import UserProductsTable from './products'
import UserOrdersTable from './orders'
import UserIpsTable from './ips';
import Chart from "../chart";

import config from "constants/config";

import './style.scss'




class User extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      userLoading: false,
      analyticsLoading: false,
      range: "today",
      analytics: {
        daily: [],
        monthly: [],
        total: {
          revenue_by_gateway: [],
          revenue: 0,
          orders_count: 0,
          views_count: 0,
          queries_count: 0,
          revenue_progress: 0,
          orders_count_progress: 0,
          views_count_progress: 0,
          queries_count_progress: 0,
          currency: "USD"
        },
      }
    }
  }

  componentDidMount(){
    this.getUser()
    this.getAnalytics()
  }

  getUser = () => {
    this.props.getUser(this.props.match.params.id)
        .then((res) => {
            document.title = `User: ${res.data.user.username} | Sellix`
        })
  }

  getAnalytics = (isTotal) => {
    this.setState({ analyticsLoading: true })

    if(isTotal) {
      this.props.getUserTotalAnalytics(this.props.match.params.id)
          .then((res) => {
            res.analytics.total.currency = res.analytics.currency
            this.setState({
              analytics: res.analytics
            })
          })
          .finally(() => {
            this.setState({ analyticsLoading: false })
          })
    } else {

      Promise.all([this.props.getUserTodayAnalytics(this.props.match.params.id), this.props.getUser14dAnalytics(this.props.match.params.id)])
          .then(([res, res2]) => {

            res.analytics.total.currency = res.analytics.currency

            console.log({
              ...res2.analytics,
              ...res.analytics,
            })
            this.setState({
              analytics: {
                ...res2.analytics,
                ...res.analytics,
              }
            })
          })
          .finally(() => {
            this.setState({ analyticsLoading: false })
          })
    }
  }

  handleSubmit = (values) => {
    this.setState({ userLoading: true })

    const { updateUser, tostifyAlert } = this.props;

    let dataForSend = pick(values, ['username', 'email', 'otp_2fa', 'email_2fa', 'id'])

    dataForSend.email_2fa = Boolean(+dataForSend.email_2fa)
    dataForSend.otp_2fa = Boolean(+dataForSend.otp_2fa)
    updateUser(dataForSend)
        .then(res => {
          this.getUser()
          tostifyAlert('success', res.data.message)
        })
        .catch(err => {
          tostifyAlert('error', err.error)
        })
        .finally(() => {
          this.setState({ userLoading: false })
        })
  }

  banUser = () => {
    const { user: { banned, id }, banUser, unbanUser, tostifyAlert } = this.props;

    if(banned === "0") {
      banUser(id)
          .then(res => {
            this.getUser()
            tostifyAlert('success', res.data.message)
          })
          .catch(res => {
            tostifyAlert('error', res.error)
          })
    } else {
      unbanUser(id)
          .then(res => {
            this.getUser()
            tostifyAlert('success', res.data.message)
          })
          .catch(res => {
            tostifyAlert('error', res.error)
          })
    }
  }

  setAnalyticRange = (range) => {
    this.getAnalytics(range === "total")
    this.setState({ range })
  }

  render() {

    const { loading, userLoading, analyticsLoading } = this.state;
    const { user } = this.props;
    const { products, invoices, ips } = user;

    return (
      <div className="admin-edit-user-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader style={{ height: "40px" }}>
              <Row>
                <Col lg={12}>
                  <div className="flex-wrapper align-items-center">
                    <h1 className={"title"}>User (ID: {user.id})</h1>
                  </div>
                </Col>
              </Row>
            </CardHeader>
          </Card>

          <Row>
            <Col lg={4} md={12} className="mx-auto">
              <UserEditForm user={user} loading={userLoading} handleSubmit={this.handleSubmit}/>
              <Row>
                <Col lg={6} className={"mb-4"}>
                  <Button color="primary" type="submit" className={user.banned === "0" ? "ban-button" : "unban-button"} style={{ width: "100%" }} onClick={this.banUser}>
                    {loading ? <Spin/> : user.banned === "0" ? 'Ban user' : 'Unban user'}
                  </Button>
                </Col>
                <Col lg={6} className={"mb-4"}>
                  <Link to={`/${user.username}`} target={"_blank"}>
                    <Button color="primary" type="submit" style={{width: "100%"}}>
                      Go to user's shop
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Col>

            <Col lg={8} md={12} className="mx-auto">
              <UserIpsTable ips={ips} loading={loading}/>
            </Col>
          </Row>

          <Row>
            <Col lg={12} className="mx-auto">
              <UserOrdersTable invoices={invoices} loading={loading} />
            </Col>
          </Row>

          <Row>
            <Col lg={12} className="mx-auto">
              <UserProductsTable products={products}/>
            </Col>
          </Row>

          <Row>
            <Col lg={12} className="mx-auto">
              <Button color={this.state.range === "today" ? "primary" : "default"} onClick={this.setAnalyticRange.bind(this, "today")}>Today</Button>
              <Button color={this.state.range === "total" ? "primary" : "default"} onClick={this.setAnalyticRange.bind(this, "total")}>Total</Button>
            </Col>
          </Row>

          <Row className="mt-4">
            {analyticsLoading ? <div className={"w-100"} style={{ minHeight: 127 }}><Loader /></div> :
              <>
                <ReportRevenue {...this.state.analytics.total} />
                <ReportOrders {...this.state.analytics.total} />
                <ReportViews {...this.state.analytics.total} />
                <ReportFee {...this.state.analytics.total} />
              </>
            }
          </Row>

          <h5 className="mb-4">Cashflow | Orders</h5>
          <Row>
            <Col lg={12} className="mx-auto">
              <CardBody>
                {analyticsLoading ? <div className={"w-100"} style={{ minHeight: 127 }}><Loader /></div> :
                <Chart
                    range={this.state.range === "today" ? "daily" : ""}
                    height="350px"
                    data={this.state.range === "today" ? this.state.analytics.daily : this.state.analytics.monthly}
                />}
              </CardBody>
            </Col>
          </Row>


          <div className="pt-4">
            {!!this.state.analytics.total.revenue_by_gateway.length && <h5 className="mb-4 mt-4">Cashflow By Gateway</h5>}
            {!!this.state.analytics.total.revenue_by_gateway.length && <Row className={"mb-4"}>
              <Col lg={12}>
                <div className={"product-table"}>
                  <BootstrapTable
                      options={{
                        ...tableOptions(),
                        sizePerPage: this.state.analytics.total.revenue_by_gateway.length
                      }}
                      data={this.state.analytics.total.revenue_by_gateway}
                      version="4"
                      striped
                      totalSize={this.state.analytics.total.revenue_by_gateway.length}
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

        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ users: { user }}) => ({ user })
const mapDispatchToProps = (dispatch) => ({
  unbanUser: bindActionCreators(unbanUser, dispatch),
  banUser: bindActionCreators(banUser, dispatch),
  getUser: bindActionCreators(getUser, dispatch),
  updateUser: bindActionCreators(updateUser, dispatch),
  tostifyAlert: bindActionCreators(CommonActions.tostifyAlert, dispatch),
  getUserTotalAnalytics: bindActionCreators(getUserTotalAnalytics, dispatch),
  getUserTodayAnalytics: bindActionCreators(getUserTodayAnalytics, dispatch),
  getUser14dAnalytics: bindActionCreators(getUser14dAnalytics, dispatch),
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User))
