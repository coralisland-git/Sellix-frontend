import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input
} from 'reactstrap'
import { Button } from 'components';
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'

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

const Confirm = ({ onClose, title, message, onDelete }) => {
  return <div className={"react-confirm-alert" + ` ${window.localStorage.getItem('theme') || 'light'}`}>
    <div className="react-confirm-alert-body">
      <h1>{title}</h1>
      <h3>{message}</h3>
      <div className="react-confirm-alert-button-group">
        <Button color={"primary"} onClick={() => {onDelete(); onClose();}}>Yes, Delete it!</Button>
        <Button color={"primary"}  onClick={onClose}>No</Button>
      </div>
    </div>
  </div>
}


class Product extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
    this.deleteCoupon = this.deleteCoupon.bind(this)

    this.options = {
      onRowClick: this.goToDetail,
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



  onDeleteCoupon = (id) => () => {
    this.setState({ loading: true })
    this.props.deleteCoupon.deleteCoupon({
      uniqid: id
    }).then(res => {
      this.props.actions.getCoupons()
      this.props.commonActions.tostifyAlert('success', res.message)
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
    }).finally(() => {
      this.setState({ loading: false })
    })
  };

  deleteCoupon = (e, id) => {
    confirmAlert({
      title: 'Are you sure?',
      message: 'You want to delete this coupon?',
      customUI:  (props) => <Confirm {...props} onDelete={this.onDeleteCoupon(id)}/>
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
          <i className="fas fa-pen" />
        </a>
        <a onClick={(e) => this.deleteCoupon(e, row.uniqid)}>
          <i className="fas fa-trash" />
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
        <div>
          {row.products_count}
        </div>
      )
    } else {
      return (
        <div>All Products</div>
      )
    }
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
                          striped
                          totalSize={this.props.coupons ? this.props.coupons.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="type"
                            dataFormat={this.renderCouponCode}
                            width="30%"
                            dataSort
                          >
                            Code
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="type"
                            width="20%"
                            dataAlign="center"
                            dataFormat={this.renderCouponDiscount}
                            dataSort
                          >
                            Discount
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            // dataField="products_count"
                            dataFormat={this.renderProductsCount}
                            dataSort
                            dataAlign="center"
                            width="20%"
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
