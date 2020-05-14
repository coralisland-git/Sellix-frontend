import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col
} from 'reactstrap'
import { Button } from 'components';
import filter from "lodash/filter"
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'

import './style.scss'
import { getQueries } from './actions'


const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    queries_list: state.queries.queries_list
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getQueries }, dispatch),
    
  })
}

class Queries extends React.Component {
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
    this.props.actions.getQueries()
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

  renderQueryStatus(cell, row) {
    if (
      row.status
    ) {
      return (
        <div className={`badge badge-${row.status.toLowerCase()}`}>
          {row.status}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderQuerieTitle = (cell, row) => {
    if (
      row.title
    ) {
      return (
        <div>
          {row.title}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderQuerieEmail = (cell, row) => {
    if (
      row.customer_email
    ) {
      return (
        <div>
          {row.customer_email}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderQurieData = () => {
    if (this.state.filterValue === 'noSorting') {
      return this.props.queries_list //this.props.queries_list
    } else {
      return filter(this.props.queries_list, querie => querie.status === this.state.filterValue)
    }
  }

  renderTime(cell, row) {
    let newDate = 0
    if (
      row.created_at
    ) {
      newDate = (Date.now() - (+row.created_at * 1000)) / (3600 * 24 * 1000)
      if(newDate > 0){
        if(newDate === 1){
          newDate = `${newDate.toFixed(0)} day ago`
        }else{
          newDate = `${newDate.toFixed(0)} days ago`
        }
      }
      return (
        <div>
          <p>{newDate}</p>
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  replyToQuerie= (e, id) => {
    this.props.history.push({
      pathname: `/dashboard/${user}/query/view/${id}`
    })
  }

  renderOption =  (cell, row) => {
    return (<>
      <Button color="default" onClick={(e) => this.replyToQuerie(e, row.uniqid)}>View</Button>
      </>
    )
  }


  render() {
    const { loading } = this.state
    const { product_list } = this.props

    return (
      <div className="product-screen">
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
                        <select onChange={(e) => {
                          this.setState({
                            filterValue: e.target.value
                          })
                        }} className="form-control query-sorting" ref={this.dateRangeSelect}>
                          <option value="noSorting">No Sorting</option>
                          {/* <option value="latest">Latest</option> */}
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
                          data={this.renderQurieData()}
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
                            width='40%'
                            dataSort
                            dataFormat={this.renderQuerieTitle}
                          >
                            Title
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            dataSort
                            dataAlign="center"
                            width="30%"
                            dataFormat={this.renderQuerieEmail}
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="status"
                            dataSort
                            dataAlign="center"
                            width="10%"
                            dataFormat={this.renderQueryStatus}
                          >
                            Status
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            dataSort
                            width="10%"
                            dataAlign="center"
                            dataFormat={this.renderOption}
                          >
                            Option
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="updatedAt"
                            dataAlign="right"
                            dataSort
                            dataFormat={this.renderTime}
                          >
                            Updated at
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

export default connect(mapStateToProps, mapDispatchToProps)(Queries)
