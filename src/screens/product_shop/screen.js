import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import TextEllipsis from 'react-text-ellipsis';
import config from 'constants/config'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Input
} from 'reactstrap'
import { Loader } from 'components'
import {
  CommonActions
} from 'services/global'
import shop_brand from 'assets/images/brand/shop_brand.png'

import * as ProductActions from './actions'
import './style.scss'



const CURRENCY_LIST = { 
  'USD': '$',
  'EUR': '€',
  'AUD': '$',
  'GBP': '£',
  'JPY': '¥',
  'CAD': '$',
  'CHF': '₣',
  'CNY': '¥',
  'SEK': 'kr',
  'NZD': '$'
}

const mapStateToProps = (state) => {
  return ({
    user_categories: state.common.user_categories,
    user_products: state.common.user_products
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

class ShopProducts extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      search_key: null,
      filter: this.props.match.params.id || 'all'
    }

    this.initializeData = this.initializeData.bind(this)
    this.filterProduct = this.filterProduct.bind(this)
    this.gotoDetail = this.gotoDetail.bind(this)
    this.getProductStock = this.getProductStock.bind(this)
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData () {
    this.props.commonActions.getUserCategories(this.props.match.params.username).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    })

    const filter = this.props.match.params.id || 'all'

    if(filter == 'all')
      this.getAllProducts()
    else this.getCategoryProducts()
  }


  getAllProducts() {
    this.setState({loading:true})
    this.props.commonActions.getUserProducts(this.props.match.params.username).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  getCategoryProducts() {
    this.setState({loading: true})
    this.props.commonActions.getUserProductsByCategory(this.props.match.params.id).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error)
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  filterProduct(filter) {
    if(filter == 'all')
      this.props.history.push(`/${this.props.match.params.username}`)
    else {
      this.props.history.push(`/${this.props.match.params.username}/category/${filter}`)
      this.setState({filter: filter, loading: true})
      this.props.commonActions.getUserProductsByCategory(filter).catch(err => {
        this.props.commonActions.tostifyAlert('error', err.error)
      }).finally(() => {
        this.setState({loading: false})
      })
    }
  }

  gotoDetail(e, id) {
    this.props.history.push({
      pathname: `/product/${id}`
    })
  }

  getProductStock(product) {
    if(product.type == 'file')
      return product.file_stock == '-1'?'∞':product.file_stock
    
    if(product.type == 'serials')
      return product.stock == '-1'?'∞':product.stock

    if(product.type == 'service')
      return product.service_stock == '-1'?'∞':product.service_stock
  }

  searchProducts(products) {
    const { search_key } = this.state
    const search_fields = ['title', 'stock']

    const data = products.filter(product => {
      for(let i=0; i<search_fields.length; i++)
        if(product[search_fields[i]] && product[search_fields[i]].toLowerCase().includes(search_key.toLowerCase()))
          return true
      return false
    })

    return data
  }

  render() {
    const { loading, filter, search_key } = this.state
    const { user_categories, user_products } = this.props

    const all_products = search_key?this.searchProducts(user_products):user_products

    return (
      <div className="shop-product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader>
              <Row>
                {
                  user_categories.length !=0 && 
                    <Col md={12} className="filter-button d-flex flex-wrap mb-4">
                      <Button color={filter == 'all'?'primary':'white'} className="mr-2" disabled={loading}
                        onClick={() => this.filterProduct('all')}>All</Button>
                      {
                        user_categories.map(category => 
                          <Button key={category.uniqid} color={filter == category.uniqid?'primary':'white'} className="mr-2" disabled={loading}
                            onClick={() => this.filterProduct(category.uniqid)}>{category.title}</Button>)
                      }
                    </Col>
                }
                
                <Col md={12} className="mb-3">
                  <div className="d-flex justify-content-start">
                    <div className="searchbar white w-100">
                      <i className="fas fa-search"/>
                      <Input placeholder="Search for a product..." 
                        className="header-search-input"
                        onChange={e => {this.setState({search_key: e.target.value})}}
                      ></Input>
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
                    {
                      all_products.map((pro, index) => 
                        <Col md={3} key={index} className="mb-4">
                          <Card className="bg-white p-0 product-card" onClick={(e) => this.gotoDetail(e, pro.uniqid)}>
                            <div style={{minHeight: 150, width: '100%'}}>
                              {
                                pro.image_attachment && 
                                  <img src={config.API_ROOT_URL+'/attachments/image/'+pro.image_attachment} 
                                    alt={pro.title} 
                                    width="100%" height="150"/>
                              }
                            </div>
                            
                            <div className="p-3 d-flex flex-column h-100">
                              <h5 className="mb-1 text-black">
                                {pro.title}
                              </h5>
                              <div className="d-flex justify-content-between mt-1">
                                <span className="price">{`${CURRENCY_LIST[pro.currency]}${pro.price_display}`}</span>
                                <span className="stock">Stock: <span className="stock-size">
                                  {this.getProductStock(pro)}
                                </span></span>
                              </div>
                            </div> 
                          </Card>
                        </Col>
                      )
                    }
                    {all_products.length == 0 && <p className="mt-4 mb-4 text-center text-grey w-100">No Products Found</p>}
                  </Row>
              }
              
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopProducts)
