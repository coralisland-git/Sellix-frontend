import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as _ from 'lodash'
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import {
  BlackListChart
} from './sections'
import { confirmAlert } from 'react-confirm-alert';
import { getBlacklist, deleteFromBlacklist } from './actions'
import {
  CommonActions
} from 'services/global'
import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    blacklist_list: state.blacklist.blacklist_list
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getBlacklist }, dispatch),
    deleteFromBlacklist: bindActionCreators({ deleteFromBlacklist }, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch),
  })
}

class Blacklist extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
    this.renderOptions = this.renderOptions.bind(this)
    this.deleteFromBlacklist = this.deleteFromBlacklist.bind(this)
    this.gotoEditPage = this.gotoEditPage.bind(this)
    this.caretRender = this.caretRender.bind(this)
  }

  componentDidMount() {
    this.props.actions.getBlacklist()
  }

  gotoEditPage(e, id) {
    this.props.history.push({
      pathname: `/dashboard/${user}/blacklist/edit/${id}`,
    })
  }

  deleteFromBlacklist(e, id) {
    confirmAlert({
      title: 'Are you sure?',
      message: 'You want to delete this user from blacklist?',
      buttons: [
        {
          label: 'Yes, Delete it!',
          onClick: () => {
            this.setState({ loading: true })
            this.props.deleteFromBlacklist.deleteFromBlacklist({
              uniqid: id
            }).then(res => {
              this.props.actions.getBlacklist()
              this.props.commonActions.tostifyAlert('success', res.message)
            }).catch(err => {
              this.props.commonActions.tostifyAlert('error', err.error || 'Seomthing went wrong!')
            }).finally(() => {
              this.setState({ loading: false })
            })
          }
        },
        {
          label: 'No',
          onClick: () => {return true}
        }
      ]
    });
  }

  renderOptions(cell, row) {
    return (
      <div className="d-flex actions">
        <a onClick={(e) => this.gotoEditPage(e, row.uniqid)}>
          <i className="bx bx-edit-alt" />
        </a>
        <a onClick={(e) => this.deleteFromBlacklist(e, row.uniqid)}>
          <i className="bx bx-trash-alt" />
        </a>
      </div>
    )
  }

  renderBlacklistNote = (cell, row) => {
    if (row.note) {
      return (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {row.note}
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderBlacklistData = (cell, row) => {
    if (
      row.data
    ) {
      return (
        <div>
          {row.data}
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
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
    return (
      <div className="blacklist-screen mt-3">
        <div className="animated fadeIn">
          <div className='blacklist-header'>
            <div className='blacklist-title'>Blacklist</div>
            <Button className="ml-3" color="primary"
            onClick={() => this.props.history.push(`/dashboard/${user}/blacklist/new`)}>Create blacklist</Button>
          </div>
          <BootstrapTable
            options={this.options}
            data={this.props.blacklist_list}
            version="4"
            totalSize={this.props.blacklist_list ? this.props.blacklist_list.length : 0}
            className="product-table"
            trClassName="cursor-pointer"
          >
            <TableHeaderColumn
              isKey
              dataField="type"
              caretRender={this.caretRender}
              dataFormat={this.renderBlacklistData}
              dataSort
              dataAlign="left"
              width='20%'
            >
              BLOCKED DATA
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="type"
              caretRender={this.caretRender}
              dataFormat={this.renderBlacklistNote}
              dataSort
              dataAlign="left"
              width='60%'
            >
              NOTE
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="stock"
              caretRender={this.caretRender}
              dataSort
              dataAlign="right"
              dataFormat={this.renderOptions}
              width='20%'
            >
              OPTIONS
            </TableHeaderColumn>
          </BootstrapTable>
          {/* <Card>
            <CardBody>
              <div className="flex-wrapper align-items-center">
                <h1 className="title">Blacklist</h1>
              </div>
              <Row className="mt-4">
                <Col lg={4}>
                  <Card className="grey">
                    <CardBody className="p-0">
                      <div className="d-flex align-items-center justify-content-between p-3">
                        <h5>Events per day</h5>
                        <div className="new-select fill">
                          <select className="form-control" ref={this.dateRangeSelect}>
                            <option value="12">7 days</option>
                            <option value="6">7 days</option>
                            <option value="3">7 days</option>
                          </select>
                          <i className="fa fa-caret-down fa-lg mt-4" />
                        </div>
                      </div>
                      <BlackListChart />
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="grey">
                    <CardBody>
                      <h1 className="report">0</h1>
                      <p className="report-title">Total events</p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Card className="grey">
                    <CardBody>
                      <p className="title mb-4">VPN/Proxies</p>
                      <div className="custom-checkbox custom-control">
                        <input
                          className="custom-control-input"
                          type="checkbox"
                          id="paypal-email"
                          name="SMTP-auth"
                        />
                        <label className="custom-control-label" htmlFor="paypal-email">
                          Block buyers using a VPN/Proxy for risky payment methods (PayPal, Stripe)
                        </label>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card> */}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blacklist)
