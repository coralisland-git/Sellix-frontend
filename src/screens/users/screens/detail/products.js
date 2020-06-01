import React, { Component } from 'react'
import { Card, CardBody, Row, Col, FormGroup } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { tableOptions } from 'constants/tableoptions'
import { Loader, Button } from 'components'
import { withRouter } from "react-router-dom";

import './style.scss'
import config from "../../../../constants/config";



class UserProductsTable extends Component {

  renderProductPrice = (cell, row) => row.price ? <div>{config.CURRENCY_LIST[row.currency]}{row.price_display}</div> : <p className="caption">No specified</p>

  renderProductStock = (cell, row) => row.stock ? <div>{row.stock}</div> : <p className="caption">No specified</p>

  renderProductType = (cell, row) => row.type ? <div>{row.type}</div> : <p className="caption">No specified</p>

  renderProductsOptions = (cell, row) => <Button style={{ minHeight: "35px"}} color="default" onClick={() => this.viewProductAdmin(row.uniqid)}>Edit</Button>

  viewProductAdmin = (id, username) => this.props.history.push(`/admin/users/${username}/product/edit/${id}`)

  render() {
    const { products, loading } = this.props;

    return (
        <Card>
          <CardBody className="p-4 mb-4">
            <Row>
              <Col lg={12}>
                <Row>
                  <Col lg={12}>
                    <FormGroup>
                      <h4 className="mb-4">Products In Stock</h4>
                    </FormGroup>
                  </Col>
                </Row>

                {loading && <Row><Col lg={12}><Loader /></Col></Row>}
                {!loading &&
                  <Row>
                  <Col lg={12}>
                    <div>
                      <BootstrapTable
                          options={tableOptions({ onRowClick: (row) => this.viewProductAdmin(row.uniqid, row.username) })}
                          data={products}
                          version="4"
                          striped
                          pagination
                          totalSize={products ? products.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                      >
                        <TableHeaderColumn
                            isKey
                            dataField="title"
                            width='35%'
                            dataSort
                            dataFormat={this.renderUserId}
                        >
                          Info
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="price"
                            dataSort
                            width="15%"
                            dataAlign="right"
                            dataFormat={this.renderProductPrice}
                        >
                          Price
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="type"
                            dataAlign="right"
                            dataSort
                            width="15%"
                            dataFormat={this.renderProductType}
                        >
                          Type
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="stock"
                            dataAlign="center"
                            width="15%"
                            dataSort
                            dataFormat={this.renderProductStock  }
                        >
                          Stock
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="options"
                            width="20%"
                            dataAlign="right"
                            dataFormat={this.renderProductsOptions}
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
