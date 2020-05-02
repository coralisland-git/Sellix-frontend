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
var moment = require('moment');

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
    this.props.actions.getUser(this.props.match.params.id)
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

  renderProoductType(cell, row) {
    if (
      row.type
    ) {
      return (
        <div>
          {row.type}
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

  renderIP(cell, row) {
    if (
      row.ip
    ) {
      return (
        <div>
          {row.ip}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderIPDate(cell, row) {
    if (
      row.created_at
    ) {
      return (
        <div>
          {moment(row.created_at * 1000).format('lll')}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  viewOrderAdmin = (e, id) => {
    this.props.history.push({
      pathname: `/admin/users/view/${this.props.match.params.id}/order/${id}`
    })
  }

  viewProductAdmin = (e, id) => {
    this.props.history.push({
      pathname: `/admin/users/view/${this.props.match.params.id}/product/edit/${id}`
    })
  }

  renderOrdersOptions = (cell, row) => {
    return <Button color="default" onClick={(e) => this.viewOrderAdmin(e, row.uniqid)}>Manage</Button>
  }

  renderProductsOprions = (cell, row) => {
    return <Button color="default" onClick={(e) => this.viewProductAdmin(e, row.uniqid)}>Edit</Button>
  }

  editUser = () => {
    this.props.history.push({
      pathname: `/admin/users/view/${this.props.match.params.id}/edit/${this.props.match.params.id}`
    })
  }

  render() {
    const { loading } = this.state
    console.log({user: this.props.user})
    return (
      <div className="detail-product-screen">
        <div className="animated fadeIn adminUser">
          <div className='adminUserBlock'>
            <h5>User</h5>
            <div className="userBlockRow">ID: {this.props.user.id}</div>
            <div className="userBlockRow">Username: {this.props.user.username}</div>
            <div className="userBlockRow">Email: {this.props.user.email}</div>
            <div className="userBlockRow">Email_2fa: {this.props.user.email_2fa === '0' ? 'False' : "True"}</div>
            <div className="userBlockRow">otp_2fa: {this.props.user.otp_2fa === '0' ? 'False' : "True"}</div>
            <Button color="default" className='mt-4 mb-3 btn btn-primary' onClick={() => this.editUser()}>Edit</Button>
          </div>
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
                              striped
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
                                width="20%"
                                dataAlign="right"
                                dataFormat={this.renderProoductPrice}
                              >
                                Price
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="status"
                                dataAlign="right"
                                dataSort
                                width="20%"
                                dataFormat={this.renderProoductType}
                              >
                                Type
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="updatedAt"
                                dataAlign="right"
                                width="20%"
                                dataSort
                                dataFormat={this.renderProoductStock  }
                              >
                                Stock
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="id"
                                dataSort
                                width="20%"
                                dataAlign="right"
                                dataFormat={this.renderProductsOprions}
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
                              striped
                              // totalSize={product_list ? product_list.length : 0}
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
                              {/* <TableHeaderColumn
                                dataField="email"
                                dataSort
                                width="20%"
                                dataAlign="right"
                                dataFormat={this.renderProoductPrice}
                              >
                                Value
                          </TableHeaderColumn> */}
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
                                dataField="updatedAt"
                                width="25%"
                                dataAlign="right"
                                dataSort
                                dataFormat={this.renderProoductStock  }
                              >
                                Date
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="id"
                                dataSort
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
                        <span className="ml-2">IP LOGS</span>
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
                              data={this.props.user.ips}
                              version="4"
                              pagination
                              striped
                              // totalSize={product_list ? product_list.length : 0}
                              className="product-table"
                              trClassName="cursor-pointer"
                            >
                              <TableHeaderColumn
                                isKey
                                dataField="title"
                                dataSort
                                dataFormat={this.renderIP }
                              >
                                IP
                          </TableHeaderColumn>
                              <TableHeaderColumn
                                dataField="email"
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
