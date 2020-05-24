import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Card, CardHeader, CardBody, Row, Col } from 'components/reactstrap'
import { Button } from 'components';
import filter from "lodash/filter"
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'

import './style.scss'
import { getQueries } from './actions'
import * as moment from "moment";


const user = window.localStorage.getItem('userId')


class Queries extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      filterValue: 'noSorting',
    }
  }

  componentDidMount() {
    this.props.actions.getQueries()
  }

  renderQueryStatus = (cell, row) => {

    let badge = 'netural'
    switch (row.status) {
      case 'closed':
        badge = 'closed'
        break;
      case 'pending':
        badge = 'pending'
        break;
      case 'userreply':
        badge = 'reply'
        break;
      case 'customerreply':
        badge = 'pending'
        break;
    }

    return row.status ?
        <div className={`badge badge-${badge}`} style={{ textTransform: "capitalize" }}>
          {row.status === 'userreply' ? "Answered" : (row.status === 'customerreply' ? "Customer Reply" : row.status)}
        </div> :
        <p className="caption">No specified</p>
  }

  renderQueryTitle = (cell, row) => row.title ? <div>{row.title}</div> : <p className="caption">No specified</p>

  renderQueryEmail = (cell, row) => row.customer_email ? <div>{row.customer_email}</div> : <p className="caption">No specified</p>

  renderQueryData = () => this.state.filterValue === 'noSorting' ? this.props.queries_list : filter(this.props.queries_list, query => query.status === this.state.filterValue)

  renderTime = (cell, row) => row.created_at ? <div><p>{moment(row.created_at * 1000).format("DD, MMM HH:mm")}</p></div> : <p className="caption">No specified</p>

  replyToQuery = (e, id) => this.props.history.push({ pathname: `/dashboard/${user}/queries/${id}`})

  renderOption =  (cell, row) => <Button color="default" onClick={(e) => this.replyToQuery(e, row.uniqid)}>View</Button>


  render() {

    const { loading } = this.state;

    return (
      <div className="queries-screen">
        <div className="animated fadeIn">
          <Card className="grey">

            <CardHeader>
              <Row style={{ alignItems: 'center' }}>
                <Col md={4}>
                  <h1>Queries</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                    <div className="white">
                      <div className="new-select fill">
                        <select onChange={(e) => {this.setState({filterValue: e.target.value})}} className="form-control query-sorting">
                          <option value="noSorting">No Sorting</option>
                          <option value="open">Open</option>
                          <option value="closed">Close</option>
                          <option value="pending">Pending</option>
                        </select>
                        <i className="fa fa-caret-down fa-lg mt-4" />
                      </div>
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
                          options={tableOptions({ sizePerPage: 10 })}
                          data={this.renderQueryData()}
                          version="4"
                          pagination
                          striped
                          totalSize={this.props.queries_list.length}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="title"
                            width='30%'
                            dataSort
                            dataFormat={this.renderQueryTitle}
                          >
                            Title
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            dataSort
                            dataAlign="center"
                            width="30%"
                            dataFormat={this.renderQueryEmail}
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="created_at"
                            dataAlign="right"
                            width="15%"
                            dataSort
                            dataFormat={this.renderTime}
                          >
                            Created
                          </TableHeaderColumn>
                          <TableHeaderColumn
                              dataField="status"
                              dataSort
                              dataAlign="center"
                              width="15%"
                              dataFormat={this.renderQueryStatus}
                          >
                            Status
                          </TableHeaderColumn>
                          <TableHeaderColumn
                              dataField="id"
                              width="10%"
                              dataAlign="center"
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


const mapStateToProps = (state) => ({
  queries_list: state.queries.queries_list
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ getQueries }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Queries)
