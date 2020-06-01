import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col
} from 'reactstrap'
import { Loader, Spin } from 'components'
import { Button } from 'components';
import {
  CommonActions,
} from 'services/global'
import { DragAndDropGrid } from '../product_sort/dragAndDropGrid2'


import * as CategoryActions from './actions'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    category_list: state.category.category_list
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(CategoryActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

const CategoryCard = ({ category }, key) => (
  <CardBody style={{ background: 'white', marginRight: '15px', marginLeft: '15px', padding: '15px', borderRadius: '5px' }} className="category-card-extended" key={key}>
    <h2 style={{display: 'inline-block'}}>{category.title}</h2> 
    <span className="text-right" style={{float: 'right'}}>{category.products_count} product{category.products_count == 1 ? '' : 's'}</span> <br/>
    {category.products_bound.map((product, key) => <React.Fragment key={key}>{product.title}<br/></React.Fragment>)}
  </CardBody>
)

class CategorySort extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      saving: false,
      category_list: []
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleRLDDChange = this.handleRLDDChange.bind(this);
  }

  componentDidMount () {
    this.initializeData()
  }

  async initializeData () {
    this.setState({ loading: true })
    this.props.actions.getCategoryList().then(res => {
      this.setState({category_list: res.data.categories, loading: false})
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
      this.setState({ loading: false })
    })
  }

  handleRLDDChange(reorderedItems) {
    this.setState({ category_list: reorderedItems });
  }


  saveOrder() {
    const order = this.state.category_list.map(category => category.uniqid).join()

    this.setState({saving: true})
    this.props.actions.saveCategoryOrder({
      categories_ids: order
    }).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.setState({ saving: false })
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Something went wrong!')
      this.setState({ saving: false })
    })
  }

  render() {
    let { loading, category_list, saving } = this.state

    category_list = category_list.map((category, key) => {
      return {...category, id: parseInt(category.id)}
    })

    return (
      <div className="categorysort-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Sort Categories</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                  <Button className="ml-3" color="primary" onClick={this.saveOrder.bind(this)} disabled={saving}>
                      {saving?<Spin/>:'Update Category Order'}</Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <div>
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
                      <DragAndDropGrid
                            items={category_list}
                            ItemComponent={CategoryCard}
                            itemToProps={category => ({ category })}
                            handleChange={this.handleRLDDChange}
                         />
                      </div>
                    </Col>
                  </Row>
              }
            </div>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySort)
