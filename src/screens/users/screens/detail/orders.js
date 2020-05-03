import React, { Component } from 'react'
import {Card, CardBody, Row, Col, FormGroup} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { tableOptions } from 'constants/tableoptions'
import {Button, Loader} from 'components'
import { withRouter } from "react-router-dom";
import * as moment from 'moment/moment'

import './style.scss'



class UserProductsTable extends Component {

  renderOrdersDate = (cell, row) => row.created_at ? <div>{moment(row.created_at * 1000).format('lll')}</div> : <p className="caption">No specified</p>

  renderOrdersOptions = (cell, row) => <Button style={{ minHeight: "35px"}} color="default" onClick={(e) => this.viewOrderAdmin(row.uniqid)}>Manage</Button>

  renderOrderStatus = (cell, row) => row.status ? <div>{row.status}</div> : <p className="caption">No specified</p>

  renderOrderTitle = (cell, row) => row.product_title ? <div>{row.product_title}</div> : <p className="caption">No specified</p>

  viewOrderAdmin = (id, username) => this.props.history.push(`/admin/users/${username}/order/${id}`)

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
                    <div>
                      <BootstrapTable
                          options={tableOptions({ onRowClick: (row) => this.viewOrderAdmin(row.uniqid, row.username) })}
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
                            dataField="title"
                            dataSort
                            dataFormat={this.renderOrderTitle}
                        >
                          Product
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="status"
                            width="25%"
                            dataAlign="center"
                            dataSort
                            dataFormat={this.renderOrderStatus}
                        >
                          Status
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="updated_at"
                            width="25%"
                            dataAlign="right"
                            dataSort
                            dataFormat={this.renderOrdersDate  }
                        >
                          Date
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            width="25%"
                            dataAlign="right"
                            dataFormat={this.renderOrdersOptions}
                        >
                          Option
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
