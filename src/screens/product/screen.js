import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable'
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn'
import { Loader, Button } from 'components'
import { confirmAlert } from 'react-confirm-alert'; 
import { tableOptions } from 'constants/tableoptions'
import config from 'constants/config'
import { CommonActions } from 'services/global'
import { Link } from 'react-router-dom'

import * as ProductActions from './actions'
import './style.scss'

const user = window.localStorage.getItem('userId')

const mapStateToProps = (state) => {
  return ({
    all_products: state.product.all_products
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(ProductActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}


const Confirm = ({ onClose, title, message, onDelete }) => {
  return <div className={"react-confirm-alert" + ` ${window.localStorage.getItem('theme') || 'light'}`}>
    <div className="react-confirm-alert-body">
      <h1>{title}</h1>
      <h3>{message}</h3>
      <div className="react-confirm-alert-button-group">
        <button onClick={() => {
          onDelete()
          onClose()
        }}>Yes, Delete it!</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  </div>
}

class Product extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      search_key: null
    }
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData = () => {
    this.setState({ loading: true })
    this.props.actions.getProductList().catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  gotoEditPage = (e, id) => {
    this.props.history.push({
      pathname: `/dashboard/${user}/products/edit/${id}`
    })
  }

  deleteProduct = (e, id) => {
    confirmAlert({
      title: "Are you sure?",
      message: "You want to delete this product?",
      customUI:  (props) => <Confirm {...props} onDelete={this.onDeleteProduct(id)}/>
    });
  }

  renderProductInfo = (cell, row) => {
    if (
      row.title && row.uniqid
    ) {
      return (
        <div>
          <p>
            <Link to={`/dashboard/${user}/products/edit/${row.uniqid}`} >
              {row.title}
            </Link>
          </p>
          <p className="caption">{row.uniqid}</p>
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  onDeleteProduct = (uniqid) => () => {
    this.setState({ loading: true })
    this.props.actions.deleteProduct({ uniqid })
        .then(res => {
          this.props.actions.getProductList()
          this.props.commonActions.tostifyAlert('success', res.message)
        })
        .catch(err => {
          this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
        })
        .finally(() => {
          this.setState({ loading: false })
        })
  }

  renderProductType = (cell, row) => {
    if (
      row.type
    ) {
      return (
        <div className="badge badge-normal" style={{ margin: '0 auto'}}>
          {row.type}
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderProductPrice = (cell, row) => {
    return (
      <p>
        {config.CURRENCY_LIST[row.currency]}{row.price_display}
      </p>
    )  
  }

  renderFileStock = (cell, row) => {

      if(row.type === 'serials'){
        return <p>
          {row.stock}
         </p>
      }
      if(row.type === 'service'){
        if(row.service_stock === '-1'){
          return <p>
            <span style={{fontSize:  20}}>∞</span>
          </p>
        }
        if(row.service_stock != '-1'){
          return <p>
            {row.service_stock}
          </p>
        }
      }
      if(row.type === 'file'){
        if(row.file_stock === '-1'){
          return <p>
            <span style={{fontSize:  20}}>∞</span>
          </p>
        }
        if(row.file_stock != '-1'){
          return <p>
            {row.file_stock}
          </p>
        }
      }
  }

  renderOptions = (cell, row) => {
    return (
      <div className="d-flex actions">
        <a onClick={(e) => this.gotoEditPage(e, row.uniqid)}>
          <i className="fas fa-pen"/>
        </a>
        <a>
          <i className="fas fa-bar-chart"/>
        </a>
        <a onClick={(e) => this.deleteProduct(e, row.uniqid)}>
          <i className="fas fa-trash"/>
        </a>
      </div>
    )
  }

  searchProducts = (products) => {
    const { search_key } = this.state
    const search_fields = ['title', 'type', 'stock', 'revenue']

    const data = products.filter(product => {
      for(let i=0; i<search_fields.length; i++)
        if(product[search_fields[i]] && product[search_fields[i]].includes(search_key))
          return true
      return false
    })

    return data
  }

  render() {
    const { loading, search_key } = this.state
    const all_products = search_key?this.searchProducts(this.props.all_products):this.props.all_products

    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Products</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                    <div className="searchbar white">
                      <i className="fas fa-search"/>
                      <Input placeholder="Search..." 
                        className="header-search-input"
                        onChange={(e) => {
                          this.setState({search_key: e.target.value})
                        }}
                      />
                    </div>
                    <Button className="ml-3" color="primary" onClick={() => this.props.history.push(`/dashboard/${user}/products/new`)}>
                      Add Product
                    </Button>
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
                          options={ tableOptions({ sizePerPage: 10 }) }
                          data={all_products}
                          version="4"
                          pagination
                          striped
                          totalSize={all_products ? all_products.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="uniqid"
                            dataFormat={this.renderProductInfo}
                            dataSort
                            width='44%'
                          >
                            Info
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="type"
                            dataFormat={this.renderProductType}
                            dataAlign="center"
                            dataSort
                            width='13%'
                          >
                            Type
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="file_stock"
                            dataSort
                            dataAlign="center"
                            dataFormat={this.renderFileStock}
                            width='13%'
                          >
                            Stock
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="price_display"
                            dataFormat={this.renderProductPrice}
                            dataSort
                            dataAlign="center"
                            width='13%'
                          >
                            Price
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            dataAlign="right"
                            width='17%'
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
