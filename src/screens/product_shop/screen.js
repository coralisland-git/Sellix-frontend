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

import './style.scss'
import { productCard } from './productCard'

const mapStateToProps = (state) => {
  return ({
    user_categories: state.common.user_categories,
    user_products: state.common.user_products,
    user: state.common.general_info,
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
    const { user_categories, user_products, user } = this.props

    const all_products = search_key?this.searchProducts(user_products):user_products

    return (
      <div className="shop-product-screen">
        <div className="animated fadeIn">
          <Card className="grey">
            <CardHeader className="pb-1 pt-3">
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
                {
                  user.shop_search_enabled == '1' && 
                    <Col md={12} className="mb-4">
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
                }
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
                          {productCard(pro, index, (e) => this.gotoDetail(e, pro.uniqid))}
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
