import React from 'react'
import { Card, CardBody, Row, Col, FormGroup } from 'components/reactstrap'
import * as moment from 'moment/moment'
import { Loader } from 'components'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { tableOptions } from 'constants/tableoptions'

import './style.scss'


const Webhooks = ({ loading, webhooks }) => {

    return <Row>
        <Col lg={12}>
            <Card>
                <CardBody className="">
                    {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                    {!loading &&
                    <Row className="">
                        <Col lg={12}>
                            <FormGroup className="mb-4">
                                <h4 className="title">Delivered Webhooks</h4>
                            </FormGroup>
                        </Col>
                        <Col lg={12}>
                            <Row>
                                <Col lg={12}>
                                    <BootstrapTable
                                        options={ tableOptions() }
                                        data={webhooks}
                                        version="4"
                                        pagination
                                        striped
                                        totalSize={webhooks.length}
                                        className="product-table"
                                        trClassName="cursor-pointer"
                                    >
                                        <TableHeaderColumn
                                            isKey
                                            dataField="url"
                                            width='30%'
                                        >
                                            URL
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="event"
                                            dataSort
                                            dataAlign="center"
                                            dataFormat={(cell, row) => <span className="webhook-badge">{row.event}</span>}
                                            width='20%'
                                        >
                                            Event
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="attempts"
                                            dataAlign='center'
                                            dataSort
                                            width='10%'
                                        >
                                            Attemps
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="response_code"
                                            dataAlign='center'
                                            dataSort
                                            dataFormat={(cell, row) => <span className="webhook-badge">{row.response_code}</span>}
                                            width='20%'
                                        >
                                            Response Code
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="created_at"
                                            dataAlign='right'
                                            dataSort
                                            dataFormat={(cell, row) => <div>{moment(new Date(row.created_at*1000)).format('DD MMM hh:mm:ss')}</div>}
                                        >
                                            Time
                                        </TableHeaderColumn>
                                    </BootstrapTable>
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                    }
                </CardBody>
            </Card>
        </Col>
    </Row>
}

export default Webhooks;