import React, { Component } from 'react'
import { Card, CardBody, Row, Col, FormGroup } from 'components/reactstrap'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { tableOptions } from 'constants/tableoptions'
import { Loader } from 'components'
import withRouter from "react-router-dom/withRouter"
import * as moment from 'moment/moment'

import config from "constants/config";

import './style.scss'




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
            <img src={`${config.CDN_FLAGS_URL}${row.country.toLowerCase()}.svg`} className={`flag-icon mr-2`} alt={row.location} title={row.location} />
            {`${config.PAYMENT_OPTS[row.gateway]} - ${row.customer_email}`}</a>
          </p>
          <p className="caption" style={{marginLeft: "1.8rem"}}>{row.uniqid} - {row.developer_invoice == '1'?row.developer_title:row.product_title?row.product_title:row.product_id}</p>
        </div>
    )
  }

  renderOrderStatus (cell, row) {
    return (
        <div className="order-status">
          <div className={`order-badge badge-${config.ORDER_STATUS[row.status].toLowerCase()}`} style={{  margin: '0 auto'}}>
              {+row.status === 3 && <i className={"far fa-hourglass"} style={{ fontSize: ".9rem", color: "#1d183d"}}/>}
              {+row.status !== 3 && <img src={config.STATUS_ICON[row.status]} alt="" />}
          </div>
          <span className={`text-${config.ORDER_STATUS[row.status].toLowerCase()}`}>{config.ORDER_STATUS[row.status]}</span>
        </div>
    )
  }

  renderOrderValue(cell, row) {
    return (
        <div className="order">
          <p className="order-value" style={{fontSize: 15, fontWeight: 600}}>{'+' + config.CURRENCY_LIST[row.currency] + row.total_display}</p>
          <p className="caption">{row.crypto_amount?(row.crypto_amount + ' '):''} {config.PAYMENT_OPTS[row.gateway]}</p>
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
        <Card>
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
