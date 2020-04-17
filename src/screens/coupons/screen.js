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
  Input
} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { Loader } from 'components'
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import {
  CommonActions
} from 'services/global'
import { getCoupons, deleteCoupon } from './actions'

import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    coupons: state.coupons.coupons
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators({ getCoupons }, dispatch),
    deleteCoupon: bindActionCreators({ deleteCoupon }, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class Product extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
    this.deleteCoupon = this.deleteCoupon.bind(this)
    this.caretRender = this.caretRender.bind(this)

    this.options = {
      onRowClick: this.goToDetail,
      paginationPosition: 'bottom',
      page: 1,
      sizePerPage: 5,  // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3,  // the pagination bar size.
      prePage: '<Prev', // Previous page button text
      nextPage: 'Next>', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
      paginationPosition: 'bottom',  // default is bottom, top and both is all available
      hideSizePerPage: true// > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
    }

    this.selectRowProp = {
      mode: 'checkbox',
      bgColor: 'rgba(0,0,0, 0.05)',
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    }
  }

  componentDidMount() {
    this.props.actions.getCoupons()
  }

  renderProductType(cell, row) {
    if (
      row.type
    ) {
      return (
        <div className="badge badge-normal">
          {row.type}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderProductRevenue(cell, row) {
    if (
      row.revenue
    ) {
      return (
        <p>
          ${row.revenue}
        </p>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  deleteCoupon = (e, id) => {
    confirmAlert({
      title: 'Are you sure?',
      message: 'You want to delete this coupon?',
      buttons: [
        {
          label: 'Yes, Delete it!',
          onClick: () => {
            this.setState({ loading: true })
            this.props.deleteCoupon.deleteCoupon({
              uniqid: id
            }).then(res => {
              this.props.actions.getCoupons()
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
          onClick: () => { return true }
        }
      ]
    });
  }

  gotoEditPage(e, id) {
    this.props.history.push({
      pathname: `/dashboard/${user}/coupons/edit/${id}`,
    })
  }

  renderOptions = (cell, row) => {
    return (
      <div className="d-flex actions">
        <a onClick={(e) => this.gotoEditPage(e, row.uniqid)}>
          <i className="bx bx-edit-alt" />
        </a>
        <a onClick={(e) => this.deleteCoupon(e, row.uniqid)}>
          <i className="bx bx-trash-alt" />
        </a>
      </div>
    )
  }

  renderCouponCode = (cell, row) => {
    if (
      row.code
    ) {
      return (
        <div>
          {row.code}
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderCouponDiscount = (cell, row) => {
    if (
      row.discount
    ) {
      return (
        <div>
          {row.discount}%
        </div>
      )
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderProductsCount = (cell, row) => {
    if (
      row.products_count
    ) {
      return (
        <>
          {row.products_count}
        </>
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

    const { loading } = this.state
    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row style={{ alignItems: 'center' }}>
                <Col md={4}>
                  <h1>Coupons</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                    <div className="searchbar white">
                      <i className="fas fa-search" />
                      <Input placeholder="Search..." className="header-search-input"></Input>
                    </div>
                    <Button className="ml-3" color="primary"
                      onClick={() => this.props.history.push(`/dashboard/${user}/coupons/new`)}>Add Coupon</Button>
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
                          options={this.options}
                          data={this.props.coupons}
                          version="4"
                          pagination
                          totalSize={this.props.coupons ? this.props.coupons.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="type"
                            caretRender={this.caretRender}
                            dataFormat={this.renderCouponCode}
                            width="30%"
                            dataSort
                          >
                            Code
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="type"
                            dataAlign="center"
                            caretRender={this.caretRender}
                            dataFormat={this.renderCouponDiscount}
                            dataSort
                            width="30%"
                          >
                            Discount
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="products_count"
                            dataAlign="center"
                            caretRender={this.caretRender}
                            width="20%"
                            dataSort
                          >
                            Product Count
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="used"
                            dataSort
                            dataAlign="center"
                            width="20%"
                          >
                            Used
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            dataAlign="right"
                            width="10%"
                            dataFormat={this.renderOptions}
                          >
                            Options
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

export default connect(mapStateToProps, mapDispatchToProps)(Product)
