import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button
} from 'reactstrap'
import * as _ from 'lodash'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'

import './style.scss'
import { getUsers } from './actions'


const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    users: state.users.users
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getUsers }, dispatch),
    
  })
}

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      filterValue: 'noSorting',
    }

    this.initializeData = this.initializeData.bind(this)
  }

  componentDidMount() {
    // this.initializeData()
    this.props.actions.getUsers()
  }

  initializeData() {
    // this.props.productActions.getProductList().then(res => {
    //   if (res.status === 200) {
    //     this.setState({ loading: false })
    //   }
    // })

    this.props.productActions.getProductList()
    this.setState({ loading: false })
  }

  renderUserUsername(cell, row) {
    if (
      row.username
    ) {
      return (
        <div>
          {row.username}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderUserId = (cell, row) => {
    if (
      row.id
    ) {
      return (
        <div>
          {row.id}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderUserEmail = (cell, row) => {
    if (
      row.email
    ) {
      return (
        <div>
          {row.email}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderUserProducts = (cell, row) => {
    if (
      row.products_count
    ) {
      return (
        <div>
          {row.products_count}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  viewUser= (e, id) => {
    this.props.history.push({
      pathname: `/admin/users/view/${id}`
    })
  }

  renderOption =  (cell, row) => {
    return (<>
      <Button color="default" onClick={(e) => this.viewUser(e, row.id)}>View</Button>
      </>
    )
  }


  render() {
    const { loading } = this.state
    const { product_list } = this.props
    console.log(this.props.users)
    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row style={{ alignItems: 'center' }}>
                <Col md={4}>
                  <h1>Users</h1>
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
                          data={this.props.users}
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
                            ID
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            dataSort
                            width="30%"
                            dataFormat={this.renderUserEmail}
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="status"
                            // dataAlign="right"
                            dataSort
                            dataFormat={this.renderUserUsername}
                          >
                            Username
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="updatedAt"
                            // dataAlign="right"
                            dataSort
                            dataFormat={this.renderUserProducts}
                          >
                            Products
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
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
