import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col, Input } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { Loader, Button } from 'components'
import { withRouter } from 'react-router-dom'
import { tableOptions } from 'constants/tableoptions'
import { getUsers } from './actions'

import './style.scss'

const mapStateToProps = ({ users: { users }}) => ({ users })
const mapDispatchToProps = (dispatch) => ({ getUsers: bindActionCreators(getUsers, dispatch)})

class Users extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      filterValue: 'noSorting',
    }
  }

  componentDidMount() {
    this.props.getUsers()
        .finally(() => this.setState({ loading: false }))
  }

  renderUserUsername = (cell, row) => row.username ? <div>{row.username}</div> : <p className="caption">No specified</p>

  renderUserId = (cell, row) => row.id ? <div>{row.id}</div> : <p className="caption">No specified</p>

  renderUserEmail = (cell, row) => row.email ? <div>{row.email}</div> : <p className="caption">No specified</p>

  renderUserProducts = (cell, row) => row.products_count ? <div>{row.products_count}</div> : <p className="caption">No specified</p>

  renderOption =  (cell, row) => <Button color="default" style={{ minHeight: "35px", fontSize: ".9rem !important" }} onClick={() => this.props.history.push(`/admin/users/${row.id}`)}>View</Button>

  viewUser = (id) => this.props.history.push(`/admin/users/${id}`)

  searchOrders(users) {
    const { search_key } = this.state;
    const search_fields = ['id', 'email', 'products_count', 'username'];

    return users.filter(user => {
      for(let i=0; i < search_fields.length; i++) {
        if(user[search_fields[i]] && user[search_fields[i]].toLowerCase().includes(search_key.toLowerCase())) {
          return true
        }
      }
      return false
    })
  }

  revertSortFunc = (a, b, order) => order === 'desc' ?  a.products_count - b.products_count : b.products_count - a.products_count;

  render() {

    const { loading, search_key } = this.state;
    let { users } = this.props;

    if(search_key)
      users = this.searchOrders(users)

    return (
      <div className="product-screen user-screen">
        <div className="animated fadeIn">
          <Card className="grey">

            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <h1>Users</h1>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-end">
                    <div className="searchbar white">
                      <i className="fas fa-search"/>
                      <Input placeholder="Search..." className="header-search-input" onChange={(e) => this.setState({search_key: e.target.value})}/>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>

            <CardBody className="p-0">
              {loading && <Row><Col lg={12}><Loader /></Col></Row>}
              {!loading &&
                  <Row>
                    <Col lg={12}>
                      <div>
                        <BootstrapTable
                          options={tableOptions({ onRowClick: (row) => this.viewUser(row.id), sizePerPage: 15, printToolBar: false })}
                          data={users}
                          version="4"
                          pagination
                          striped
                          totalSize={users ? users.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="id"
                            width='20%'
                            dataFormat={this.renderUserId}
                            dataSort
                          >
                            ID
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            width="30%"
                            dataFormat={this.renderUserEmail}
                            dataSort
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="username"
                            dataFormat={this.renderUserUsername}
                            dataSort
                          >
                            Username
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="products_count"
                            dataFormat={this.renderUserProducts}
                            dataSort
                            sortFunc={this.revertSortFunc}
                          >
                            Products
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users))
