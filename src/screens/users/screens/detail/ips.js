import React, { Component } from 'react'
import {Card, CardBody, Row, Col, CardHeader, FormGroup} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { tableOptions } from 'constants/tableoptions'
import { Loader } from 'components'
import { withRouter } from "react-router-dom";
import moment from "moment";

import './style.scss'



class UserProductsTable extends Component {

    renderIP = (cell, row) => row.ip ? <div>{row.ip}</div> : <p className="caption">No specified</p>

    renderIPDate = (cell, row) => row.created_at ? <div>{moment(row.created_at * 1000).format('lll')}</div> : <p className="caption">No specified</p>

  render() {

    const { ips, loading } = this.props;

    return (
        <Card>
            <CardBody className="p-4 mb-4">
                <Row>
                    <Col lg={12}>
                        <Row>
                            <Col lg={12}>
                                <FormGroup>
                                    <h4 className="mb-4">IP's</h4>
                                </FormGroup>
                            </Col>
                        </Row>
                        {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                        {!loading &&
                            <Row>
                            <Col lg={12}>
                                <div>
                                    <BootstrapTable
                                        options={tableOptions({ sizePerPage: 4})}
                                        data={ips}
                                        version="4"
                                        pagination
                                        totalSize={ips ? ips.length : 0}
                                        className="product-table"
                                        trClassName="cursor-pointer"
                                    >
                                        <TableHeaderColumn
                                            isKey
                                            dataField="ip"
                                            dataSort
                                            dataFormat={this.renderIP }
                                        >
                                            IP
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="created_at"
                                            dataSort
                                            width="50%"
                                            dataAlign="left"
                                            dataFormat={this.renderIPDate}
                                        >
                                            Date
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
