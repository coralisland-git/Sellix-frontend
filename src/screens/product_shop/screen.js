import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {Card, CardHeader, Row, Col, Input } from 'reactstrap'
import { Button } from 'components';
import { CommonActions } from 'services/global'
import { Route, Switch, withRouter, matchPath } from 'react-router-dom'
import { Loader, LoaderFullscreen } from 'components'
import { debounce } from 'lodash'

import './style.scss'
import Placeholder from "./placeholder";

import ProductList from './productList'


const mapStateToProps = ({ common: { general_info } }) => ({
  shop_search_enabled: Number(general_info.shop_search_enabled),
  shop_hide_out_of_stock: Number(general_info.shop_hide_out_of_stock),
  user: general_info,
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(CommonActions, dispatch)
})


class ShopProducts extends React.Component {
  
  constructor(props) {
    super(props);


    const match = matchPath(props.location.pathname, { path: '/:username/category/:id' })

    this.state = {
      loading: false,
      showPlaceholder: false,
      search_key: null,
      products: [],
      groups: [],
      categories: [],
      filter: match ? match.params.id : 'all'
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { user } = this.props;
    let { categories, filter } = this.state;

    if(prevProps.user !== user) {
      document.title = `${user ? user.username ? user.username + " |" : "" : ""} Sellix`;
    }

    if(filter === 'all') {
      document.title = `${user ? user.username ? user.username + " |" : "" : ""} Sellix`;
    } else {
      if(categories.length) {
        document.title = `Category: ${categories.find(({ uniqid }) => uniqid === filter).title} | Sellix`;
      } else {
        if(categories.length !== prevState.categories.length) {
          document.title = `Category: ${categories.find(({ uniqid }) => uniqid === filter).title} | Sellix`;
        }
      }
    }
  }

  componentDidMount () {
    const { user } = this.props;
    document.title = `${user ? user.username ? user.username + " |" : "" : ""} Sellix`;

    if(this.state.categories.length > 0 && this.state.filter !== 'all') {
      this.state.categories.categories.map(({ uniqid, title }) => {
        if(this.state.filter === uniqid) {
          document.title = `Category: ${title} | Sellix`;
        }
      })
    }
    this.initializeData()
  }

  initializeData = () => {

    const { actions: { getUserCategories, getUserProducts, tostifyAlert }, match: { params } } = this.props;

    let loader = setTimeout(() => {
      this.setState({ showPlaceholder: true });
    }, 200);

    this.setState({ loading: true });

    Promise.all([getUserCategories(params.username), getUserProducts(params.username)])
        .then(([{ data: { categories } }, { data: { products, groups }} ]) => {
          this.setState({
            updatedProducts: products,
            products,
            groups,
            categories
          })
        })
        .catch(err => {
          tostifyAlert('error', err.error)
        })
        .finally(err => {
          clearTimeout(loader);
          this.setState({ loading: false, showPlaceholder: false })
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

    let category = filter !== 'all' && categories.length ? categories.find(({ uniqid }) => uniqid === filter ).products_bound : products;
    let productsByCategory = products.filter(({ uniqid: id }) => category.find(({ uniqid }) => uniqid === id))

    return search_key ?
        productsByCategory.filter(({ title, stock }) =>
          title.toLowerCase().includes(search_key.toLowerCase()) ||
          stock.toLowerCase().includes(search_key.toLowerCase())
        ) : productsByCategory
  }

  searchGroups = () => {
    const { search_key, filter, groups, categories } = this.state;

    let category = filter !== 'all' && categories.length ? categories.find(({ uniqid }) => uniqid === filter ) : null;
    let groupsByCategory = category ? groups.filter(({ products_bound }) => products_bound.find(({ uniqid: id }) => category.products_bound.find(({uniqid}) => uniqid === id))) : groups

    return search_key ?
        groupsByCategory.filter(({ title }) =>
          title.toLowerCase().includes(search_key.toLowerCase())
        ) : groupsByCategory
  }


  render() {
    const { loading, showPlaceholder, filter, categories, products, groups } = this.state;
    const { shop_search_enabled, shop_hide_out_of_stock } = this.props;

    let searchProducts = this.searchProducts(products);
    let searchGroups = this.searchGroups(groups)



    return (
      <div className="shop-product-screen">
        <div className="">


            {showPlaceholder && <Placeholder />}

            {!loading && !showPlaceholder &&
              <Card className="grey">
                <CardHeader className="pb-1 pt-3">
                  <Row>
                    {
                      categories.length !== 0 &&
                      <Col md={12} className="filter-button d-flex flex-wrap mb-4">
                        <Button skip color={filter === 'all' ? 'primary' : 'white'} className="mr-2" disabled={loading} onClick={this.setFilter('all')}>
                          All
                        </Button>
                        {categories.map(({ uniqid, title }) =>
                            <Button skip key={uniqid} color={filter === uniqid ? 'primary' : 'white' } className="mr-2" disabled={loading} onClick={this.setFilter(uniqid)}>
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

                <div className="p-0">
                  <Row>
                    <Switch>
                      <Route to={'/:username/category/:id'} render={(props) =>
                          <ProductList
                              products={searchProducts}
                              groups={searchGroups}
                              loading={loading}
                              hide_out_of_stock={shop_hide_out_of_stock}
                              {...props}
                          />} />
                    </Switch>
                  </Row>
                </div>
              </Card>
            }
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopProducts))
