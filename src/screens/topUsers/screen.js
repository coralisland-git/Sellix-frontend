import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Loader, Button } from 'components'
import { tableOptions } from 'constants/tableoptions'
import { getTopUsers } from './actions'

import './style.scss'


const mapStateToProps = (state) => ({
  topUsers: state.topUsers.topUsers
})

const mapDispatchToProps = (dispatch) => ({
  getTopUsers: bindActionCreators(getTopUsers, dispatch),
})

class TopUsers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      filterValue: 'noSorting',
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getTopUsers().finally(() => this.setState({ loading: false }))
  }

  renderUserUsername = (cell, row) => row.username ? <div>{row.username}</div> : <p className="caption">No specified</p>

  renderUserId = (cell, row) => row.id ? <div>{row.id}</div> : <p className="caption">No specified</p>

  renderUserEmail = (cell, row) => row.email ? <div>{row.email}</div> : <p className="caption">No specified</p>

  renderUserRevenue = (cell, row) => row.revenue ? <div>{row.revenue}</div> : <p className="caption">No specified</p>

  viewUser = (e, id) => this.props.history.push(`/admin/users/${id}`)

  renderOption = (cell, row) => <Button color="default" onClick={(e) => this.viewUser(e, row.id)}>View</Button>

  render() {

    const { loading } = this.state;
    const { topUsers } = this.props;

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <Card className="grey">

            <CardHeader>
              <Row style={{ alignItems: 'center' }}>
                <Col md={12}>
                  <h1>Top users</h1>
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
                          options={tableOptions({ sizePerPage: 10 })}
                          data={topUsers}
                          version="4"
                          totalSize={topUsers ? topUsers.length : 0}
                          striped
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="id"
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
                            dataField="username"
                            dataSort
                            dataFormat={this.renderUserUsername}
                          >
                            Username
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="revenue"
                            dataSort
                            dataFormat={this.renderUserRevenue}
                          >
                            Revenue
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

export default connect(mapStateToProps, mapDispatchToProps)(TopUsers)
