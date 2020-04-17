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
  ButtonGroup,
  Input
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import { Loader } from 'components'
import { tableOptions } from 'constants/tableoptions'
import { NewWebhookModal } from './sections'

import * as ProductActions from './actions'
import './style.scss'

const mapStateToProps = (state) => {
  return ({
    product_list: state.product.product_list
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    productActions: bindActionCreators(ProductActions, dispatch)
  })
}

class Webhooks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      openModal: false
    }

    this.initializeData = this.initializeData.bind(this)
    this.caretRender = this.caretRender.bind(this)
  }

  componentDidMount () {
    this.initializeData()
  }

  initializeData () {
    // this.props.productActions.getProductList().then(res => {
    //   if (res.status === 200) {
    //     this.setState({ loading: false })
    //   }
    // })
    this.props.productActions.getProductList()
    this.setState({ loading: false })
  }

  renderStatus (cell, row) {
    if (
      row.status
    ) {
      return (
        <div className={`badge badge-${row.status.toLowerCase()}`} style={{ margin: '0 auto' }}>
          {row.status}
        </div>
      )  
    } else {
      return (
        <p className="caption">No specified</p>
      )
    }
  }

  renderOptions(cell, row) {
    return (
      <div className="d-flex actions">
        <a>
          <i className="bx bx-edit-alt"/>
        </a>
        <a>
          <i className="bx bx-trash-alt"/>
        </a>
      </div>
    )
  }

  openNewWebhookModal() {
    this.setState({openModal: true})
  }

  closeNewWebhookModal() {
    this.setState({openModal: false})
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
    const { loading, openModal } = this.state
    const { product_list } = this.props


    return (
      <div className="product-screen">
        <div className="animated fadeIn">
          <NewWebhookModal openModal={openModal} closeModal={this.closeNewWebhookModal.bind(this)}/>
          <Card className="grey">
            <CardHeader>
              <Row style={{alignItems: 'center'}}>
                <Col md={4}>
                  <h1>Webhook Endpoints</h1>
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-end">
                    <div className="searchbar white">
                      <i className="fas fa-search"/>
                      <Input placeholder="Search..." className="header-search-input"></Input>
                    </div>
                    <Button className="ml-3" color="primary" onClick={this.openNewWebhookModal.bind(this)}>
                      Webhook Endpoints</Button>
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
                          options={ tableOptions() }
                          data={product_list}
                          version="4"
                          pagination
                          totalSize={product_list ? product_list.length : 0}
                          className="product-table"
                          trClassName="cursor-pointer"
                        >
                          <TableHeaderColumn
                            isKey
                            dataField="url"
                            caretRender={this.caretRender}
                            dataSort
                            width="40%"
                          >
                            Webhook URL
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="events"
                            caretRender={this.caretRender}
                            dataAlign="center"
                            dataSort
                            width="20%"
                          >
                            Events
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="status"
                            caretRender={this.caretRender}
                            dataSort
                            dataAlign="center"
                            dataFormat={this.renderStatus}
                            width="20%"
                          >
                            Status
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField="id"
                            dataAlign="right"
                            width="20%"
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

export default connect(mapStateToProps, mapDispatchToProps)(Webhooks)
