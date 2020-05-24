import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col } from 'components/reactstrap'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'
import { getTopUsers } from './actions'
import withRouter from "react-router-dom/withRouter"

import './style.scss'


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

  renderUserId = (cell) => {

    let color = 'transparent';
    switch (cell) {
      case 1:
        color = "#C9B037"
        break
      case 2:
        color = "#D7D7D7"
        break
      case 3:
        color = "#AD8A56"
        break
    }

    return <div style={{ fontSize: "1rem" }}><i className={"fas fa-trophy"} style={{ marginRight: "1.3rem", fontSize: "1.2rem", color }} />#{cell}</div>
  }

  renderUserEmail = (cell, row) => row.email ? <div>{row.email}</div> : <p className="caption">No specified</p>

  renderUserRevenue = (cell, row) => row.revenue ? <div>$ {row.revenue}</div> : <p className="caption">No specified</p>

  viewUser = (id) => this.props.history.push(`/admin/users/${id}`)

  render() {

    const { loading } = this.state;
    const { topUsers } = this.props;

    let data = topUsers.map((user, key) => {
      user.position = key + 1;
      return user;
    })

    return (
      <div className="product-screen top-user">
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
                          options={tableOptions({ onRowClick: (row) => this.viewUser(row.id), sizePerPage: 10 })}
                          data={data}
                          version="4"
                          totalSize={topUsers ? topUsers.length : 0}
                          striped
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="position"
                            width='10%'
                            dataSort
                            dataFormat={this.renderUserId}
                          >
                            Position
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
                            width="30%"
                            dataFormat={this.renderUserUsername}
                          >
                            Username
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="revenue"
                            dataSort
                            dataAlign="center"
                            width="30%"
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



const mapStateToProps = (state) => ({
  topUsers: state.topUsers.topUsers
})

const mapDispatchToProps = (dispatch) => ({
  getTopUsers: bindActionCreators(getTopUsers, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopUsers))
