import React from 'react'
import { Card, CardBody, Row, Col, FormGroup } from 'components/reactstrap'
import { Loader } from 'components'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { tableOptions } from 'constants/tableoptions'

import './style.scss'



const Custom = ({ loading, custom_fields }) => {

    let custom = []
    if(custom_fields){
        const data = JSON.parse(custom_fields || {})['custom_fields'] || {}
        custom = Object.keys(data).map((key) => ({field: key, value: data[key]}))
    }

    return <Col lg={6}>
            <Card>
                <CardBody className="">
                    {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                    {!loading &&
                            <Row className="">
                                <Col lg={12}>
                                    <FormGroup className="mb-4">
                                        <h4 className="title">Provided Custom Fields</h4>
                                    </FormGroup>
                                </Col>
                                <Col lg={12}>
                                    <BootstrapTable
                                        options={ tableOptions() }
                                        data={custom}
                                        version="4"
                                        pagination
                                        striped
                                        totalSize={custom.length}
                                        className="provided-custom-table"
                                        trClassName="cursor-pointer"
                                    >
                                        <TableHeaderColumn
                                            isKey
                                            dataField="field"
                                            dataSort
                                            width='50%'
                                        >
                                            Field
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="value"
                                            dataSort
                                        >
                                            Value
                                        </TableHeaderColumn>
                                    </BootstrapTable>
                                </Col>
                            </Row>
                    }
                </CardBody>
            </Card>
        </Col>
}

export default Custom;