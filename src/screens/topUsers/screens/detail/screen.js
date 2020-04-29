import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { tableOptions } from 'constants/tableoptions'
import Select from 'react-select'
import { Loader } from 'components'
import {getUser} from './actions'


import './style.scss'

const mapStateToProps = (state) => {
  return ({
    user: state.users.user
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getUser }, dispatch),
  })
}

class User extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }

  }

  componentDidMount(){
    this.props.actions.getUser()
  }

  renderProoductPrice(cell, row) {
    if (
      row.price
    ) {
      return (
        <div>
          {row.price}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderProoductStock(cell, row) {
    if (
      row.stock
    ) {
      return (
        <div>
          {row.stock}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }
  renderOrderStatus(cell, row) {
    if (
      row.status
    ) {
      return (
        <div>
          {row.status}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderOrderTitle(cell, row) {
    if (
      row.product_title
    ) {
      return (
        <div>
          {row.product_title}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  render() {
    const { loading } = this.state
    console.log({user: this.props.user})
    return (
      <div className="detail-product-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <span className="ml-2">PRODUCTS IN STOCK</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="p-0">
                  {
                    loading ?
                      <Row>
                        <Col lg={12}>
                          <Loader />
                        </Col>
                      </Row>
                      :
                      <Row>
                        <Col lg={12}>
                          <div>
                            <BootstrapTable
                              options={tableOptions()}
                              data={this.props.user.products}
                              version="4"
                              pagination
                              // totalSize={product_list ? product_list.length : 0}
                              className="product-table"
                              trClassName="cursor-pointer"
                            >
                              <TableHeaderColumn
                                isKey
                                dataField="title"
                                width='20%'
                                dataSort
                                dataFormat={this.renderUserId}
                              >
                                Info
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="email"
                                dataSort
                                width="30%"
                                dataFormat={this.renderProoductPrice}
                              >
                                Price
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="status"
                                // dataAlign="right"
                                dataSort
                                dataFormat={this.renderUserUsername}
                              >
                                Type
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="updatedAt"
                                // dataAlign="right"
                                dataSort
                                dataFormat={this.renderProoductStock  }
                              >
                                Stock
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="id"
                                dataSort
                                width="30%"
                                dataAlign="right"
                                dataFormat={this.renderOption}
                              >
                                Option
                          </TableHeaderColumn>

                            </BootstrapTable>
                          </div>
                        </Col>
                      </Row>
                      
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <span className="ml-2">ORDERS</span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="p-0">
                  {
                    loading ?
                      <Row>
                        <Col lg={12}>
                          <Loader />
                        </Col>
                      </Row>
                      :
                      <Row>
                        <Col lg={12}>
                          <div>
                            <BootstrapTable
                              options={tableOptions()}
                              data={this.props.user.invoices}
                              version="4"
                              pagination
                              // totalSize={product_list ? product_list.length : 0}
                              className="product-table"
                              trClassName="cursor-pointer"
                            >
                              <TableHeaderColumn
                                isKey
                                dataField="title"
                                width='20%'
                                dataSort
                                dataFormat={this.renderOrderTitle}
                              >
                                Product
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="email"
                                dataSort
                                width="30%"
                                dataFormat={this.renderProoductPrice}
                              >
                                Value
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="status"
                                // dataAlign="right"
                                dataSort
                                dataFormat={this.renderOrderStatus}
                              >
                                Status
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="updatedAt"
                                // dataAlign="right"
                                dataSort
                                dataFormat={this.renderProoductStock  }
                              >
                                Date
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="id"
                                dataSort
                                width="30%"
                                dataAlign="right"
                                dataFormat={this.renderOption}
                              >
                                Option
                          </TableHeaderColumn>

                            </BootstrapTable>
                          </div>
                        </Col>
                      </Row>
                      
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User)
