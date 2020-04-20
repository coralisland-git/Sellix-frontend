import React from 'react'
import {connect} from 'react-redux'
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
import { Loader, Spin } from 'components'
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import {
  CommonActions,
} from 'services/global'
import ProductCard from "../product_shop/productCard"
import VirtualDraggableGrid from 'react-virtual-draggable-grid';
import { DragAndDropGrid } from './dragAndDropGrid2'


import * as ProductActions from './actions'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    product_list: state.product.all_products
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(ProductActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  })
}

const ProductCardExtended = ({ product }) => (
    <div style={{ background: 'white', marginRight: '15px', marginLeft: '15px', borderRadius: '5px' }}>
      <ProductCard product={product} preventDefault />
    </div>
)

class Product extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      saving: false,
      product_list: []
    }

    this.initializeData = this.initializeData.bind(this)
    this.handleRLDDChange = this.handleRLDDChange.bind(this);
  }

  componentDidMount () {
    this.initializeData()
  }

  async initializeData () {
    this.setState({ loading: true })
    this.props.actions.getProductList().then(res => {
      this.setState({product_list: res.data.products, loading: false})
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Seomthing went wrong!')
      this.setState({ loading: false })
    })
  }

  saveOrder() {
    const order = this.state.product_list.map(product => product.uniqid).join()

    this.setState({saving: true})
    this.props.actions.saveProductOrder({
      products_ids: order
    }).then(res => {
      this.props.commonActions.tostifyAlert('success', res.message)
      this.setState({ saving: false })
    }).catch(err => {
      this.props.commonActions.tostifyAlert('error', err.error || 'Seomthing went wrong!')
      this.setState({ saving: false })
    })
  }

  handleRLDDChange(reorderedItems) {
    this.setState({ product_list: reorderedItems });
  }

  render() {
    let { loading, product_list, saving } = this.state

    product_list = product_list.map((product, key) => {
      return {...product, id: parseInt(product.id)}
    })
    
    return (
      <div className="productsort-screen">
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Sort Products</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                    <Button className="ml-3" color="primary" onClick={this.saveOrder.bind(this)} disabled={saving}>
                      {saving?<Spin/>:'Update Product Order'}</Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
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
                        {/* <RLDD
                          cssClasses="product-list"
                          items={product_list}
                          itemRenderer={(product) => (
                            <div className="item">
                              <p className="body mb-0"><i className="fa fa-bars mr-3"></i>{product.title}</p>
                            </div>
                          )}
                          onChange={this.handleRLDDChange}
                        /> */}

                        {/* <DragDropContext onDragEnd={this.onDragEnd}>
                          <Droppable droppableId="droppable" direction="horizontal">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                // style={getListStyle(snapshot.isDraggingOver)}
                              >
                                {product_list.map((item, index) => (
                                  <Draggable key={item.uniqid} draggableId={item.uniqid} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        // style={getItemStyle(
                                        //   snapshot.isDragging,
                                        //   provided.draggableProps.style
                                        // )}
                                      >
                                        {productCard(item, index, () => {})}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext> */}

                        <DragAndDropGrid
                            items={product_list}
                            ItemComponent={ProductCardExtended}
                            itemToProps={product => ({ product })}
                            handleChange={this.handleRLDDChange}
                         />
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
