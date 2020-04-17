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

const testdata = [
  {
    "id": "16",
    "uniqid": "dc1a4b-806ee257dd-7346ca",
    "customer_email": "testing@gmail.com",
    "user_id": "14",
    "role": "customer",
    "title": "query title",
    "message": "this is a testing query",
    "day_value": "31",
    "day": "Tue",
    "month": "Mar",
    "year": "2020",
    "date": "1585670037",
    "reply_to": null,
    "status": "closed",
    "section": "support"
  },
  {
    "id": "1623",
    "uniqid": "dc1a4b-806ee257dd-7346ca",
    "customer_email": "testing@gmail.com",
    "user_id": "14",
    "role": "customer",
    "title": "query title",
    "message": "this is a testing query",
    "day_value": "31",
    "day": "Tue",
    "month": "Mar",
    "year": "2020",
    "date": "1585680037",
    "reply_to": null,
    "status": "closed",
    "section": "support"
  },
  {
    "id": "14564",
    "uniqid": "dc1a4b-806ee257dd-7346ca",
    "customer_email": "testing@gmail.com",
    "user_id": "14",
    "role": "customer",
    "title": "query title",
    "message": "this is a testing query",
    "day_value": "31",
    "day": "Tue",
    "month": "Mar",
    "year": "2020",
    "date": "1585680037",
    "reply_to": null,
    "status": "open",
    "section": "support"
  },{
    "id": "16",
    "uniqid": "dc1a4b-806ee257dd-7346ca",
    "customer_email": "testing@gmail.com",
    "user_id": "14",
    "role": "customer",
    "title": "query title",
    "message": "this is a testing query",
    "day_value": "31",
    "day": "Tue",
    "month": "Mar",
    "year": "2020",
    "date": "1585680037",
    "reply_to": null,
    "status": "pending",
    "section": "support"
  },{
    "id": "16",
    "uniqid": "dc1a4b-806ee257dd-7346ca",
    "customer_email": "testing@gmail.com",
    "user_id": "14",
    "role": "customer",
    "title": "query title",
    "message": "this is a testing query",
    "day_value": "31",
    "day": "Tue",
    "month": "Mar",
    "year": "2020",
    "date": "1585680037",
    "reply_to": null,
    "status": "open",
    "section": "support"
  },
]

class Queries extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      filterValue: 'noSorting',
    }

    this.initializeData = this.initializeData.bind(this)
    this.caretRender = this.caretRender.bind(this)
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
        <div className={`badge badge-${row.status.toLowerCase()}`} style={{ margin: '0 auto' }}>
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
      return _.filter(this.props.queries_list, querie => querie.status === this.state.filterValue)
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
      pathname: `/dashboard/${user}/querie/view/${id}`
    })
  }

  renderOption =  (cell, row) => {
    return (<>
      <Button color="default" onClick={(e) => this.replyToQuerie(e, row.uniqid)}>View</Button>
      </>
    )
  }

  caretRender(direction) {
		return (
			<div style={{ marginLeft: 12.4, display: 'inline' }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3.621"
					height="11.98"
					style={{
						marginRight: 3,
						transform: `scale(${direction === 'desc' ? 1.2 : 1.1})`,
						transition: 'all 0.2s linear'
					}}
					opacity={direction === 'asc' ? 0.4 : 1}
					viewBox="0 0 3.621 11.72"
				>
					<path
						d="M6.834,15.272V4.586h.54V15.272l1.159-1.159.382.382L7.1,16.306,5.293,14.5l.382-.382Z"
						transform="translate(-5.293 -4.586)"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3.621"
					height="11.98"
					style={{
						transform: `scale(${direction === 'asc' ? 1.2 : 1.1})`,
						transition: 'all 0.2s linear'
					}}
					opacity={direction === 'desc' ? 0.4 : 1}
					viewBox="0 0 3.621 11.72"
				>
					<path
						d="M6.834,5.619V16.306h.54V5.619L8.532,6.778,8.914,6.4,7.1,4.586,5.293,6.4l.382.382Z"
						transform="translate(-5.293 -4.586)"
					/>
				</svg>
			</div>
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
                          // totalSize={product_list ? product_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="title"
                            caretRender={this.caretRender}
                            width='30%'
                            dataSort
                            dataFormat={this.renderQuerieTitle}
                          >
                            Title
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="email"
                            caretRender={this.caretRender}
                            dataAlign="left"
                            dataSort
                            width="20%"
                            dataFormat={this.renderQuerieEmail}
                          >
                            Email
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="status"
                            width="10%"
                            dataAlign="center"
                            caretRender={this.caretRender}
                            dataSort
                            dataFormat={this.renderQueryStatus}
                          >
                            Status
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            dataSort
                            width="30%"
                            dataAlign="right"
                            caretRender={this.caretRender}
                            dataFormat={this.renderOption}
                          >
                            Option
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="updatedAt"
                            dataAlign="right"
                            width="10%"
                            dataSort
                            caretRender={this.caretRender}
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
