import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {Card, CardHeader, Button, Row, Col, Input, CardBody} from 'reactstrap'
import { CommonActions } from 'services/global'
import { Route, Switch } from 'react-router-dom'
import { Loader } from 'components'
import { debounce } from 'lodash'

import './style.scss'


const ProductList = React.lazy(() => import('./productList'))


const mapStateToProps = ({ common }) => ({
  shop_search_enabled: Number(common.general_info.shop_search_enabled)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(CommonActions, dispatch)
})


class ShopProducts extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      search_key: null,
      products: [],
      categories: [],
      filter: props.match.params.id || 'all'
    }
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData = () => {

    const { actions: { getUserCategories, getUserProducts, tostifyAlert }, match: { params } } = this.props;

    this.setState({ loading: true });

    Promise.all([getUserCategories(params.username), getUserProducts(params.username)])
        .then(([{ data: { categories } }, { data: { products }} ]) => {
          this.setState({
            updatedProducts: products,
            products,
            categories
          })
        })
        .catch(err => {
          tostifyAlert('error', err.error)
        })
        .finally(err => {
          this.setState({ loading: false })
        })
  }


  setFilter = (filter) => () => {

    const { username } = this.props.match.params;

    this.setState({ filter });

    this.props.history.push(filter === 'all' ? `/${username}` : `/${username}/category/${filter}`);
  }

  setSearchKey = debounce((search_key) => this.setState({ search_key }), 300);

  searchProducts = () => {    
    const { search_key, filter, products, categories } = this.state;

    let category = filter !== 'all' ? categories.find(({ uniqid }) => uniqid === filter ).products_bound : products;
    let productsByCategory = products.filter(({ uniqid: id }) => category.find(({ uniqid }) => uniqid === id))

    return search_key ?
        productsByCategory.filter(({ title, stock }) =>
          title.toLowerCase().includes(search_key.toLowerCase()) ||
          stock.toLowerCase().includes(search_key.toLowerCase())
        ) : productsByCategory
  }


  render() {
    const { loading, filter, categories, products } = this.state;
    const { shop_search_enabled } = this.props;

    let searchProducts = products.length > 0?this.searchProducts(products):[];

    return (
      <div className="shop-product-screen">
        <div className="animated customAnimation">
          <Card className="grey">
            <CardHeader className="pb-1 pt-3">
              <Row>
                {
                  categories.length !== 0 &&
                    <Col md={12} className="filter-button d-flex flex-wrap mb-4">
                      <Button color={filter === 'all' ? 'primary' : 'white'} className="mr-2" disabled={loading} onClick={this.setFilter('all')}>
                        All
                      </Button>
                      {categories.map(({ uniqid, title }) =>
                        <Button key={uniqid} color={filter === uniqid ? 'primary' : 'white' } className="mr-2" disabled={loading} onClick={this.setFilter(uniqid)}>
                          {title}
                        </Button>
                      )}
                    </Col>
                }

                {
                  shop_search_enabled === 1 &&
                    <Col md={12} className="mb-4">
                      <div className="d-flex justify-content-start">
                        <div className="searchbar white w-100">
                          <i className="fas fa-search"/>
                          <Input
                              placeholder="Search for a product..."
                              className="header-search-input"
                              onChange={(e) => this.setSearchKey(e.target.value)}
                          />
                        </div>
                      </div>
                    </Col>
                }
              </Row>
            </CardHeader>

            <React.Suspense fallback={<Loader />}>
              <div className="p-0">
                <Row>
                  <Switch>
                    <Route to={'/:username/category/:id'} render={(props) => <ProductList products={searchProducts} loading={loading} {...props} />} />
                  </Switch>
                </Row>
              </div>
            </React.Suspense>

          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopProducts)
