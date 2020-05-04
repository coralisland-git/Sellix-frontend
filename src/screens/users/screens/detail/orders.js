import React, { Component } from 'react'
import {Card, CardBody, Row, Col, FormGroup} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { tableOptions } from 'constants/tableoptions'
import { Loader } from 'components'
import { withRouter } from "react-router-dom";
import * as moment from 'moment/moment'
import cancelledIcon from 'assets/images/order/Cancelled_Icon.svg'
import completedIcon from 'assets/images/order/Check_Icon.svg'
import paritalIcon from 'assets/images/order/Partially_Icon.svg'
import pendingIcon from 'assets/images/order/Pending_Icon.svg'

import './style.scss'

import config from "../../../../constants/config";

const STATUS_ICON = {
  '0': pendingIcon,
  '1': completedIcon,
  '2': cancelledIcon,
  '4': paritalIcon,
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



class UserProductsTable extends Component {


  gotoDetail( id, username ) {
    let isAdmin = window.location.pathname.includes('admin');
    let url = isAdmin ? `/admin/invoices/${id}` : `/dashboard/${username}/orders/view/${id}`;

    this.props.history.push(url)
  }

  renderOrderInfo = (cell, row) => {
    return (
        <div>
          <p><a onClick={(e) => this.gotoDetail(row.uniqid, row.username)} style={{fontSize: 15, fontWeight: 600}}>
            <i className={`flag-icon flag-icon-${row.country.toLowerCase()}`} title={row.location}></i>&nbsp;&nbsp;&nbsp;
            {`${PAYMENT_OPTS[row.gateway]} - ${row.customer_email}`}</a>
          </p>
          <p className="caption" style={{marginLeft: 32}}>{row.uniqid} - {row.developer_invoice == '1'?row.developer_title:row.product_title}</p>
        </div>
    )
  }

  renderOrderStatus (cell, row) {
    return (
        <div className="order-status">
          <div className={`order-badge badge-${ORDER_STATUS[row.status].toLowerCase()}`} style={{  margin: '0 auto'}}>
            <img src={STATUS_ICON[row.status]}/>
          </div>
          <span className={`text-${ORDER_STATUS[row.status].toLowerCase()}`}>{ORDER_STATUS[row.status]}</span>
        </div>
    )
  }

  renderOrderValue(cell, row) {
    return (
        <div className="order">
          <p className="order-value" style={{fontSize: 15, fontWeight: 600}}>{'+' + config.CURRENCY_LIST[row.currency] + row.total_display}</p>
          <p className="caption">{row.crypto_amount?(row.crypto_amount + ' '):''} {PAYMENT_OPTS[row.gateway]}</p>
        </div>
    )
  }

  renderOrderTime(cell, row) {
    return (
        <div>
          <p style={{fontSize: 15, fontWeight: 600}}>{new moment(new Date(row.created_at*1000)).format('HH:mm')}</p>
          <p>{new moment(new Date(row.created_at*1000)).format('MMM DD')}</p>
        </div>
    )
  }

  render() {
    const { invoices, loading } = this.props;

    return (
        <Card className={"user-screen"}>
          <CardBody className="p-4 mb-4">
            <Row>
              <Col lg={12}>
                <Row>
                  <Col lg={12}>
                    <FormGroup>
                      <h4 className="mb-4">Orders</h4>
                    </FormGroup>
                  </Col>
                </Row>
                {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                {!loading &&
                <Row>
                  <Col lg={12}>
                    <div className={"order-screen"}>
                      <BootstrapTable
                          options={tableOptions({ onRowClick: (row) => this.gotoDetail(row.uniqid, row.username), sizePerPage: 5 })}
                          data={invoices}
                          version="4"
                          striped
                          pagination
                          totalSize={invoices ? invoices.length : 0}
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
                            dataAlign="right"
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
              </Col>
            </Row>
          </CardBody>
        </Card>
    )
  }
}

export default withRouter(UserProductsTable)
